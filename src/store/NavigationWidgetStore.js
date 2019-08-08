import { observable, action, when } from 'mobx';

export default class NavigationWidgetStore {
    @observable isHomeEnabled = false;
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
        this.stxx.addEventListener('move', () => {
            clearTimeout(this.moveTimer);
            this.moveTimer = setTimeout(this.updateHomeButton, 50);
        });
        this.stxx.prepend('mouseWheel', () => {
            this.stxx.chart.lockScroll = false;
        });
    };

    @action.bound updateHomeButton = () => {
        this.isHomeEnabled = !this.stxx.isHome();
    }

    @action.bound onMouseEnter() {
        this.crosshairStore.updateVisibility(false);
    }

    @action.bound onMouseLeave() {
        this.crosshairStore.updateVisibility(true);
    }

    @action.bound onHome() {
        this.isHomeEnabled = false;
        this.stxx.chart.lockAutoScroll = false;
        this.stxx.chart.isScrollLocationChanged = false;
        this.stxx.home();
        this.stxx.draw();
    }

    @action.bound onScale() {
        let point = null;

        this.isHomeEnabled = false;
        const { dataSet } = this.stxx.chart;
        if (dataSet && dataSet.length) point = dataSet[0];

        this.stateStore.scrollChartToLeft(point, true);
    }
}
