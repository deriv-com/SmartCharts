import { observable, when, makeObservable, action } from 'mobx';
import MainStore from '.';
import Context from '../components/ui/Context';

export default class BottomWidgetsContainerStore {
    mainStore: MainStore;
    bottom = 30;
    isReadyToShow = false;
    mainChartHeight = 0;
    totalHeight = 0;

    get context(): Context | null {
        return this.mainStore.chart.context;
    }
    get state(): MainStore['state'] {
        return this.mainStore.state;
    }

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            bottom: observable,
            isReadyToShow: observable,
            mainChartHeight: observable,
            totalHeight: observable,
            updateChartHeight: action.bound,
        });

        this.mainStore = mainStore;

        when(() => !!this.context, this.initial);
    }

    initial = (): void => {
        this.isReadyToShow = true;
    };

    updateChartHeight = async () => {
        // Todo: Find a better way to calculate indicators height.
        setTimeout(() => {
            if (!this.mainStore.chart.chartContainerHeight) return;

            const chartAdapter = this.mainStore.chartAdapter;

            const { bottomQuote } = chartAdapter.quoteBounds;

            const mainChartHeight = chartAdapter.getYFromQuote(bottomQuote);

            const addedIndicatorsHeight = this.mainStore.chart.chartContainerHeight - mainChartHeight;

            this.bottom =
                this.mainStore.chartAdapter.isFeedLoaded && addedIndicatorsHeight > 80 ? addedIndicatorsHeight : 30;
        }, 300);
    };
}
