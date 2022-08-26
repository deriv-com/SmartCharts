import { action, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import MainStore from '.';
import { LogActions, LogCategories, logEvent } from '../utils/ga';

export default class ChartSizeStore {
    mainStore: MainStore;
    stx: Context['stx'];

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            stx: observable,
            updateChartState: action.bound,
            zoomIn: action.bound,
            zoomOut: action.bound
        });

        this.mainStore = mainStore;
        when(() => !!this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stx = this.mainStore.chart.context?.stx;
    };

    get state() {
        return this.mainStore.state;
    }

    updateChartState() {
        this.stx.chart.lockScroll = false;
        this.stx.chart.lockAutoScroll = false;
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
