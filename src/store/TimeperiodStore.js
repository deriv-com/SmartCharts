import { observable, action, computed, when, reaction } from 'mobx';
import { getTimeUnit, getIntervalInSeconds  } from './utils';
import MenuStore from './MenuStore';
import { chartTypes } from './ChartTypeStore';

const notCandles = chartTypes
    .filter(t => !t.candleOnly)
    .map(t => t.id);

const aggregateCharts  = chartTypes
    .filter(t => t.settingsOnClick);

export default class TimeperiodStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore);
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

        reaction(() => this.timeUnit, () => { this.showCountdown(); });
        reaction(() => this.interval, () => { this.showCountdown(); });
    };

    countdownInterval = null;
    showCountdown = (callFromSettings = false) => {
        const stx = this.context.stx;
        const isTick = this.timeUnit == 'tick';
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
            const dataSet = stx.chart.dataSet;
            if (dataSet && dataSet.length != 0) {
                const diff = new Date() - dataSet[dataSet.length - 1].DT;
                this.remain = displayMilliseconds((getIntervalInSeconds(stx.layout) * 1000) - diff);
                stx.draw();
            }
        };

        if (this.mainStore.chartProps.countdown && !isTick && hasCountdown) {
            if (!this._injectionId) {
                this._injectionId = stx.append('draw', () => {
                    if (this.remain) {
                        stx.yaxisLabelStyle = 'rect';
                        stx.createYAxisLabel(stx.chart.panel, this.remain, this.remainLabelY, '#15212d', '#FFFFFF');
                        stx.yaxisLabelStyle = 'roundRectArrow';
                    }
                });
            }

            if (callFromSettings) { setRemain(); }

            if (!this.countdownInterval) {
                this.countdownInterval = setInterval(() => {
                    setRemain();
                }, 1000);
            }
        }
    }

    @action.bound setPeriodicity(interval, timeUnit) {
        if (this.loader) {
            this.loader.show();
        }

        const stx = this.context.stx;
        const wasTick = stx.layout.timeUnit === 'second';
        stx.setPeriodicity({ period: 1, interval, timeUnit }, () => {
            if (this.loader) {
                this.loader.hide();
            }

            const chartType = this.mainStore.chartType;
            const isTick = timeUnit === 'second';
            const isCandle = notCandles.indexOf(chartType.type.id) === -1;

            if (isCandle && isTick) {
                chartType.setType('mountain');
            } else if (!isTick && wasTick) {
                chartType.setType('candle');
            }

            this.mainStore.chart.saveLayout();
        });

        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
        this.menu.setOpen(false);
    }

    @computed get remainLabelY() {
        const stx = this.context.stx;
        const dataSet = stx.chart.dataSet;
        const price = dataSet[dataSet.length - 1].Close;
        let x = stx.pixelFromPrice(price, stx.chart.panel);
        const currentPriceLabelHeight = 18;
        const maxRequiredSpaceForLabels = 60;
        x = x > stx.chart.panel.bottom - maxRequiredSpaceForLabels ? x - currentPriceLabelHeight : x + currentPriceLabelHeight;
        return x;
    }

    @computed get timeUnit_display() {
        if (!this.timeUnit) { return; }
        let temp = this.timeUnit;
        if (temp.length > 4) {
            temp = (temp).slice(0, 3);
        }
        return temp.replace(/(\w)/, str => str.toUpperCase());
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
