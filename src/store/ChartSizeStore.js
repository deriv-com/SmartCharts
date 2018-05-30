import { observable, when, action } from 'mobx';

export default class ChartSizeStore {
    @observable stx;

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }
    onContextReady = () => { this.stx = this.mainStore.chart.context.stx; };

    @action.bound zoomIn() {
        if (this.stx) { this.stx.zoomIn(); }
    }

    @action.bound zoomOut() {
        if (this.stx) { this.stx.zoomOut(); }
    }
}

