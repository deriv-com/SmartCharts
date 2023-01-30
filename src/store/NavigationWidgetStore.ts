import { action, computed, observable, reaction, makeObservable } from 'mobx';
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

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            mouse_in: observable,
            enableScale: computed,
            onMouseEnter: action.bound,
            onMouseLeave: action.bound,
            onScale: action.bound,
            onCrosshairChange: action.bound,
        });

        this.mainStore = mainStore;
        reaction(() => this.crosshairStore.state, this.onCrosshairChange);
    }

    get enableScale() {
        return this.stateStore.startEpoch;
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
        const dataSet = this.mainStore.chart.feed?.quotes;
        if (dataSet && dataSet.length) point = dataSet[0];
    }

    onCrosshairChange() {
        if (this.crosshairStore.state === 2 && this.mouse_in) {
            this.crosshairStore.updateVisibility(false);
        }
    }
}
