import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import SettingsDialogStore from './SettingsDialogStore';

export default class StudyLegendStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this.menu = new MenuStore({getContext: () => this.context});
        this.categoricalDisplay = new CategoricalDisplayStore({
            activeOptions: [
                { id: 'edit', onClick: (item) => this.editStudy(item) },
                { id: 'delete', onClick: (item) => this.deleteStudy(item) },
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
            getContext: () => this.mainStore.chart.context,
            onDeleted: () => this.deleteStudy(this.helper),
            onStared: () => this.starStudy(this.helper),
            onChanged: items => this.updateStudy(this.helper.sd, items),
        });
        window.sls = this;
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        window.stx = this.stx;
        this.begin();
    }

    injections = [];
    previousStudies = { };

    @observable activeStudies = {
        categoryName: t.translate('Active'),
        categoryId: 'active',
        hasSubcategory: false,
        emptyDescription: t.translate('There are no active indicators yet.'),
        data: [],
    };

    begin() {
        this.stx.callbacks.studyOverlayEdit = study => this.editStudy(study);
        this.stx.callbacks.studyPanelEdit = study => this.editStudy(study);
        this.injections.push(this.stx.append('createDataSet', () => this.renderLegend()));
        this.renderLegend();
    }

    get categorizedStudies() {
        const data = [];
        Object.keys(CIQ.Studies.studyLibrary).map(studyId => {
            const study = CIQ.Studies.studyLibrary[studyId];
            data.push({
                enabled: true,
                display: study.name,
                dataObject: studyId,
                itemId: studyId,
            });
        });
        const category = {
            categoryName: 'Indicators',
            categoryId: 'indicators',
            hasSubcategory: false,
            data
        };
        return [category];
    }

    @action.bound onSelectItem(item) {
        CIQ.Studies.addStudy(this.stx, item);
        this.menu.setOpen(false);
    }

    @action.bound editStudy(study) {
        const helper = new CIQ.Studies.DialogHelper(study);
        this.helper = helper;

        const attributes = helper.attributes;
        const inputs = helper.inputs.map(inp => ({
            id: inp.name,
            title: inp.heading,
            value: inp.value,
            defaultValue: inp.defaultInput,
            type: inp.type === 'checkbox' ? 'switch' : inp.type,
            options: inp.options || null,
            ...attributes[inp.name], // {min:1, max: 20}
            category: 'inputs',
        }));
        const outputs = helper.outputs.map(out => ({
            id: out.name,
            title: out.heading,
            defaultValue: out.defaultOutput,
            value: out.color,
            type: 'colorpicker',
            category: 'outputs',
        }));
        const parameters = helper.parameters.map(par => ({
            id: par.name,
            title: par.heading,
            value: par.value,
            defaultValue: par.defaultValue,
            type: typeof par.defaultValue === 'boolean' ? 'switch' : 'number+colorpicker',
            color: par.color,
            ...attributes[par.name],
            category: 'parameters',
        }));

        this.settingsDialog.items = [...inputs, ...outputs, ...parameters];
        this.settingsDialog.title = study.sd.name.toUpperCase();
        this.settingsDialog.description = "No description yet";
        this.settingsDialog.setOpen(true);
    }
    @action.bound deleteStudy(study) {
        const sd = study.sd;
        if (!sd.permanent) {
            // Need to run this in the nextTick because the study legend can be removed by this click
            // causing the underlying chart to receive the mousedown (on IE win7)
            setTimeout(
                () => {
                    CIQ.Studies.removeStudy(this.stx, sd);
                    this.renderLegend();
                }, 0
            );
        }
    }
    @action.bound updateStudy(study, items) {
        const updates = { };
        for(const {id, category, value} of items) {
            if(study[category][id] !== value) {
                updates[category] = updates[category] || { };
                updates[category][id] = value;
            }
        }
        this.helper.updateStudy(updates);
        this.stx.draw();
        this.settingsDialog.title = this.helper.sd.name.toUpperCase();
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
    renderLegend() {
        if(!this.shouldRenderLegend()) {return;}

        const stx = this.stx;
        const studies = [];
        Object.keys(stx.layout.studies).forEach(id => {
            let sd = stx.layout.studies[id];
            if (sd.customLegend) { return; }

            studies.push({
                enabled: true,
                display: sd.inputs.display,
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

    @action.bound cleanUp() {
        if (this.context && this.injections) {
            for (const inj of this.injections) {
                this.stx.removeInjection(inj);
            }
            this.injections = [];
        }
    }

    @action.bound clearStudies() {
        if (this.context) {
            this.context.advertised.Layout.clearStudies();
        }
    }
}
