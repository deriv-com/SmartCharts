import { observable, action, computed, autorunAsync } from 'mobx';
import MenuStore from './MenuStore';

export default class StudyLegendStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        autorunAsync(this.onContextReady.bind(this));
        this.menu = new MenuStore(mainStore);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady() {
        if(this.context) {
            this.begin();
        }
    }

    injections = [];
    previousStudies = { };

    @observable studies = [];

    begin() {
        this.injections.push(this.stx.append('createDataSet', () => this.renderLegend()));
        this.renderLegend();
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
        for (const id in stx.layout.studies) {
            let sd = stx.layout.studies[id];
            if (sd.customLegend) {continue;}

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
                if (!sd.editFunction) {return;}
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
        }

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
