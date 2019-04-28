import { observable, action, when } from 'mobx';

export default class WidgetStore {
    @observable stx;

    get chart() { return this.mainStore.chart; }
    get stateStore() { return this.mainStore.state; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => { this.stx = this.mainStore.chart.context.stx; };

    @action.bound onHome() {
        this.stx.home();
    }

    @action.bound onScale() {
        if (this.stateStore.scrollToEpoch) {
            this.stateStore.scrollToEpoch = null;
        } else {
            this.stateStore.scrollToEpoch = new Date().valueOf();
        }
        this.stateStore.scrollChartToLeft();
    }
}
