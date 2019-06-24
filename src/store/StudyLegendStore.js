import { observable, action, when } from 'mobx';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import SettingsDialogStore from './SettingsDialogStore';
import SettingsDialog from '../components/SettingsDialog.jsx';
import Menu from '../components/Menu.jsx';
import { CategoricalDisplay } from '../components/categoricaldisplay';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

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
            searchInputClassName: () => this.searchInputClassName,
            limitInfo: t.translate('Up to 5 active indicators allowed.'),
        });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onDeleted: () => this.deleteStudy(this.helper),
            favoritesId: 'indicators',
            onChanged: items => this.updateStudy(this.helper.sd, items),
        });
        this.StudyCategoricalDisplay = this.categoricalDisplay.connect(CategoricalDisplay);
        this.StudyMenu = this.menu.connect(Menu);
        this.StudySettingsDialog = this.settingsDialog.connect(SettingsDialog);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.stx.callbacks.studyOverlayEdit = this.editStudy;
        this.stx.callbacks.studyPanelEdit = this.editStudy;
        // to remove studies if user has already more than 5
        this.removeExtraStudies();
        this.stx.append('createDataSet', this.renderLegend);
        this.stx.append('drawPanels', () => {
            const panel = Object.keys(this.stx.panels)[1];
            if (panel) {
                // Hide the up arrow from first indicator to prevent user
                // from moving the indicator panel above the main chart
                this.stx.panels[panel].up.style.display = 'none';
            }
        });
        this.renderLegend();
    };

    previousStudies = { };
    searchInputClassName;
    @observable hasReachedLimits = false;
    @observable activeStudies = {
        categoryName: t.translate('Active'),
        categoryNamePostfix: '',
        categoryId: 'active',
        hasSubcategory: false,
        emptyDescription: t.translate('There are no active indicators yet.'),
        data: [],
    };

    get categorizedStudies() {
        const data = [];
        const excludedStudies = { Beta: true };
        Object.keys(CIQ.Studies.studyLibrary).forEach((studyId) => {
            if (!excludedStudies[studyId]) {
                const study = CIQ.Studies.studyLibrary[studyId];
                data.push({
                    enabled: true,
                    display: t.translate(study.name),
                    dataObject: studyId,
                    itemId: studyId,
                });
            }
        });
        const categoryNamePostfix = `(${this.activeStudies.data.length}/5)`;
        const category = {
            categoryName: t.translate('Indicators'),
            categoryNamePostfix,
            categoryNamePostfixShowIfActive: true,
            categoryId: 'indicators',
            categorySubtitle: t.translate('Up to 5 active indicators allowed.'),
            hasSubcategory: false,
            data,
        };
        return [category];
    }

    @action.bound removeExtraStudies() {
        if (this.stx.layout && this.stx.layout.studies) {
            const studiesKeys = Object.keys(this.stx.layout.studies);
            if (studiesKeys.length > 5) {
                Object.keys(this.stx.layout.studies).forEach((study, idx) => {
                    if (idx >= 5) {
                        setTimeout(() => {
                            CIQ.Studies.removeStudy(this.stx, this.stx.layout.studies[study]);
                            this.renderLegend();
                        }, 0);
                    }
                });
            }
        }
    }

    @action.bound onSelectItem(item) {
        if (this.stx.layout && Object.keys(this.stx.layout.studies || []).length < 5) {
            const sd = CIQ.Studies.addStudy(this.stx, item);
            this.changeStudyPanelTitle(sd);
            logEvent(LogCategories.ChartControl, LogActions.Indicator, `Add ${item}`);
            this.menu.setOpen(false);
        }
    }

    // Temporary prevent user from adding more than 5 indicators
    // TODO All traces can be removed after new design for studies
    @action.bound updateStyle() {
        const should_minimise_last_digit = Object.keys(this.stx.panels).length > 2;
        this.mainStore.state.setShouldMinimiseLastDigit(should_minimise_last_digit);
    }

    @action.bound updateProps({ searchInputClassName }) {
        this.searchInputClassName = searchInputClassName;
    }

    @action.bound editStudy(study) {
        const helper = new CIQ.Studies.DialogHelper(study);
        this.helper = helper;
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Edit ${helper.name}`);

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
            }

            if (par.defaultValue.constructor === Number) {
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

        this.settingsDialog.id = study.sd.type;
        this.settingsDialog.items = [...outputs, ...inputs, ...parameters];
        this.settingsDialog.title = t.translate(study.sd.libraryEntry.name);
        // TODO:
        // const description = StudyInfo[study.sd.type];
        // this.settingsDialog.description = description || t.translate("No description yet");
        this.settingsDialog.description = '';
        this.settingsDialog.setOpen(true);
    }

    @action.bound deleteStudy(study) {
        const sd = study.sd;
        logEvent(LogCategories.ChartControl, LogActions.Indicator, `Remove ${sd.name}`);
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
        for (const { id, category, value, type } of items) {
            let isChanged;
            if (type === 'numbercolorpicker') {
                isChanged = study[category][`${id}Color`] !== value.Color
                    || study[category][`${id}Value`] !== value.Value;
            } else {
                isChanged = study[category][id] !== value;
            }

            if (isChanged) {
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
        if (Object.keys(updates).length === 0) return;
        this.helper.updateStudy(updates);
        this.updateActiveStudies();
        this.stx.draw();
        this.changeStudyPanelTitle(this.helper.sd);
        this.settingsDialog.title = t.translate(this.helper.sd.libraryEntry.name);
    }

    changeStudyPanelTitle(sd) {
        // Remove numbers from the end of indicator titles in mobile
        if (this.mainStore.chart.isMobile) {
            this.stx.panels[sd.panel].display = sd.type;
            this.stx.draw();
            this.mainStore.state.saveLayout();
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
        // Temporary prevent user from adding more than 5 indicators
        // All traces can be removed after new design for studies
        this.updateStyle();
    };

    @action.bound setReachedLimit() {
        const hasReachedLimit = this.activeStudies.data.length >= 5;
        this.hasReachedLimits = hasReachedLimit;
    }

    @action.bound updateActiveStudies() {
        const stx = this.stx;
        const studies = [];
        Object.keys(stx.layout.studies || []).forEach((id) => {
            const sd = stx.layout.studies[id];
            if (sd.customLegend) { return; }

            studies.push({
                enabled: true,
                display:this.mainStore.chart.isMobile ? t.translate(sd.libraryEntry.name) : sd.inputs.display,
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
        this.activeStudies.categoryNamePostfix = `(${studies.length}/5)`;
        this.setReachedLimit();
    }

    @action.bound clearStudies() {
        if (this.context) {
            this.context.advertised.Layout.clearStudies();
        }
    }
}
