import { action, when, computed } from 'mobx';

export default class NavigationWidgetStore {
    moveTimer;

    get chart() { return this.mainStore.chart; }
    get stateStore() { return this.mainStore.state; }
    get crosshairStore() { return this.mainStore.crosshair; }
    get stxx() { return this.chart.stxx; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stxx.prepend('mouseWheel', () => {
            this.stxx.chart.lockScroll = false;
        });
    };

    @computed get enableScale() { return this.stateStore.startEpoch; }

    @action.bound onMouseEnter() {
        this.crosshairStore.updateVisibility(false);
    }

    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }

    @action.bound onScale() {
        let point = null;

        const { dataSet } = this.stxx.chart;
        if (dataSet && dataSet.length) point = dataSet[0];

        this.stateStore.scrollChartToLeft(point, true);
    }
}
