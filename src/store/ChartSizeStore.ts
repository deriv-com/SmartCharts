import { action, observable, when, makeObservable } from 'mobx';
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
        // this.stx.chart.lockScroll = false;
        // this.stx.chart.lockAutoScroll = false;
        this.mainStore.chart.updateScaledOneOne(false);
    }

    zoomIn() {
        logEvent(LogCategories.ChartControl, LogActions.ChartSize, 'zoom In');
        if (this.stx && this.state.enableZoom) {
            if (this.stx.minimumZoomTicks > this.stx.chart.maxTicks) {
                return;
            }
            this.updateChartState();
            this.stx.zoomIn();
        }
    }

    zoomOut() {
        logEvent(LogCategories.ChartControl, LogActions.ChartSize, 'zoom Out');
        if (this.stx && this.state.enableZoom) {
            this.updateChartState();
            this.stx.zoomOut();
        }
    }
}
