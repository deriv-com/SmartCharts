import { observable, action, when } from 'mobx';

export default class TogglesStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.uiHeadsUpStatic = new CIQ.UI.HeadsUp(
            $('cq-hu-static'),
            this.context,
            { autoStart: this.stx.layout.headsUp }
        );
        this.headsUp = this.stx.layout.headsUp;
        this.crosshair = this.stx.layout.crosshair;
    }

    uiHeadsUpStatic = null;
    priorVectorType = null;
    @observable crosshair = false;
    @observable headsUp = false;
    @observable draw = false;

    @action.bound setCrosshair(value) {
        this.stx.layout.crosshair = value;
        this.stx.doDisplayCrosshairs();
        this.mainStore.chart.saveLayout();
        this.crosshair = value;
    }

    @action.bound setHeadsUp(value) {
        if(value) {
            this.uiHeadsUpStatic.begin();
        } else {
            this.uiHeadsUpStatic.end();
        }
        this.stx.layout.headsUp = value;
        this.mainStore.chart.saveLayout();
        this.headsUp = value;
    }

    @action.bound setDraw(value) {
        const ciqChart = this.context.topNode.querySelector('.ciq-chart');
        if (value) {
            CIQ.appendClassName(ciqChart, 'toolbar-on');
        } else {
            CIQ.unappendClassName(ciqChart, 'toolbar-on');
        }
        // remember last draw tool
        if (value) {
            this.stx.changeVectorType(this.priorVectorType);
        } else {
            this.priorVectorType = this.stx.currentVectorParameters.vectorType;
            this.stx.changeVectorType('');
        }

        this.mainStore.chart.updateHeight();
        this.stx.resizeChart();
        this.draw = value;
        return false;
    }
}
