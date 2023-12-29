import { action, observable, reaction, when, makeObservable } from 'mobx';
import Context from 'src/components/ui/Context';
import { ChartType } from 'src/types';
import MainStore from '.';
import { ChartTypes } from '../Constant';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import ListStore from './ListStore';
import MenuStore from './MenuStore';
import SettingsDialogStore from './SettingsDialogStore';

const notCandles = [...ChartTypes].filter(t => !t.candleOnly).map(t => t.id);

export default class ChartTypeStore {
    chartTypes: Array<ChartType> = [];
    listStore: ListStore;
    mainStore: MainStore;
    menuStore: MenuStore;
    settingsDialog: SettingsDialogStore;
    type: ChartType = ChartTypes.find(t => t.id === 'line') as ChartType;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            type: observable,
            updateProps: action.bound,
            setChartType: action.bound,
            setType: action.bound,
            isTypeCandle: action.bound,
        });

        this.mainStore = mainStore;
        when(() => !!this.context, this.onContextReady);
        this.menuStore = new MenuStore(mainStore, { route: 'chart-type' });
        this.listStore = new ListStore({
            getContext: () => this.context,
            getItems: () => this.types,
        });
        this.settingsDialog = new SettingsDialogStore({
            mainStore,
            onChanged: () => null,
        });

        reaction(
            () => this.mainStore.state.chartType,
            () => {
                if (this.mainStore.state.chartType !== undefined) {
                    this.setType(this.mainStore.state.chartType);
                }
            }
        );
    }

    onChartTypeChanged?: (chartType?: string) => void;

    get context(): Context | null {
        return this.mainStore.chart.context;
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
    onContextReady = () => {
        this.chartTypes = [...ChartTypes];
    };
    setChartType(type?: string) {
        if (!type) return;

        this.setType(type);
    }

    setType(type?: ChartType | string) {
        logEvent(LogCategories.ChartControl, LogActions.ChartType, type);

        let chartType: ChartType | undefined;

        type = type || 'line';

        if (typeof type != 'string') {
            chartType = type;
        } else {
            chartType = this.types.find(t => t.id === type);
        }

        if (!chartType || chartType.id === this.type.id) {
            return;
        }
        this.type = chartType;
    }

    updateProps(onChange: (chartType?: string) => void) {
        this.onChartTypeChanged = onChange;
    }

    get types() {
        const isTickSelected = this.mainStore.chart.granularity === 0;
        if (this.chartTypes === undefined || this.chartTypes.length === 0) {
            this.chartTypes = [...ChartTypes];
        }
        return this.chartTypes.map(t => ({
            ...t,
            active: t.id === this.type.id,
            disabled: t.candleOnly ? isTickSelected : false,
        }));
    }

    isTypeCandle(type: ChartType | string) {
        if (typeof type === 'string') {
            type = (this.types.find(t => t.id === type) as ChartType) || this.types[0];
        }
        return notCandles.indexOf(type.id) === -1;
    }
}
