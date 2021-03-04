import { observable, action, when, reaction } from 'mobx';
import { getTimeUnit, getIntervalInSeconds, displayMilliseconds } from '../utils';
import ServerTime from '../utils/ServerTime';
import { logEvent, LogCategories, LogActions } from '../utils/ga';

const UnitMap = {
    tick: 'T',
    minute: 'M',
    hour: 'H',
    day: 'D',
};

const TimeMap = {
    tick: 1,
    minute: 1,
    hour: 60,
};

export default class TimeperiodStore {
    _injectionId: any;
    _serverTime: any;
    mainStore: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
        this._serverTime = ServerTime.getInstance();
        when(() => this.context, this.onContextReady);
    }

    get context() {
        return this.mainStore.chart.context;
    }
    get loader() {
        return this.mainStore.loader;
    }
    get isTick() {
        return this.timeUnit === 'tick';
    }
    get isSymbolOpen() {
        return this.mainStore.chartTitle.isSymbolOpen;
    }
    get display() {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        return `${this.interval === 'day' ? 1 : this.interval / TimeMap[this.timeUnit]} ${UnitMap[this.timeUnit]}`;
    }
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable timeUnit = null;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable interval = null;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable preparingInterval = null;
    onGranularityChange = () => null;

    remain = null;

    onContextReady = () => {
        const { timeUnit, interval } = this.context.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;

        this.updateCountdown();

        reaction(
            () => [
                this.timeUnit,
                this.interval,
                this.mainStore.chartSetting.countdown,
                this.mainStore.chartType.type,
                this.loader.currentState,
                this.isSymbolOpen,
            ],
            this.updateCountdown.bind(this)
        );

        this.context.stx.addEventListener('newChart', this.updateDisplay);

        reaction(
            () => this.mainStore.state.granularity,
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
            granularity => this.onGranularityChange(granularity)
        );
    };

    countdownInterval = null;

    clearCountdown() {
        if (this.countdownInterval) {
            // @ts-expect-error ts-migrate(2769) FIXME: No overload matches this call.
            clearInterval(this.countdownInterval);
        }

        if (this._injectionId && this.context) {
            this.context.stx.removeInjection(this._injectionId);
        }

        this._injectionId = undefined;
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'undefined' is not assignable to type 'null'.
        this.countdownInterval = undefined;
    }

    updateCountdown() {
        if (!this.context) return;
        const stx = this.context.stx;
        this.remain = null;
        this.clearCountdown();

        const setRemain = () => {
            if (stx.isDestroyed || this.isTick || !this.isSymbolOpen) {
                this.clearCountdown();
                return;
            }

            const { dataSegment } = stx.chart;
            if (dataSegment && dataSegment.length) {
                const dataSegmentClose = [...dataSegment].filter(item => item && item.Close);
                if (dataSegmentClose && dataSegmentClose.length) {
                    const currentQuote = dataSegmentClose[dataSegmentClose.length - 1];
                    const now = this._serverTime.getUTCDate();
                    const diff = now - currentQuote.DT;
                    const chartInterval = getIntervalInSeconds(stx.layout) * 1000;
                    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    const coefficient = diff > chartInterval ? parseInt(diff / chartInterval, 10) + 1 : 1;

                    if (this.context.stx) {
                        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | null' is not assignable to type 'nu... Remove this comment to see the full error message
                        this.remain = displayMilliseconds(coefficient * chartInterval - diff);
                        stx.draw();
                    }
                }
            }
        };

        const isCountdownChart = !this.mainStore.chartType.isAggregateChart;
        const hasCountdown = this.mainStore.chartSetting.countdown && !this.isTick && isCountdownChart;

        if (hasCountdown) {
            if (!this._injectionId) {
                this._injectionId = stx.append('draw', () => {
                    if (this.isTick) {
                        this.clearCountdown();
                        return;
                    }

                    if (this.remain && stx.currentQuote() !== null) {
                        stx.yaxisLabelStyle = 'rect';
                        stx.labelType = 'countdown';
                        stx.createYAxisLabel(stx.chart.panel, this.remain, this.remainLabelY(), '#15212d', '#FFFFFF');
                        stx.labelType = undefined;
                        stx.yaxisLabelStyle = 'roundRect';
                    }
                });
            }

            if (!this.countdownInterval) {
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Timeout' is not assignable to type 'null'.
                this.countdownInterval = setInterval(setRemain, 1000);
                setRemain();
            }
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setGranularity(granularity: any) {
        if (this.mainStore.state.granularity !== undefined) {
            console.error(
                'Setting granularity does nothing since granularity prop is set. Consider overriding the onChange prop in <TimePeriod />'
            );
            return;
        }

        logEvent(LogCategories.ChartControl, LogActions.Interval, granularity.toString());
        this.mainStore.chart.changeSymbol(undefined, granularity);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound updateProps(onChange: any) {
        if (this.mainStore.state.granularity !== undefined) {
            this.onGranularityChange = onChange;
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setPreparingInterval(interval: any) {
        this.preparingInterval = interval;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound updateDisplay() {
        if (!this.context) return;
        const stx = this.context.stx;
        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
    }

    remainLabelY = () => {
        const stx = this.context.stx;
        const topPos = 36;
        const labelHeight = 24;
        const bottomPos = 66;
        let y = stx.chart.currentPriceLabelY + labelHeight;
        if (stx.chart.currentPriceLabelY > stx.chart.panel.bottom - bottomPos) {
            y = stx.chart.panel.bottom - bottomPos;
            y = y < stx.chart.currentPriceLabelY - labelHeight ? y : stx.chart.currentPriceLabelY - labelHeight;
        } else if (stx.chart.currentPriceLabelY < stx.chart.panel.top) {
            y = topPos;
        }
        return y;
    };
}
