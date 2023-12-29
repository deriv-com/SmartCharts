import { action, observable, makeObservable } from 'mobx';
import MainStore from '.';

import ChartStore from './ChartStore';
export default class MarkerStore {
    chartStore: ChartStore;
    mainStore: MainStore;
    yPositioner = 'value';
    xPositioner = 'epoch';
    tick: number | null = null;
    isDistantFuture?: boolean;
    className?: string;
    children: React.ReactNode;
    x?: number | Date;
    y?: number;
    display?: string;
    left?: string | number;
    bottom?: number;
    constructor(mainStore: MainStore) {
        makeObservable(this, {
            display: observable,
            left: observable,
            bottom: observable,
            destructor: action.bound,
            updateProps: action.bound,
        });

        this.mainStore = mainStore;
        this.chartStore = mainStore.chart;
    }

    destructor() {}
    updateProps({ children, className }: MarkerStore) {
        this.className = className;
        this.children = children;
    }
}
