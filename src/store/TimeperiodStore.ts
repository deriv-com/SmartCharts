import { action, observable, reaction, when, makeObservable } from 'mobx';
import { TGranularity } from 'src/types';
import { ChartTypes, Intervals, STATE } from 'src/Constant';
import MainStore from '.';
import { displayMilliseconds, getTimeIntervalName, getTimeUnit } from '../utils';
import { LogActions, LogCategories, logEvent } from '../utils/ga';
import ServerTime from '../utils/ServerTime';
import IndicatorPredictionDialogStore from './IndicatorPredictionDialogStore';

const UnitMap = {
    tick: 'T',
    minute: 'M',
    hour: 'H',
    day: 'D',
};

const TimeMap = {
    minute: 60,
    hour: 3600,
    day: 86400,
};

export default class TimeperiodStore {
    _serverTime: ReturnType<typeof ServerTime.getInstance>;
    mainStore: MainStore;
    portalNodeIdChanged?: string;
    predictionIndicator: IndicatorPredictionDialogStore;

    constructor(mainStore: MainStore) {
        makeObservable(this, {
            changeGranularity: action.bound,
            portalNodeIdChanged: observable,
            setGranularity: action.bound,
            updateProps: action.bound,
            updatePortalNode: action.bound,
        });

        this.mainStore = mainStore;
        this.predictionIndicator = new IndicatorPredictionDialogStore({
            mainStore,
        });

        this._serverTime = ServerTime.getInstance();
        when(() => this.mainStore.chartAdapter.isFeedLoaded, this.onDataInitialized);
    }

    get loader() {
        return this.mainStore.loader;
    }
    get isTick() {
        return this.timeUnit === 'tick';
    }
    get isSymbolOpen() {
        return this.mainStore.chartTitle.isSymbolOpen;
    }
    get timeUnit() {
        return getTimeUnit(this.mainStore.chart.granularity);
    }
    get display() {
        if (this.mainStore.chart.granularity === undefined) {
            return '';
        }

        return `${
            this.mainStore.chart.granularity === 0
                ? 1
                : this.mainStore.chart.granularity / TimeMap[this.timeUnit as keyof typeof TimeMap]
        } ${UnitMap[this.timeUnit as keyof typeof TimeMap]}`;
    }

    onGranularityChange: (granularity?: TGranularity) => void | null = () => null;

    remain: string | null = null;

    onDataInitialized = () => {
        this.updateCountdown();

        reaction(
            () => [
                this.timeUnit,
                this.mainStore.chartSetting.countdown,
                this.mainStore.chartType.type,
                this.loader.currentState,
                this.isSymbolOpen,
            ],
            this.updateCountdown.bind(this)
        );

        reaction(
            () => this.mainStore.state.granularity,
            granularity => this.onGranularityChange(granularity)
        );
    };

    countdownInterval?: ReturnType<typeof setInterval>;

    clearCountdown() {
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }

        this.countdownInterval = undefined;
    }

    updateCountdown() {
        this.remain = null;
        this.clearCountdown();

        const setRemain = () => {
            if (this.isTick || !this.isSymbolOpen) {
                this.clearCountdown();
                return;
            }

            const dataSegment = this.mainStore.chart?.feed?.quotes;
            if (dataSegment && dataSegment.length) {
                const dataSegmentClose = [...dataSegment].filter(item => item && item.Close);
                if (dataSegmentClose && dataSegmentClose.length) {
                    const currentQuote = dataSegmentClose[dataSegmentClose.length - 1];
                    if (currentQuote.DT) {
                        const now = this._serverTime.getLocalDate().getTime();
                        const diff = now - currentQuote.DT.getTime();

                        const granularity = this.mainStore.chart.granularity;

                        const chartInterval = (granularity || 1) * 1000;
                        const coefficient = diff > chartInterval ? Math.floor(diff / chartInterval) + 1 : 1;

                        this.remain = displayMilliseconds(coefficient * chartInterval - diff);

                        this.mainStore.chartAdapter.flutterChart?.config.setRemainingTime(this.remain || '');
                    }
                }
            }
        };

        const hasCountdown = this.mainStore.chartSetting.countdown && !this.isTick;

        if (hasCountdown) {
            if (!this.countdownInterval) {
                this.countdownInterval = setInterval(setRemain, 1000);
                setRemain();
            }
        }
    }

    setGranularity(granularity?: TGranularity) {
        logEvent(LogCategories.ChartControl, LogActions.Interval, granularity?.toString());

        if (this.onGranularityChange) {
            this.onGranularityChange(granularity);
        } else {
            this.mainStore.chart.changeSymbol(undefined, granularity);
        }
    }

    updateProps(onChange: (granularity?: TGranularity) => void) {
        if (this.mainStore.state.granularity !== undefined) {
            this.onGranularityChange = onChange;
        }
    }

    changeGranularity(interval: TGranularity) {
        if (interval) {
            const chart_type_name = ChartTypes.find(type => type.id === this.mainStore.chartType.type.id)?.text ?? '';
            this.mainStore.state.stateChange(STATE.CHART_INTERVAL_CHANGE, {
                time_interval_name: getTimeIntervalName(interval, Intervals),
                chart_type_name:
                    this.mainStore.chartType.type.id === 'colored_bar'
                        ? chart_type_name
                        : chart_type_name.toLowerCase(),
            });
        }
        if (interval === 0 && this.mainStore.studies.hasPredictionIndicator) {
            this.predictionIndicator.dialogPortalNodeId = this.portalNodeIdChanged;
            this.predictionIndicator.setOpen(true);
        } else {
            this.onGranularityChange(interval);
        }
    }

    remainLabelY = () => {
        const currentClose = this.mainStore.chart.currentClose;

        if (!currentClose) return;

        const y = this.mainStore.chartAdapter.getYFromQuote(currentClose);
        return y;
    };

    updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
