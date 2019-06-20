import { observable, action, when } from 'mobx';
import { getUTCEpoch } from '../utils';

export default class NavigationWidgetStore {
    @observable isHomeEnabled = false;

    get chart() { return this.mainStore.chart; }
    get stateStore() { return this.mainStore.state; }
    get stxx() { return this.chart.stxx; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.mainStore.chart.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stxx.addEventListener('move', this.scrollListener.bind(this));
        this.stxx.prepend('mouseWheel', () => {
            this.stxx.chart.lockScroll = false;
        });
    };

    @action.bound scrollListener() {
        this.isHomeEnabled = !this.stxx.isHome();
    }

    @action.bound onHome() {
        this.isHomeEnabled = false;
        this.stxx.home();
    }

    @action.bound onScale() {
        let scrollToEpoch = null;

        if (!this.stateStore.scrollToEpoch) {
            const { dataSet } = this.stxx.chart;
            if (dataSet && dataSet.length) {
                scrollToEpoch = getUTCEpoch(dataSet[0].DT);
            }
        }
        this.stateStore.scrollChartToLeft(scrollToEpoch);
    }
}
