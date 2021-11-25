import { action, observable, reaction, when } from 'mobx';
import Context from 'src/components/ui/Context';
import { TCIQAppend, TGranularity } from 'src/types';
import MainStore from '.';
import { displayMilliseconds, getIntervalInSeconds, getTimeUnit } from '../utils';
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
    tick: 1,
    minute: 1,
    hour: 60,
};

export default class TimeperiodStore {
    _injectionId?: TCIQAppend<() => void>;
    _serverTime: ReturnType<typeof ServerTime.getInstance>;
    mainStore: MainStore;
    @observable portalNodeIdChanged?: string;
    predictionIndicator: IndicatorPredictionDialogStore;

    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this.predictionIndicator = new IndicatorPredictionDialogStore({
            mainStore,
        });

        this._serverTime = ServerTime.getInstance();
        when(() => !!this.context, this.onContextReady);
    }

    get context(): Context | null {
        return this.mainStore.chart.context;
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
    get display() {
        return `${
            this.interval === 'day' ? 1 : (this.interval as number) / TimeMap[this.timeUnit as keyof typeof TimeMap]
        } ${UnitMap[this.timeUnit as keyof typeof TimeMap]}`;
    }
    @observable timeUnit?: string | null = null;
    @observable interval: string | number | null = null;
    @observable preparingInterval: number | null = null;

    onGranularityChange: (granularity?: TGranularity) => void | null = () => null;

    remain: string | null = null;

    onContextReady = () => {
        const { timeUnit, interval } = this.context?.stx.layout;
        this.timeUnit = getTimeUnit({ timeUnit, interval });
        this.interval = interval;

        this.updateCountdown();

        reaction(
            () => [
                this.timeUnit,
                this.interval,
                this.mainStore.chartSetting.countdown,
                this.mainStore.chartType.type,
                this.loader.currentState,
                this.isSymbolOpen,
            ],
            this.updateCountdown.bind(this)
        );

        this.context?.stx.addEventListener('newChart', this.updateDisplay);

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

        if (this._injectionId && this.context) {
            this.context.stx.removeInjection(this._injectionId);
        }

        this._injectionId = undefined;
        this.countdownInterval = undefined;
    }

    updateCountdown() {
        if (!this.context) return;
        const stx = this.context.stx;
        this.remain = null;
        this.clearCountdown();

        const setRemain = () => {
            if (stx.isDestroyed || this.isTick || !this.isSymbolOpen) {
                this.clearCountdown();
                return;
            }

            const { dataSegment } = stx.chart;
            if (dataSegment && dataSegment.length) {
                const dataSegmentClose = [...dataSegment].filter(item => item && item.Close);
                if (dataSegmentClose && dataSegmentClose.length) {
                    const currentQuote = dataSegmentClose[dataSegmentClose.length - 1];
                    const now = this._serverTime.getUTCDate();
                    const diff = now - currentQuote.DT;
                    const chartInterval = getIntervalInSeconds(stx.layout) * 1000;
                    const coefficient = diff > chartInterval ? Math.floor(diff / chartInterval) + 1 : 1;

                    if (this.context?.stx) {
                        this.remain = displayMilliseconds(coefficient * chartInterval - diff);
                        stx.draw();
                    }
                }
            }
        };

        const hasCountdown = this.mainStore.chartSetting.countdown && !this.isTick;

        if (hasCountdown) {
            if (!this._injectionId) {
                this._injectionId = stx.append('draw', () => {
                    if (this.isTick) {
                        this.clearCountdown();
                        return;
                    }

                    if (this.remain && stx.currentQuote() !== null) {
                        stx.yaxisLabelStyle = 'rect';
                        stx.labelType = 'countdown';
                        stx.createYAxisLabel(stx.chart.panel, this.remain, this.remainLabelY(), '#15212d', '#FFFFFF');
                        stx.labelType = undefined;
                        stx.yaxisLabelStyle = 'roundRect';
                    }
                });
            }

            if (!this.countdownInterval) {
                this.countdownInterval = setInterval(setRemain, 1000);
                setRemain();
            }
        }
    }

    @action.bound setGranularity(granularity?: TGranularity) {
        if (this.mainStore.state.granularity !== undefined) {
            console.error(
                'Setting granularity does nothing since granularity prop is set. Consider overriding the onChange prop in <TimePeriod />'
            );
            return;
        }

        logEvent(LogCategories.ChartControl, LogActions.Interval, granularity?.toString());
        this.mainStore.chart.changeSymbol(undefined, granularity);
    }

    @action.bound updateProps(onChange: (granularity?: TGranularity) => void) {
        if (this.mainStore.state.granularity !== undefined) {
            this.onGranularityChange = onChange;
        }
    }

    @action.bound changeGranularity(interval: TGranularity) {
        if (interval === 0 && this.mainStore.studies.hasPredictionIndicator) {
            this.predictionIndicator.dialogPortalNodeId = this.portalNodeIdChanged;
            this.predictionIndicator.setOpen(true);
        } else {
            this.preparingInterval = interval as number;
            this.onGranularityChange(interval);
        }
    }

    @action.bound updateDisplay() {
        if (!this.context) return;
        const stx = this.context.stx;
        this.timeUnit = getTimeUnit(stx.layout);
        this.interval = stx.layout.interval;
    }

    remainLabelY = () => {
        const stx = this.context?.stx;
        const topPos = 36;
        const labelHeight = 24;
        const bottomPos = 66;
        let y = stx.chart.currentPriceLabelY + labelHeight;
        if (stx.chart.currentPriceLabelY > stx.chart.panel.bottom - bottomPos) {
            y = stx.chart.panel.bottom - bottomPos;
            y = y < stx.chart.currentPriceLabelY - labelHeight ? y : stx.chart.currentPriceLabelY - labelHeight;
        } else if (stx.chart.currentPriceLabelY < stx.chart.panel.top) {
            y = topPos;
        }
        return y;
    };

    @action.bound updatePortalNode(portalNodeId: string | undefined) {
        this.portalNodeIdChanged = portalNodeId;
    }
}
