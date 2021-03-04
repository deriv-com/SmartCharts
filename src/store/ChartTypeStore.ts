import { action, computed, observable, reaction, when } from 'mobx';
import MenuStore from './MenuStore';
import ListStore from './ListStore';
import SettingsDialogStore from './SettingsDialogStore';
import List from '../components/List.jsx';
import Menu from '../components/Menu.jsx';
import SettingsDialog from '../components/SettingsDialog.jsx';
import { logEvent, LogCategories, LogActions } from '../utils/ga';
import { ChartTypes } from '../Constant';

const notCandles = [...ChartTypes].filter(t => !t.candleOnly).map(t => t.id);

const aggregateCharts = [...ChartTypes].filter(t => t.settingsOnClick);

function getAggregates() {
    return {
        heikinashi: true,
        kagi: {
            title: t.translate('Kagi'),
            inputs: [
                {
                    id: 'kagi',
                    title: t.translate('Reversal Percentage'),
                    type: 'numericinput',
                },
            ],
        },
        renko: {
            title: t.translate('Renko'),
            inputs: [
                {
                    id: 'renko',
                    title: t.translate('Range'),
                    type: 'numericinput',
                },
            ],
        },
        linebreak: {
            title: t.translate('Line Break'),
            inputs: [
                {
                    id: 'priceLines',
                    title: t.translate('Price Lines'),
                    type: 'numericinput',
                    max: 10,
                    step: 1,
                    min: 1,
                },
            ],
        },
        rangebars: {
            title: t.translate('Range Bars'),
            inputs: [
                {
                    id: 'range',
                    title: t.translate('Range'),
                    type: 'numericinput',
                },
            ],
        },
        pandf: {
            title: t.translate('Point & Figure'),
            inputs: [
                {
                    id: 'box',
                    title: t.translate('Box Size'),
                    type: 'numericinput',
                },
                {
                    id: 'reversal',
                    title: t.translate('Reversal'),
                    type: 'numericinput',
                },
            ],
        },
    };
}

export default class ChartTypeStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route: 'chart-type' });

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
        return this.type ? notCandles.indexOf(this.type.id) === -1 : false;
    }
    get isSpline() {
        return this.type.id === 'spline';
    }
    get isAggregateChart() {
        return !!aggregateCharts.find(t => t.id === this.stx.layout.aggregationType);
    }

    onContextReady = () => {
        this.aggregates = getAggregates();
        this.chartTypes = [...ChartTypes];

        this.setChartTypeFromLayout(this.stx.layout);

        reaction(
            () => this.mainStore.state.chartType,
            () => {
                if (this.mainStore.state.chartType !== undefined) {
                    this.setType(this.mainStore.state.chartType);
                }
            }
        );
    };

    @action.bound setTypeFromUI(type) {
        if (this.chartTypeProp !== undefined) {
            console.error(
                'Changing chart type does nothing because chartType prop is being set. Consider overriding the onChange prop in <ChartTypes />'
            );
            return;
        }

        this.setType(type);
    }

    @action.bound setType(type) {
        logEvent(LogCategories.ChartControl, LogActions.ChartType, type);
        if (!type) {
            type = 'mountain';
        }

        if (typeof type === 'string') {
            type = this.types.find(t => t.id === type);
        }
        if (type.id === this.type.id) {
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
            const name = id === 'box' || id === 'reversal' ? `pandf.${id}` : id;
            const tuple = CIQ.deriveFromObjectChain(this.stx.layout, name);
            const value = tuple.obj[tuple.member];
            const defaultValue = this.stx.chart.defaultChartStyleConfig[id];
            return {
                id: name,
                value: value != undefined ? value : defaultValue, // eslint-disable-line eqeqeq
                defaultValue,
                ...agg,
            };
        });
        this.settingsDialog.items = inputs;
        this.settingsDialog.setOpen(true);
    }

    updateAggregate = items => {
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
            this.chartTypes = [...ChartTypes];
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
        if (layout.tension) {
            // We assume that if tension is set, spline is enabled
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
