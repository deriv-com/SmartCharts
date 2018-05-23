import { observable, action, computed, when } from 'mobx';
import { getTimeUnit } from './utils';
import MenuStore from './MenuStore';
import {chartTypes} from './ChartTypeStore';

const notCandles = chartTypes
    .filter(t => !t.candleOnly)
    .map(t => t.id);

export default class TimeperiodStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore({getContext: () => this.context});
    }

    get context() { return this.mainStore.chart.context; }
    get loader() { return this.mainStore.loader; }

    @observable timeUnit = null;
    @observable interval = null;

    onContextReady = () => {
        const { timeUnit, interval } = this.context.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;
    };

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

    @computed get timeUnit_display() {
        if(!this.timeUnit) {return;}
        let temp = this.timeUnit;
        if(temp.length > 4) {
            temp = (temp).slice(0,3);
        }
        return temp.replace(/(\w)/, (str) => str.toUpperCase());
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
