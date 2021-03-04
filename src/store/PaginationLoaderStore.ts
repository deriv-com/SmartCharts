import { action, observable, when } from 'mobx';

class PaginationLoaderStore {
    @observable isOnPagination = false;
    paginationEndEpoch = null;

    get feed() {
        return this.mainStore.chart.feed;
    }
    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.mainStore.chart.stxx;
    }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.feed.onStartPagination(this.setOnPagination);
        this.feed.onPagination(this.setOnPagination);

        // this injection will slows down the swiping and mouse wheel operations
        // by ignoring requests that are too close from one another or
        // when isOnPagination is true
        this.stx.prepend('mouseWheel', this.onMouseWheel);
    };

    onMouseWheel = e => {
        e.preventDefault();
        let diff = null;
        const timeLimit = 40;
        if (this.stx.lastMouseWheelEvent) diff = Date.now() - this.stx.lastMouseWheelEvent;
        if ((diff && diff < timeLimit) || this.isOnPagination) return true; // skip swiping
        return false; // continue swiping
    };

    setRef = ref => {
        this.ref = ref;
        if (this.ref !== null) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch, price: 0 });
        }
    };

    @action.bound updateOnPagination(state) {
        this.isOnPagination = state;
    }

    @action.bound setOnPagination = ({ end }) => {
        this.isOnPagination = !this.isOnPagination;
        this.paginationEndEpoch = this.isOnPagination ? end : null;

        if (this.ref) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch, price: 0 });
        }
    };
}

export default PaginationLoaderStore;
