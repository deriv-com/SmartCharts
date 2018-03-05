import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';


export default class ChartTypeStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore({getContext: () => this.context});

        this.list = new ListStore({
            getIsOpen: () => this.menu.open,
            getContext: () => this.context,
            onItemSelected: item => this.setType(item),
            getItems: () => this.types,
        });
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    addIcon = type => {
        const icon = `ciq-icon ciq-${type.id.replace('_', '-')}`;
        return {icon, ...type};
    }

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
        this.menu.setOpen(false);
    }
    @action.bound setAssetInformation(value) { this.assetInformation = value; }

    @computed get types() {
        const isTickSelected = this.mainStore.timeperiod.timeUnit === 'tick';

        return [
            { id: 'mountain', text: 'Line', disabled: false },
            { id: 'line', text: 'Dot', disabled: false },
            { id: 'colored_line', text: 'Colored Dot', disabled: false },
            { id: 'spline', text: 'Spline', disabled: false },
            { id: 'baseline', text: 'Baseline', disabled: false },
            { id: 'candle', text: 'Candle', disabled: isTickSelected },
            { id: 'colored_bar', text: 'OHLC', disabled: isTickSelected },
            { id: 'hollow_candle', text: 'Hollow Candle', disabled: isTickSelected },
        ]
            .map(t => this.addIcon(t))
            .map(t => ({ ...t, active: t.id === this.type.id }));
    }

    @observable type = this.addIcon({ id: 'mountain', text: 'Line' });
    @observable assetInformation = false;
}
