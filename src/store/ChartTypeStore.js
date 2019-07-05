import { action, computed, observable, reaction, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import {
    BaseLineIcon,
    CandleIcon,
    DotIcon,
    LineDotIcon,
    HeikinAshiIcon,
    HollowCandleIcon,
    KagiIcon,
    LineBreakIcon,
    LineIcon,
    OHLCIcon,
    PointFigureIcon,
    RangeBarsIcon,
    RenkoIcon,
    TableIcon,
    SplineIcon,
} from '../components/Icons.jsx';
import SettingsDialogStore from './SettingsDialogStore';
import List from '../components/List.jsx';
import Menu from '../components/Menu.jsx';
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

function getChartTypes() {
    return [
        { id: 'mountain',      text: t.translate('Line'),           candleOnly: false, icon: LineIcon         },
        { id: 'line',          text: t.translate('Dot'),            candleOnly: false, icon: DotIcon          },
        { id: 'colored_line',  text: t.translate('Colored Dot'),    candleOnly: false, icon: LineDotIcon      },
        { id: 'spline',        text: t.translate('Spline'),         candleOnly: false, icon: SplineIcon       },
        { id: 'baseline',      text: t.translate('Baseline'),       candleOnly: false, icon: BaseLineIcon     },
        { id: 'candle',        text: t.translate('Candle'),         candleOnly: true,  icon: CandleIcon       },
        { id: 'colored_bar',   text: t.translate('OHLC'),           candleOnly: true,  icon: OHLCIcon         },
        { id: 'hollow_candle', text: t.translate('Hollow Candle'),  candleOnly: true,  icon: HollowCandleIcon },
        { id: 'heikinashi',    text: t.translate('Heikin Ashi'),    candleOnly: true,  icon: HeikinAshiIcon   },
        { id: 'kagi',          text: t.translate('Kagi'),           candleOnly: true,  icon: KagiIcon,        settingsOnClick: true },
        { id: 'linebreak',     text: t.translate('Line Break'),     candleOnly: true,  icon: LineBreakIcon,   settingsOnClick: true },
        { id: 'renko',         text: t.translate('Renko'),          candleOnly: true,  icon: RenkoIcon,       settingsOnClick: true },
        { id: 'rangebars',     text: t.translate('Range Bars'),     candleOnly: true,  icon: RangeBarsIcon,   settingsOnClick: true },
        { id: 'pandf',         text: t.translate('Point & Figure'), candleOnly: true,  icon: PointFigureIcon, settingsOnClick: true },
        { id: 'table',         text: t.translate('Table'),          candleOnly: false, icon: TableIcon         },
    ];
}

const notCandles = getChartTypes()
    .filter(t => !t.candleOnly)
    .map(t => t.id);

const aggregateCharts = getChartTypes()
    .filter(t => t.settingsOnClick);

function getAggregates() {
    return {
        heikinashi: true,
        kagi: {
            title: t.translate('Kagi'),
            inputs: [{
                id: 'kagi',
                title: t.translate('Reversal Percentage'),
                type: 'numericinput',
            }],
        },
        renko: {
            title: t.translate('Renko'),
            inputs: [{
                id: 'renko',
                title: t.translate('Range'),
                type: 'numericinput',
            }],
        },
        linebreak: {
            title: t.translate('Line Break'),
            inputs: [{
                id: 'priceLines',
                title: t.translate('Price Lines'),
                type: 'numericinput',
                max: 10,
                step: 1,
                min: 1,
            }],
        },
        rangebars: {
            title: t.translate('Range Bars'),
            inputs: [{
                id: 'range',
                title: t.translate('Range'),
                type: 'numericinput',
            }],
        },
        pandf: {
            title: t.translate('Point & Figure'),
            inputs: [{
                id: 'box',
                title: t.translate('Box Size'),
                type: 'numericinput',
            }, {
                id: 'reversal',
                title: t.translate('Reversal'),
                type: 'numericinput',
            }],
        },
    };
}

export default class ChartTypeStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route:'chart-type' });

        this.list = new ListStore({
            getContext: () => this.context,
            getItems: () => this.types,
        });

        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onChanged: items => this.updateAggregate(items),
        });

        this.ChartTypeMenu = this.menu.connect(Menu);
        this.ChartTypeList = this.list.connect(List);
        this.AggregateChartSettingsDialog = this.settingsDialog.connect(SettingsDialog);
    }

    @observable type = 'mountain';
    onChartTypeChanged;

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get chartTypeProp() { return this.mainStore.state.chartType; }
    get isCandle() { return notCandles.indexOf(this.type.id) === -1; }
    get isSpline() { return this.type.id === 'spline'; }
    get isAggregateChart() { return !!aggregateCharts.find(t => t.id === this.stx.layout.aggregationType); }

    onContextReady = () => {
        this.aggregates = getAggregates();
        this.chartTypes = getChartTypes();

        this.setChartTypeFromLayout(this.stx.layout);

        reaction(() => this.mainStore.state.chartType, () => {
            if (this.mainStore.state.chartType !== undefined) {
                this.setType(this.mainStore.state.chartType);
            }
        });
    };

    @action.bound setTypeFromUI(type) {
        if (this.chartTypeProp !== undefined) {
            console.error('Changing chart type does nothing because chartType prop is being set. Consider overriding the onChange prop in <ChartTypes />');
            return;
        }

        this.setType(type);
    }

    @action.bound setType(type) {
        logEvent(LogCategories.ChartControl, LogActions.ChartType, type);
        if (typeof type === 'string') {
            type = this.types.find(t => t.id === type);
        }
        if (type.id === this.type.id) {
            return;
        }
        if (type.id === 'table') {
            this.mainStore.chartTable.setOpen(true);
            return;
        }
        if (type.id === 'spline') {
            // Spline is just a line with tension
            this.stx.chart.tension = this.stx.layout.tension = 0.5;
            this.stx.setChartType('mountain');
        } else {
            this.stx.chart.tension = 0;
            delete this.stx.layout.tension;
            if (this.aggregates[type.id]) {
                // Set baseline.userLevel to false so chart won't move up after AggregationType set.
                this.stx.chart.baseline.userLevel = false;
                this.stx.setAggregationType(type.id);
                // Reset baseline.userLevel to its default value
                this.stx.chart.baseline.userLevel = null;
            } else {
                this.stx.setChartType(type.id);
            }
        }

        this.type = type;
    }

    @action.bound updateProps(onChange) {
        this.onChartTypeChanged = onChange;
    }

    @action.bound showAggregateDialog(aggregateId) {
        if (aggregateId !== this.type.id) {
            this.setType(aggregateId);
        }
        const aggregate = this.aggregates[aggregateId];
        this.settingsDialog.title = aggregate.title;
        const inputs = aggregate.inputs.map(({ id, ...agg }) => {
            const name = (id === 'box' || id === 'reversal') ? `pandf.${id}` : id;
            const tuple = CIQ.deriveFromObjectChain(this.stx.layout, name);
            const value = tuple.obj[tuple.member];
            const defaultValue = this.stx.chart.defaultChartStyleConfig[id];
            return {
                id: name,
                value: (value != undefined) ? value : defaultValue, // eslint-disable-line eqeqeq
                defaultValue,
                ...agg,
            };
        });
        this.settingsDialog.items = inputs;
        this.settingsDialog.setOpen(true);
    }

    updateAggregate = (items) => {
        for (const { id, value } of items) {
            const tuple = CIQ.deriveFromObjectChain(this.stx.layout, id);
            tuple.obj[tuple.member] = value;
        }
        this.stx.changeOccurred('layout');
        this.stx.createDataSet();
        this.stx.draw();
    };

    @computed get types() {
        const isTickSelected = this.mainStore.timeperiod.timeUnit === 'tick';

        if (this.chartTypes === undefined) {
            this.chartTypes = getChartTypes();
        }

        return this.chartTypes.map(t => ({
            ...t,
            active: t.id === this.type.id,
            disabled: t.candleOnly ? isTickSelected : false,
        }));
    }

    @action.bound setChartTypeFromLayout(layout) {
        const chartType = this.getChartTypeFromLayout(layout);
        const typeIdx = this.chartTypes.findIndex(t => t.id === chartType);
        this.type = this.chartTypes[typeIdx];
    }

    getChartTypeFromLayout(layout) {
        let chartType;
        if (layout.tension) { // We assume that if tension is set, spline is enabled
            chartType = 'spline';
        } else if (this.aggregates[layout.aggregationType]) {
            chartType = layout.aggregationType;
        } else {
            chartType = layout.chartType;
        }
        return chartType;
    }

    isTypeCandle(type) {
        if (typeof type === 'string') {
            type = this.types.find(t => t.id === type);
        }
        return notCandles.indexOf(type.id) === -1;
    }
}
