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
}
