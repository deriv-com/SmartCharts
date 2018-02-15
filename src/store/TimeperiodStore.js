import { observable, action, computed } from 'mobx';
import { getTimeUnit } from './utils';

export default class TimeperiodStore {
    set context(ctx) {
        this._context = ctx;
        this.onContextReady();
    }
    get context() { return this._context; }

    @observable timeperiod = '';
    @observable open = false;
    @observable timeUnit = null;
    @observable interval = null;

    @action.bound setOpen(val) {
        this.open = val;
    }

    @action.bound onContextReady() {
        const { timeUnit, interval } = this.context.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;
    }

    @action.bound setPeriodicity(interval, timeUnit) {
        if (this.context.loader) {
            this.context.loader.show();
        }

        const stx = this.context.stx;
        stx.setPeriodicity({ period: 1, interval, timeUnit }, () => {
            const isTick = timeUnit === 'second';
            const isCandle = ~['candle', 'hollow_condle', 'colored_bar'].indexOf(stx.layout.chartType);
            if (this.context.loader) {
                this.context.loader.hide();
            }
            if (isCandle && isTick) {
                stx.setChartType('mountain');
            } else if (!isTick && !isCandle) {
                stx.setChartType('candle');
            }
        });

        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
        this.open = false;
    }

    @computed get interval_display() {
        if (this.interval % 60 === 0) {
            return this.interval / 60;
        }
        return +this.interval ? this.interval : 1;
    }
}
