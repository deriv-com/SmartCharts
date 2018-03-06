import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import SettingsDialogStore from './SettingsDialogStore';

export default class StudyLegendStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this.menu = new MenuStore({getContext: () => this.context});
        this.list = new ListStore({
            getIsOpen: () => this.menu.open,
            getContext: () => this.context,
            onItemSelected: item => {
                let sd = CIQ.Studies.addStudy(this.stx, item.id);
            },
            getItems: () => Object.keys(CIQ.Studies.studyLibrary).map(key => ({
                id: key,
                text: CIQ.Studies.studyLibrary[key].name,
            })),
        });
        this.settingsDialog = new SettingsDialogStore({
            getContext: () => this.mainStore.chart.context,
            onDeleted: () => this.deleteStudy(this.helper.sd),
            onStared: () => this.starStudy(this.helper.sd),
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

    @observable studies = [];

    begin() {
        this.stx.callbacks.studyOverlayEdit = study => this.editStudy(study);
        this.stx.callbacks.studyPanelEdit = study => this.editStudy(study);
        // this.injections.push(this.stx.append('createDataSet', () => this.renderLegend()));
        // this.renderLegend();
    }

    @action.bound editStudy(study) {
        const helper = new CIQ.Studies.DialogHelper(study);
        this.helper = helper;

        const attributes = helper.attributes;
        const inputs = helper.inputs.map(inp => ({
            id: inp.name,
            title: inp.heading,
            value: study.inputs[inp.name],
            defaultValue: inp.defaultInput,
            type: inp.type,
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
        this.settingsDialog.setOpen(true);
    }
    @action.bound deleteStudy(study) {
        CIQ.Studies.removeStudy(this.stx, study);
    }
    @action.bound starStudy(study) {
        console.error('STAR STUDY NOT IMPLEMENTED YET', study);
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

            let closeFunc;
            if (!sd.permanent) {
                // Need to run this in the nextTick because the study legend can be removed by this click
                // causing the underlying chart to receive the mousedown (on IE win7)
                closeFunc = (e) => setTimeout(
                    () => {
                        CIQ.Studies.removeStudy(this.stx, sd);
                        this.renderLegend();
                    }, 0
                );

            }

            const editFunc = (e) => {
                const stx = this.stx;
                if (!sd.editFunction) { return; }
                e.stopPropagation();

                let studyEdit = this.context.getAdvertised('StudyEdit');
                let params = {
                    stx,
                    sd,
                    inputs: sd.inputs,
                    outputs: sd.outputs,
                    parameters: sd.parameters,
                };
                studyEdit.editPanel(params);
                this.menu.open = false;
            };

            studies.push({
                display: sd.inputs.display,
                closeFunc,
                editFunc,
            });
        });

        this.studies = studies;
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