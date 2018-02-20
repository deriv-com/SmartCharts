import { observable, action, computed, autorunAsync } from 'mobx';

export default class ChartTypeStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        autorunAsync(this.onContextReady.bind(this));
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady() {
        if(this.context) {
            const type = this.types.find(t => t.id === this.stx.layout.chartType);
            this.type = type;
        }
    }

    @action.bound setType(type) {
        if (type.id === 'spline') {
            // Spline is just a line with tension
            this.stx.setChartType('mountain');
            this.stx.chart.tension = 0.5;
        } else {
            this.stx.setChartType(type.id);
            this.stx.chart.tension = 0;
        }
        this.type = type;
    }

    @observable types = [
        { id: 'mountain', name: 'Line', },
        { id: 'line', name: 'Dot', },
        { id: 'spline', name: 'Spline', },
        { id: 'candle', name: 'Candle', },
        { id: 'colored_bar', name: 'OHLC', },
        { id: 'hollow_candle', name: 'Hollow Candle', },
    ];

    @observable type = this.types[0];
    @observable open = false;

    @action.bound setOpen(value) {
        this.open = value;
    }
}
