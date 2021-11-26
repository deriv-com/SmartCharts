import { action, computed, observable, reaction, when } from 'mobx';
import { TQuote } from 'src/types';
import MainStore from '.';
import ChartStore from './ChartStore';

export default class NavigationWidgetStore {
    mainStore: MainStore;
    @observable mouse_in = false;
    get chart(): ChartStore {
        return this.mainStore.chart;
    }
    get stateStore() {
        return this.mainStore.state;
    }
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    get stxx(): ChartStore['stxx'] {
        return this.chart.stxx;
    }

    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        when(() => !!this.mainStore.chart.context, this.onContextReady);
        reaction(() => this.crosshairStore.state, this.onCrosshairChange);
    }

    onContextReady = () => {
        this.stxx.prepend('mouseWheel', this.onMouseWheel);
    };

    @computed get enableScale() {
        return this.stateStore.startEpoch;
    }

    @action.bound onMouseWheel() {
        this.stxx.chart.lockScroll = false;
        this.mainStore.chart.updateScaledOneOne(false);
    }

    @action.bound onMouseEnter() {
        this.mouse_in = true;
        this.crosshairStore.updateVisibility(false);
    }

    @action.bound onMouseLeave() {
        this.mouse_in = false;
        this.crosshairStore.updateVisibility(true);
    }

    @action.bound onScale() {
        let point: TQuote | null = null;
        const { dataSet } = this.stxx.chart;
        if (dataSet && dataSet.length) point = dataSet[0];

        this.stxx.home();
        setTimeout(() => {
            this.stateStore.scrollChartToLeft(point, true);
        }, 10);
    }

    @action.bound onCrosshairChange() {
        if (this.crosshairStore.state === 2 && this.mouse_in) {
            this.crosshairStore.updateVisibility(false);
        }
    }
}
