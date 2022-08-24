import { action, computed, observable, reaction, when, makeObservable } from 'mobx';
import { TQuote } from 'src/types';
import MainStore from '.';
import ChartStore from './ChartStore';

export default class NavigationWidgetStore {
    mainStore: MainStore;
    mouse_in = false;
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
        makeObservable(this, {
            mouse_in: observable,
            enableScale: computed,
            onMouseWheel: action.bound,
            onMouseEnter: action.bound,
            onMouseLeave: action.bound,
            onScale: action.bound,
            onCrosshairChange: action.bound
        });

        this.mainStore = mainStore;
        when(() => !!this.mainStore.chart.context, this.onContextReady);
        reaction(() => this.crosshairStore.state, this.onCrosshairChange);
    }

    onContextReady = () => {
        this.stxx.prepend('mouseWheel', this.onMouseWheel);
    };

    get enableScale() {
        return this.stateStore.startEpoch;
    }

    onMouseWheel() {
        this.stxx.chart.lockScroll = false;
        this.mainStore.chart.updateScaledOneOne(false);
    }

    onMouseEnter() {
        this.mouse_in = true;
        this.crosshairStore.updateVisibility(false);
    }

    onMouseLeave() {
        this.mouse_in = false;
        this.crosshairStore.updateVisibility(true);
    }

    onScale() {
        let point: TQuote | null = null;
        const { dataSet } = this.stxx.chart;
        if (dataSet && dataSet.length) point = dataSet[0];

        this.stxx.home();
        setTimeout(() => {
            this.stateStore.scrollChartToLeft(point, true);
        }, 10);
    }

    onCrosshairChange() {
        if (this.crosshairStore.state === 2 && this.mouse_in) {
            this.crosshairStore.updateVisibility(false);
        }
    }
}
