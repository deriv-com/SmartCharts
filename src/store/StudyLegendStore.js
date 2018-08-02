import { observable, action, when } from 'mobx';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import SettingsDialogStore from './SettingsDialogStore';
// TODO:
// import StudyInfo from '../study-info';

export default class StudyLegendStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this.menu = new MenuStore(mainStore, { route:'indicators' });
        this.categoricalDisplay = new CategoricalDisplayStore({
            activeOptions: [
                { id: 'edit', onClick: item => this.editStudy(item) },
                { id: 'delete', onClick: item => this.deleteStudy(item) },
            ],
            getIsShown: () => this.menu.open,
            getCategoricalItems: () => this.categorizedStudies,
            getActiveCategory: () => this.activeStudies,
            onSelectItem: this.onSelectItem.bind(this),
            placeholderText: t.translate('"Mass Index" or "Doji Star"'),
            favoritesId: 'indicators',
            mainStore,
        });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: () => this.deleteStudy(this.helper),
            onStared: () => this.starStudy(this.helper),
            onChanged: items => this.updateStudy(this.helper.sd, items),
        });
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.stx.callbacks.studyOverlayEdit = this.editStudy;
        this.stx.callbacks.studyPanelEdit = this.editStudy;
        this.stx.append('createDataSet', this.renderLegend);
        this.renderLegend();
    };

    previousStudies = { };
    @observable activeStudies = {
        categoryName: t.translate('Active'),
        categoryId: 'active',
        hasSubcategory: false,
        emptyDescription: t.translate('There are no active indicators yet.'),
        data: [],
    };

    get categorizedStudies() {
        const data = [];
        Object.keys(CIQ.Studies.studyLibrary).forEach((studyId) => {
            const study = CIQ.Studies.studyLibrary[studyId];
            data.push({
                enabled: true,
                display: t.translate(study.name),
                dataObject: studyId,
                itemId: studyId,
            });
        });
        const category = {
            categoryName: t.translate('Indicators'),
            categoryId: 'indicators',
            hasSubcategory: false,
            data,
        };
        return [category];
    }

    @action.bound onSelectItem(item) {
        const sd = CIQ.Studies.addStudy(this.stx, item);
        this.changeStudyPanelTitle(sd);
        this.menu.setOpen(false);
    }

    @action.bound editStudy(study) {
        const helper = new CIQ.Studies.DialogHelper(study);
        this.helper = helper;

        const attributes = helper.attributes;
        const inputs = helper.inputs.map(inp => ({
            id: inp.name,
            title: t.translate(inp.heading),
            value: inp.value,
            defaultValue: inp.defaultInput,
            type: inp.type === 'checkbox' ? 'switch' : inp.type,
            options: inp.options || null,
            ...attributes[inp.name], // {min:1, max: 20}
            category: 'inputs',
        }));
        const outputs = helper.outputs.map(out => ({
            id: out.name,
            title: t.translate(out.heading),
            defaultValue: out.defaultOutput,
            value: out.color,
            type: 'colorpicker',
            category: 'outputs',
        }));
        const parameters = helper.parameters.map((par) => {
            const shared = {
                title: t.translate(par.heading),
                ...attributes[par.name],
                category: 'parameters',
            };
            if (par.defaultValue.constructor === Boolean) {
                return {
                    ...shared,
                    id: `${par.name}Enabled`,
                    value: par.value,
                    defaultValue: par.defaultValue,
                    type: 'switch',
                };
            } else if (par.defaultValue.constructor === Number) {
                return {
                    ...shared,
                    id: par.name,
                    type: 'numbercolorpicker',
                    defaultValue: {
                        Color: par.defaultColor,
                        Value: par.defaultValue,
                    },
                    value: {
                        Color: par.color,
                        Value: par.value,
                    },
                };
            }
            throw new Error('Unrecognised parameter!');
        });

        this.settingsDialog.items = [...outputs, ...inputs, ...parameters];
        this.settingsDialog.title = study.sd.libraryEntry.name;
        // TODO:
        // const description = StudyInfo[study.sd.type];
        // this.settingsDialog.description = description || t.translate("No description yet");
        this.settingsDialog.description = '';
        this.settingsDialog.stared = !!this.categoricalDisplay.favoritesMap[helper.name];
        this.settingsDialog.setOpen(true);
    }
    @action.bound starStudy(study) {
        this.categoricalDisplay.setFavoriteById(study.name);
    }
    @action.bound deleteStudy(study) {
        const sd = study.sd;
        if (!sd.permanent) {
            // Need to run this in the nextTick because the study legend can be removed by this click
            // causing the underlying chart to receive the mousedown (on IE win7)
            setTimeout(() => {
                CIQ.Studies.removeStudy(this.stx, sd);
                this.renderLegend();
            }, 0);
        }
    }
    @action.bound updateStudy(study, items) {
        const updates = { };
        for (const { id, category, value } of items) {
            if (study[category][id] !== value) {
                updates[category] = updates[category] || { };
                if (typeof value === 'object') {
                    for (const suffix in value) {
                        updates[category][`${id}${suffix}`] = value[suffix];
                    }
                } else {
                    updates[category][id] = value;
                }
            }
        }
        this.helper.updateStudy(updates);
        this.updateActiveStudies();
        this.stx.draw();
        this.changeStudyPanelTitle(this.helper.sd);
        this.settingsDialog.title = this.helper.sd.libraryEntry.name;
    }

    changeStudyPanelTitle(sd) {
        // Remove numbers from the end of indicator titles in mobile
        if (this.mainStore.chart.isMobile) {
            this.stx.panels[sd.panel].display = sd.type;
            this.stx.draw();
            this.mainStore.chart.saveLayout();
        }
    }

    shouldRenderLegend() {
        const stx = this.stx;
        if (!stx.layout.studies) { return false; }

        // Logic to determine if the studies have changed, otherwise don't re-create the legend
        if (CIQ.objLength(this.previousStudies) === CIQ.objLength(stx.layout.studies)) {
            let foundAChange = false;
            for (const id in stx.layout.studies) {
                if (!this.previousStudies[id]) {
                    foundAChange = true;
                    break;
                }
            }
            if (!foundAChange) { return false; }
        }

        this.previousStudies = CIQ.shallowClone(stx.layout.studies);
        return true;
    }

    /**
     * Gets called continually in the draw animation loop.
     * Be careful not to render unnecessarily. */
    renderLegend = () => {
        if (!this.shouldRenderLegend()) { return; }

        this.updateActiveStudies();
    };

    @action.bound updateActiveStudies() {
        const stx = this.stx;
        const studies = [];
        Object.keys(stx.layout.studies).forEach((id) => {
            const sd = stx.layout.studies[id];
            if (sd.customLegend) { return; }

            studies.push({
                enabled: true,
                display:this.mainStore.chart.isMobile ? sd.libraryEntry.name : sd.inputs.display,
                dataObject: {
                    stx,
                    sd,
                    inputs: sd.inputs,
                    outputs: sd.outputs,
                    parameters: sd.parameters,
                },
            });
        });

        this.activeStudies.data = studies;
    }

    @action.bound clearStudies() {
        if (this.context) {
            this.context.advertised.Layout.clearStudies();
        }
    }
}
