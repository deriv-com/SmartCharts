import { action, observable, when } from 'mobx';
import React from 'react';
import Context from 'src/components/ui/Context';
import MainStore from '.';
import ChartStore from './ChartStore';

type TRef = {
    setPosition: (args: { [key: string]: number | null }) => void;
    div: HTMLElement | null;
};

class PaginationLoaderStore {
    mainStore: MainStore;
    ref: TRef | null = null;
    @observable isOnPagination = false;
    paginationEndEpoch: number | null = null;

    get feed(): ChartStore['feed'] {
        return this.mainStore.chart.feed;
    }
    get context(): Context {
        return this.mainStore.chart.context;
    }
    get stx(): ChartStore['stxx'] {
        return this.mainStore.chart.stxx;
    }

    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        when(() => !!this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.feed.onStartPagination(this.setOnPagination);
        this.feed.onPagination(this.setOnPagination);

        // this injection will slows down the swiping and mouse wheel operations
        // by ignoring requests that are too close from one another or
        // when isOnPagination is true
        this.stx.prepend('mouseWheel', this.onMouseWheel);
    };

    onMouseWheel = (e: React.MouseEvent) => {
        e.preventDefault();
        let diff = null;
        const timeLimit = 40;
        if (this.stx.lastMouseWheelEvent) diff = Date.now() - this.stx.lastMouseWheelEvent;
        if ((diff && diff < timeLimit) || this.isOnPagination) return true; // skip swiping
        return false; // continue swiping
    };

    setRef = (ref: TRef) => {
        this.ref = ref;
        if (this.ref !== null) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch, price: 0 });
        }
    };

    @action.bound updateOnPagination(state: boolean) {
        this.isOnPagination = state;
    }

    @action.bound setOnPagination = ({ end }: { end: number }) => {
        this.isOnPagination = !this.isOnPagination;
        this.paginationEndEpoch = this.isOnPagination ? end : null;

        if (this.ref) {
            this.ref.setPosition({ epoch: this.paginationEndEpoch, price: 0 });
        }
    };
}

export default PaginationLoaderStore;
