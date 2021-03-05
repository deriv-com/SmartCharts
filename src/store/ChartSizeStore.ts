import { observable, when, action } from 'mobx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

export default class ChartSizeStore {
    mainStore: any;
    @observable stx: any;

    constructor(mainStore: any) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stx = this.mainStore.chart.context.stx;
    };

    get state() {
        return this.mainStore.state;
    }

    @action.bound updateChartState() {
        this.stx.chart.lockScroll = false;
        this.stx.chart.lockAutoScroll = false;
        this.mainStore.chart.updateScaledOneOne(false);
    }

    @action.bound zoomIn() {
        logEvent(LogCategories.ChartControl, LogActions.ChartSize, 'zoom In');
        if (this.stx && this.state.enableZoom) {
            if (this.stx.minimumZoomTicks > this.stx.chart.maxTicks) {
                return;
            }
            this.updateChartState();
            this.stx.zoomIn();
        }
    }

    @action.bound zoomOut() {
        logEvent(LogCategories.ChartControl, LogActions.ChartSize, 'zoom Out');
        if (this.stx && this.state.enableZoom) {
            this.updateChartState();
            this.stx.zoomOut();
        }
    }
}
