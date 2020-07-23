import { observable, action, when, reaction } from 'mobx';
import { getTimeUnit } from '../utils';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

export default class TimeperiodStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get isTick() { return this.timeUnit === 'tick'; }
    @observable timeUnit = null;
    @observable interval = null;
    @observable preparingInterval = null;
    onGranularityChange = () => null;

    onContextReady = () => {
        const { timeUnit, interval } = this.context.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;
        this.context.stx.addEventListener('newChart', this.updateDisplay);

        reaction(() => this.mainStore.state.granularity, granularity => this.onGranularityChange(granularity));
    };

    @action.bound setGranularity(granularity) {
        if (this.mainStore.state.granularity !== undefined) {
            console.error('Setting granularity does nothing since granularity prop is set. Consider overriding the onChange prop in <TimePeriod />');
            return;
        }

        logEvent(LogCategories.ChartControl, LogActions.Interval, granularity.toString());
        this.mainStore.chart.changeSymbol(undefined, granularity);
    }

    @action.bound updateProps(onChange) {
        if (this.mainStore.state.granularity !== undefined) {
            this.onGranularityChange = onChange;
        }
    }

    @action.bound setPreparingInterval(interval) {
        this.preparingInterval = interval;
    }

    @action.bound updateDisplay() {
        const stx = this.context.stx;
        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
    }
}
