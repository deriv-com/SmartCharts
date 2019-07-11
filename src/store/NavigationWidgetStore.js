import { observable, action, when } from 'mobx';
import debounce from 'lodash.debounce';

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

    @action.bound scrollListener = debounce(() => {
        this.isHomeEnabled = !this.stxx.isHome();
    }, 50, { leading: true, trailing: false });

    @action.bound onHome() {
        this.isHomeEnabled = false;
        this.stxx.home();
    }

    @action.bound onScale() {
        let point = null;

        this.isHomeEnabled = false;
        const { dataSet } = this.stxx.chart;
        if (dataSet && dataSet.length) point = dataSet[0];

        this.stateStore.scrollChartToLeft(point);
    }
}
