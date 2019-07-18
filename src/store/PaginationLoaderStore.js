import { when } from 'mobx';

class PaginationLoaderStore {
    isOnPagination = false;
    paginationEndEpoch = null;

    get feed()    { return this.mainStore.chart.feed; }
    get context() { return this.mainStore.chart.context; }
    get stx()     { return this.mainStore.chart.stxx; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.feed.onStartPagination(this.setOnPagination.bind(this));
        this.feed.onPagination(this.setOnPagination.bind(this));

        // this injection will stop the swiping and mouse wheel
        // operations when isOnPagination is true
        this.stx.prepend('mouseWheel', this.onMouseWheel);
    };

    onMouseWheel = (e) => {
        e.preventDefault();
        if (this.isOnPagination) return true; // skip swiping
        // continue swiping
    }

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
