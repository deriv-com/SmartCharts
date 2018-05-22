import { action, computed, observable, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import {
    BaseLineIcon,
    CandleIcon,
    DotIcon,
    HeikinAshiIcon,
    HollowCandleIcon,
    KagiIcon,
    LineBreakIcon,
    LineIcon,
    OHLCIcon,
    PointFigureIcon,
    RangeBarsIcon,
    RenkoIcon,
    SplineIcon,
} from '../components/Icons.jsx';

const aggregates = {
    heikinashi: true,
    kagi: {
        title: t.translate('Kagi'),
        inputs: [{
            id: 'kagi',
            title: t.translate('Reversal Percentage'),
        }]
    },
    renko: {
        title: t.translate('Renko'),
        inputs: [{
            id: 'renko',
            title: t.translate('Range'),
        }]
    },
    linebreak: {
        title: t.translate('Line Break'),
        inputs: [{
            id: 'priceLines',
            title: t.translate('Price Lines'),
        }]
    },
    rangebars: {
        title: t.translate('Range Bars'),
        inputs: [{
            id: 'range',
            title: t.translate('Range'),
        }]
    },
    pandf: {
        title: t.translate('Point & Figure'),
        inputs: [{
            id: 'box',
            title: t.translate('Box Size'),
        }, {
            id: 'reversal',
            title: t.translate('Reversal'),
        }]
    }
};

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

    onContextReady = () => {
        let chartType;
        if (this.stx.layout.tension) { // We assume that if tension is set, spline is enabled
            chartType = 'spline';
        } else if (aggregates[this.stx.layout.aggregationType]) {
            chartType = this.stx.layout.aggregationType;
        } else {
            chartType = this.stx.layout.chartType;
        }
        const typeIdx = this.types.findIndex(t => t.id === chartType);
        this.list.selectedIdx = typeIdx;
        this.type = this.types[typeIdx];
    };

    @action.bound setType(type) {
        if(typeof type === 'string') {
            type = this.types.filter(t => t.id === type)[0];
        }
        if (type.id === 'spline') {
            // Spline is just a line with tension
            this.stx.chart.tension = this.stx.layout.tension = 0.5;
            this.stx.setChartType('mountain');
        } else {
            this.stx.chart.tension = 0;
            delete this.stx.layout.tension;
            if (aggregates[type.id]) {
                this.stx.setAggregationType(type.id);
            } else {
                this.stx.setChartType(type.id);
            }
        }
        this.type = type;
        this.menu.setOpen(false);
    }

    @computed get types() {
        const isTickSelected = this.mainStore.timeperiod.timeUnit === 'tick';

        return [
            { id: 'mountain',      text: t.translate('Line'),           disabled: false,          icon: LineIcon         },
            { id: 'line',          text: t.translate('Dot'),            disabled: false,          icon: DotIcon          },
            { id: 'colored_line',  text: t.translate('Colored Dot'),    disabled: false,          icon: DotIcon          },
            { id: 'spline',        text: t.translate('Spline'),         disabled: false,          icon: SplineIcon       },
            { id: 'baseline',      text: t.translate('Baseline'),       disabled: false,          icon: BaseLineIcon     },
            { id: 'candle',        text: t.translate('Candle'),         disabled: isTickSelected, icon: CandleIcon       },
            { id: 'colored_bar',   text: t.translate('OHLC'),           disabled: isTickSelected, icon: OHLCIcon         },
            { id: 'hollow_candle', text: t.translate('Hollow Candle'),  disabled: isTickSelected, icon: HollowCandleIcon },
            { id: 'heikinashi',    text: t.translate('Heikin Ashi'),    disabled: isTickSelected, icon: HeikinAshiIcon   },
            { id: 'kagi',          text: t.translate('Kagi'),           disabled: isTickSelected, icon: KagiIcon         },
            { id: 'linebreak',     text: t.translate('LineBreak'),      disabled: isTickSelected, icon: LineBreakIcon    },
            { id: 'renko',         text: t.translate('Renko'),          disabled: isTickSelected, icon: RenkoIcon        },
            { id: 'rangebars',     text: t.translate('Range Bars'),     disabled: isTickSelected, icon: RangeBarsIcon    },
            { id: 'pandf',         text: t.translate('Point & Figure'), disabled: isTickSelected, icon: PointFigureIcon  },
        ].map(t => ({ ...t, active: t.id === this.type.id }));
    }

    @observable type = { id: 'mountain', text: 'Line', icon: LineIcon };
}
