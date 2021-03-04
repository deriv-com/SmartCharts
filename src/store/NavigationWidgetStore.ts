import { action, when, computed, reaction, observable } from 'mobx';

export default class NavigationWidgetStore {
    mainStore: any;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable mouse_in;
    get chart() {
        return this.mainStore.chart;
    }
    get stateStore() {
        return this.mainStore.state;
    }
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    get stxx() {
        return this.chart.stxx;
    }

    constructor(mainStore: any) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
        reaction(() => this.crosshairStore.state, this.onCrosshairChange);
    }

    onContextReady = () => {
        this.stxx.prepend('mouseWheel', this.onMouseWheel);
    };

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get enableScale() {
        return this.stateStore.startEpoch;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onMouseWheel() {
        this.stxx.chart.lockScroll = false;
        this.mainStore.chart.updateScaledOneOne(false);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onMouseEnter() {
        this.mouse_in = true;
        this.crosshairStore.updateVisibility(false);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onMouseLeave() {
        this.mouse_in = false;
        this.crosshairStore.updateVisibility(true);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onScale() {
        let point: any = null;
        const { dataSet } = this.stxx.chart;
        if (dataSet && dataSet.length) point = dataSet[0];

        this.stxx.home();
        setTimeout(() => {
            this.stateStore.scrollChartToLeft(point, true);
        }, 10);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound onCrosshairChange() {
        if (this.crosshairStore.state === 2 && this.mouse_in) {
            this.crosshairStore.updateVisibility(false);
        }
    }
}
