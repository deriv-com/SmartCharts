import { action, computed, observable, reaction, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import SettingsDialogStore from './SettingsDialogStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/List.jsx' was resolved to '/... Remove this comment to see the full error message
import List from '../components/List.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/SettingsDialog.jsx' was reso... Remove this comment to see the full error message
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Constant' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ChartTypes } from '../Constant';
const notCandles = [...ChartTypes].filter(t => !t.candleOnly).map(t => t.id);
const aggregateCharts = [...ChartTypes].filter(t => t.settingsOnClick);
function getAggregates() {
    return {
        heikinashi: true,
        kagi: {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title: t.translate('Kagi'),
            inputs: [
                {
                    id: 'kagi',
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    title: t.translate('Reversal Percentage'),
                    type: 'numericinput',
                },
            ],
        },
        renko: {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title: t.translate('Renko'),
            inputs: [
                {
                    id: 'renko',
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    title: t.translate('Range'),
                    type: 'numericinput',
                },
            ],
        },
        linebreak: {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title: t.translate('Line Break'),
            inputs: [
                {
                    id: 'priceLines',
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    title: t.translate('Price Lines'),
                    type: 'numericinput',
                    max: 10,
                    step: 1,
                    min: 1,
                },
            ],
        },
        rangebars: {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title: t.translate('Range Bars'),
            inputs: [
                {
                    id: 'range',
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    title: t.translate('Range'),
                    type: 'numericinput',
                },
            ],
        },
        pandf: {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            title: t.translate('Point & Figure'),
            inputs: [
                {
                    id: 'box',
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    title: t.translate('Box Size'),
                    type: 'numericinput',
                },
                {
                    id: 'reversal',
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                    title: t.translate('Reversal'),
                    type: 'numericinput',
                },
            ],
        },
    };
}
export default class ChartTypeStore {
    AggregateChartSettingsDialog: any;
    ChartTypeList: any;
    ChartTypeMenu: any;
    aggregates: any;
    chartTypes: any;
    list: any;
    mainStore: any;
    menu: any;
    settingsDialog: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route: 'chart-type' });
        this.list = new ListStore({
            getContext: () => this.context,
            getItems: () => this.types,
        });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onChanged: (items: any) => this.updateAggregate(items),
        });
        this.ChartTypeMenu = this.menu.connect(Menu);
        this.ChartTypeList = this.list.connect(List);
        this.AggregateChartSettingsDialog = this.settingsDialog.connect(SettingsDialog);
    }
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    type = 'mountain';
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'onChartTypeChanged' implicitly has an 'any... Remove this comment to see the full error message
    onChartTypeChanged;
    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }
    get chartTypeProp() {
        return this.mainStore.state.chartType;
    }
    get isCandle() {
        return this.type ? notCandles.indexOf((this.type as any).id) === -1 : false;
    }
    get isSpline() {
        return (this.type as any).id === 'spline';
    }
    get isAggregateChart() {
        return !!aggregateCharts.find(t => t.id === this.stx.layout.aggregationType);
    }
    onContextReady = () => {
        this.aggregates = getAggregates();
        this.chartTypes = [...ChartTypes];
        this.setChartTypeFromLayout(this.stx.layout);
        reaction(() => this.mainStore.state.chartType, () => {
            if (this.mainStore.state.chartType !== undefined) {
                this.setType(this.mainStore.state.chartType);
            }
        });
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setTypeFromUI(type: any) {
        if (this.chartTypeProp !== undefined) {
            console.error('Changing chart type does nothing because chartType prop is being set. Consider overriding the onChange prop in <ChartTypes />');
            return;
        }
        this.setType(type);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setType(type: any) {
        logEvent(LogCategories.ChartControl, LogActions.ChartType, type);
        if (!type) {
            type = 'mountain';
        }
        if (typeof type === 'string') {
            type = this.types.find((t: any) => t.id === type);
        }
        if (type.id === (this.type as any).id) {
            return;
        }
        if (type.id === 'spline') {
            // Spline is just a line with tension
            this.stx.chart.tension = this.stx.layout.tension = 0.5;
            this.stx.setChartType('mountain');
        }
        else {
            this.stx.chart.tension = 0;
            delete this.stx.layout.tension;
            if (this.aggregates[type.id]) {
                // Set baseline.userLevel to false so chart won't move up after AggregationType set.
                this.stx.chart.baseline.userLevel = false;
                this.stx.setAggregationType(type.id);
                // Reset baseline.userLevel to its default value
                this.stx.chart.baseline.userLevel = null;
            }
            else {
                this.stx.setChartType(type.id);
            }
        }
        this.type = type;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateProps(onChange: any) {
        this.onChartTypeChanged = onChange;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    showAggregateDialog(aggregateId: any) {
        if (aggregateId !== (this.type as any).id) {
            this.setType(aggregateId);
        }
        const aggregate = this.aggregates[aggregateId];
        this.settingsDialog.title = aggregate.title;
        const inputs = aggregate.inputs.map(({ id, ...agg }: any) => {
            const name = id === 'box' || id === 'reversal' ? `pandf.${id}` : id;
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            const tuple = CIQ.deriveFromObjectChain(this.stx.layout, name);
            const value = tuple.obj[tuple.member];
            const defaultValue = this.stx.chart.defaultChartStyleConfig[id];
            return {
                id: name,
                value: value != undefined ? value : defaultValue,
                defaultValue,
                ...agg,
            };
        });
        this.settingsDialog.items = inputs;
        this.settingsDialog.setOpen(true);
    }
    updateAggregate = (items: any) => {
        for (const { id, value } of items) {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            const tuple = CIQ.deriveFromObjectChain(this.stx.layout, id);
            tuple.obj[tuple.member] = value;
        }
        this.stx.changeOccurred('layout');
        this.stx.createDataSet();
        this.stx.draw();
    };
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get types() {
        const isTickSelected = this.mainStore.timeperiod.timeUnit === 'tick';
        if (this.chartTypes === undefined) {
            this.chartTypes = [...ChartTypes];
        }
        return this.chartTypes.map((t: any) => ({
            ...t,
            active: t.id === (this.type as any).id,
            disabled: t.candleOnly ? isTickSelected : false
        }));
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setChartTypeFromLayout(layout: any) {
        const chartType = this.getChartTypeFromLayout(layout);
        const typeIdx = this.chartTypes.findIndex((t: any) => t.id === chartType);
        this.type = this.chartTypes[typeIdx];
    }
    getChartTypeFromLayout(layout: any) {
        let chartType;
        if (layout.tension) {
            // We assume that if tension is set, spline is enabled
            chartType = 'spline';
        }
        else if (this.aggregates[layout.aggregationType]) {
            chartType = layout.aggregationType;
        }
        else {
            chartType = layout.chartType;
        }
        return chartType;
    }
    isTypeCandle(type: any) {
        if (typeof type === 'string') {
            type = this.types.find((t: any) => t.id === type);
        }
        return notCandles.indexOf(type.id) === -1;
    }
}
