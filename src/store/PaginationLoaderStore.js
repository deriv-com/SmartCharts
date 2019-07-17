import { when } from 'mobx';

class PaginationLoaderStore {
    isOnPagination = false;
    paginationEndEpoch = null;

    get feed()    { return this.mainStore.chart.feed; }
    get context() { return this.mainStore.chart.context; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.feed.onStartPagination(this.setOnPagination.bind(this));
        this.feed.onPagination(this.setOnPagination.bind(this));
    };

    setRef = (ref) => {
        this.ref = ref;
        if (this.ref !== null) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch, price: 0 });
        }
    }

    setOnPagination({ end }) {
        if (!this.ref) { return; }
        this.isOnPagination     = !this.isOnPagination;
        this.paginationEndEpoch = this.isOnPagination ? end : null;
        this.ref.setPosition({ epoch: this.paginationEndEpoch, price: 0 });
    }
}

export default PaginationLoaderStore;
