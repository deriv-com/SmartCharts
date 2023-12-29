import { action, makeObservable } from 'mobx';
import MainStore from '.';
import { LogActions, LogCategories, logEvent } from '../utils/ga';

export default class ChartSizeStore {
    mainStore: MainStore;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            updateChartState: action.bound,
            zoomIn: action.bound,
            zoomOut: action.bound,
        });

        this.mainStore = mainStore;
    }

    get state() {
        return this.mainStore.state;
    }

    updateChartState() {
        this.mainStore.chart.updateScaledOneOne(false);
    }

    zoomIn() {
        logEvent(LogCategories.ChartControl, LogActions.ChartSize, 'zoom In');
        this.mainStore.chartAdapter.scale(1.25);
    }

    zoomOut() {
        logEvent(LogCategories.ChartControl, LogActions.ChartSize, 'zoom Out');
        this.mainStore.chartAdapter.scale(0.75);
    }
}
