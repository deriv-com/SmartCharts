import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';

export default class ChartTypeStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        const type = this.types.find(t => t.id === this.stx.layout.chartType);
        this.type = type;
    }

    @action.bound setType(type) {
        if(typeof type === 'string') {
            type = this.types.filter(t => t.id === type)[0];
        }
        if (type.id === 'spline') {
            // Spline is just a line with tension
            this.stx.setChartType('mountain');
            this.stx.chart.tension = 0.5;
        } else {
            this.stx.setChartType(type.id);
            this.stx.chart.tension = 0;
        }
        this.type = type;
        this.menu.open = false;
    }

    @computed get types() {
        const isTickSelected = this.mainStore.timeperiod.timeUnit === 'tick';

        return [
            { id: 'mountain', name: 'Line', disable: false },
            { id: 'line', name: 'Dot', disable: false },
            { id: 'spline', name: 'Spline', disable: false },
            { id: 'candle', name: 'Candle', disable: isTickSelected },
            { id: 'colored_bar', name: 'OHLC', disable: isTickSelected },
            { id: 'hollow_candle', name: 'Hollow Candle', disable: isTickSelected },
        ];
    }

    @observable type = { id: 'mountain', name: 'Line', };
}
