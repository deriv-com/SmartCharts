import { action, observable, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TRefData } from 'src/types';
import MainStore from '.';
import ChartStore from './ChartStore';

type TFeedOnPaginationParams = {
    start: number;
    end: number | 'latest';
};

class PaginationLoaderStore {
    mainStore: MainStore;
    ref: TRefData | null = null;
    isOnPagination = false;
    paginationEndEpoch: number | 'latest' | null = null;

    get feed(): ChartStore['feed'] {
        return this.mainStore.chart.feed;
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            isOnPagination: observable,
            updateOnPagination: action.bound,
            setOnPagination: action.bound,
        });

        this.mainStore = mainStore;
        when(() => !!this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.feed?.onStartPagination(this.setOnPagination);
        this.feed?.onPagination(this.setOnPagination);
    };

    setRef = (ref: TRefData | null) => {
        this.ref = ref;
        if (this.ref !== null) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch as number, price: 0 });
        }
    };

    updateOnPagination(state: boolean) {
        this.isOnPagination = state;
    }

    setOnPagination = ({ end }: TFeedOnPaginationParams) => {
        this.isOnPagination = !this.isOnPagination;
        this.paginationEndEpoch = this.isOnPagination ? end : null;

        if (this.ref) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch as number, price: 0 });
        }
    };
}

export default PaginationLoaderStore;
