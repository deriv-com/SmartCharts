import { observable, action, computed, when, reaction } from 'mobx';
import MenuStore from './MenuStore';
import { getTimeUnit, getIntervalInSeconds, displayMilliseconds } from '../utils';

export default class TimeperiodStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route:'time-period' });
    }

    get context() { return this.mainStore.chart.context; }
    get loader() { return this.mainStore.loader; }
    get isTick() { return this.timeUnit === 'tick'; }
    @observable timeUnit = null;
    @observable interval = null;
    remain = null;

    onContextReady = () => {
        const { timeUnit, interval } = this.context.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;

        this.updateCountdown();

        reaction(() => [
            this.timeUnit,
            this.interval,
            this.mainStore.chartSetting.countdown,
            this.mainStore.chartType.type,
        ], this.updateCountdown.bind(this));

        this.context.stx.addEventListener('newChart', this.updateDisplay);
    };

    countdownInterval = null;

    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        if (this._injectionId)  {
            this.context.stx.removeInjection(this._injectionId);
        }

        this._injectionId = undefined;
        this.countdownInterval = undefined;

        this.context.stx.draw();
    }

    updateCountdown() {
        const stx = this.context.stx;
        this.remain = null;
        this.clearCountdown();

        const setRemain = () => {
            if (stx.isDestroyed || this.isTick) {
                this.clearCountdown();
                return;
            }

            const dataSet = stx.chart.dataSet;
            if (dataSet && dataSet.length !== 0) {
                const now = new Date();
                // Dates are in UTC; we need to do a timezone offset
                const diff = now - dataSet[dataSet.length - 1].DT + (now.getTimezoneOffset() * 60000);
                this.remain = displayMilliseconds((getIntervalInSeconds(stx.layout) * 1000) - diff);
                stx.draw();
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
                        stx.createYAxisLabel(stx.chart.panel, this.remain, this.remainLabelY, '#15212d', '#FFFFFF');
                        stx.yaxisLabelStyle = 'roundRectArrow';
                    }
                });
            }

            if (!this.countdownInterval) {
                this.countdownInterval = setInterval(setRemain, 1000);
                setRemain();
            }
        }
    }

    @action.bound setGranularity(granularity) {
        if (this.mainStore.chart.paramProps.granularity !== undefined) {
            console.error('Setting granularity does nothing since granularity prop is set. Consider overriding the onChange prop in <TimePeriod />');
            return;
        }

        this.mainStore.chart.changeSymbol(undefined, granularity);
    }

    @action.bound updateDisplay() {
        const stx = this.context.stx;
        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
    }

    @computed get remainLabelY() {
        const stx = this.context.stx;
        const price = stx.currentQuote().Close;
        let x = stx.pixelFromPrice(price, stx.chart.panel);
        const currentPriceLabelHeight = 18;
        const maxRequiredSpaceForLabels = 60;
        x = x > stx.chart.panel.bottom - maxRequiredSpaceForLabels ? x - currentPriceLabelHeight : x + currentPriceLabelHeight;
        return x;
    }

    @computed get timeUnit_display() {
        if (!this.timeUnit) { return; }
        // Convert to camel case:
        return t.translate(this.timeUnit.replace(/(\w)/, str => str.toUpperCase()));
    }

    @computed get interval_display() {
        if (this.interval % 60 === 0) {
            return this.interval / 60;
        }
        return +this.interval ? this.interval : 1;
    }

    @computed get display() {
        const t = this.timeUnit ? this.timeUnit[0] : '';
        return this.interval_display + t; // 1d, 1t, 5m, 2h
    }
}
