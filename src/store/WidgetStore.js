import { observable, action, when } from 'mobx';

export default class WidgetStore {
    @observable stx;

    get chart() { return this.mainStore.chart; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => { this.stx = this.mainStore.chart.context.stx; };

    @action.bound onHome() {
        this.stx.home();
    }

    @action.bound onFullscreen() {
        this.chart.onFullScreen();
    }
}
