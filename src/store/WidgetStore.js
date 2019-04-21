import { observable, action, when } from 'mobx';

export default class WidgetStore {
    @observable stx;

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => { this.stx = this.mainStore.chart.context.stx; };

    @action.bound onHome() {
        this.stx.home();
    }
}
