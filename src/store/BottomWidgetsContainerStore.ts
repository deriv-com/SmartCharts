import { observable, when, makeObservable } from 'mobx';
import MainStore from '.';
import Context from '../components/ui/Context';

export default class BottomWidgetsContainerStore {
    mainStore: MainStore;
    bottom = 20;
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
        });

        this.mainStore = mainStore;

        when(() => !!this.context, this.initial);
    }

    initial = (): void => {
        this.isReadyToShow = true;
    };

    updateChartMargin = (): void => {};
}
