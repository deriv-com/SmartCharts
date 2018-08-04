import { observable, action, computed, when, reaction } from 'mobx';
import MenuStore from './MenuStore';
import { getChartTypes } from './ChartTypeStore';
import { getTimeUnit, getIntervalInSeconds } from '../utils';

const chartTypes = getChartTypes();

const aggregateCharts = chartTypes
    .filter(t => t.settingsOnClick);

export default class TimeperiodStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route:'time-period' });
    }

    get context() { return this.mainStore.chart.context; }
    get loader() { return this.mainStore.loader; }

    @observable timeUnit = null;
    @observable interval = null;
    remain = null;

    onContextReady = () => {
        const { timeUnit, interval } = this.context.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;

        this.showCountdown();

        reaction(() => this.timeUnit, this.showCountdown);
        reaction(() => this.interval, this.showCountdown);

        this.context.stx.addEventListener('newChart', this.updateDisplay);
    };

    countdownInterval = null;
    showCountdown = (callFromSettings = false) => {
        if (!this.context) { return; }

        const stx = this.context.stx;
        const isTick = this.timeUnit === 'tick';
        const hasCountdown = !aggregateCharts.some(t => t.id === stx.layout.aggregationType);
        this.remain = null;
        if (this.countdownInterval) { clearInterval(this.countdownInterval); }
        if (this._injectionId)  { stx.removeInjection(this._injectionId); }
        this._injectionId = undefined;
        this.countdownInterval = undefined;
        stx.draw();

        const displayMilliseconds = (ms) => {
            const totalSec = ms / 1000;
            if (totalSec <= 0) { return null; }
            const padNum = n => (`0${n}`).slice(-2);
            const seconds = padNum(Math.trunc((totalSec) % 60));
            const minutes = padNum(Math.trunc((totalSec / 60) % 60));
            let hours = Math.trunc((totalSec / 3600) % 24);
            hours = hours ? `${hours}:` : '';
            return `${hours}${minutes}:${seconds}`;
        };

        const setRemain = () => {
            if (stx.isDestroyed) {
                if (this.countdownInterval) { clearInterval(this.countdownInterval); }
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

        if (this.mainStore.chartSetting.countdown && !isTick && hasCountdown) {
            if (!this._injectionId) {
                this._injectionId = stx.append('draw', () => {
                    if (this.remain && stx.currentQuote() !== null) {
                        stx.yaxisLabelStyle = 'rect';
                        stx.createYAxisLabel(stx.chart.panel, this.remain, this.remainLabelY, '#15212d', '#FFFFFF');
                        stx.yaxisLabelStyle = 'roundRectArrow';
                    }
                });
            }

            if (callFromSettings) { setRemain(); }

            if (!this.countdownInterval) {
                this.countdownInterval = setInterval(setRemain, 1000);
            }
        }
    };

    @action.bound setGranularity(granularity) {
        if (this.mainStore.chart.paramProps.granularity !== undefined) {
            return; // prop takes precedence
        }
        this.mainStore.chart.changeSymbol(undefined, granularity);
        this.menu.setOpen(false);
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
