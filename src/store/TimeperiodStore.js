import { observable, action, computed, autorunAsync } from 'mobx';
import { getTimeUnit } from './utils';
import MenuStore from './MenuStore';

export default class TimeperiodStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        autorunAsync(this.onContextReady.bind(this));
        this.menu = new MenuStore(mainStore);
        window.tps = this;
    }

    get context() { return this.mainStore.chart.context; }

    @observable timeUnit = null;
    @observable interval = null;

    onContextReady() {
        if(this.context) {
            const { timeUnit, interval } = this.context.stx.layout;
            this.timeUnit = getTimeUnit({ timeUnit, interval });
            this.interval = interval;
        }
    }

    @action.bound setPeriodicity(interval, timeUnit) {
        if (this.context.loader) {
            this.context.loader.show();
        }

        const stx = this.context.stx;
        stx.setPeriodicity({ period: 1, interval, timeUnit }, () => {
            if (this.context.loader) {
                this.context.loader.hide();
            }

            const chartType = this.mainStore.chartType;
            const isTick = timeUnit === 'second';
            const isCandle = ['candle', 'hollow_condle', 'colored_bar'].indexOf(chartType.type.id) !== -1;
            const isLine = chartType.type.id == 'mountain';

            if (isCandle && isTick) {
                chartType.setType('mountain');
            } else if (!isTick && isLine) {
                chartType.setType('candle');
            }

            this.mainStore.chart.saveLayout();
        });

        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
        this.menu.open = false;
    }

    @computed get interval_display() {
        if (this.interval % 60 === 0) {
            return this.interval / 60;
        }
        return +this.interval ? this.interval : 1;
    }
}
