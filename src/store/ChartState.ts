/* eslint-disable no-new */
import { action, observable, when } from 'mobx';
import {
    TChartControlsWidgets,
    TChartProps,
    TGetIndicatorHeightRatio,
    TGranularity,
    TQuote,
    TSettings,
} from 'src/types';
import MainStore from '.';
import Theme from '../../sass/_themes.scss';
import { STATE } from '../Constant';
import {
    calculateGranularity,
    calculateTimeUnitInterval,
    createObjectFromLocalStorage,
    getUTCDate,
    getUTCEpoch,
} from '../utils';
import ChartStore from './ChartStore';

type TStateChangeOption = { symbol: string | undefined; isClosed: boolean };

type TScrollListenerParamsData = {
    grab: boolean;
    panel: typeof CIQ.ChartEngine.Panel;
    stx: typeof CIQ.ChartEngine;
    x: number;
    y: number;
};

class ChartState {
    chartStore: ChartStore;
    getIndicatorHeightRatio?: TGetIndicatorHeightRatio;
    isAnimationEnabled?: boolean;
    mainStore: MainStore;
    margin?: number;
    @observable granularity: TGranularity;
    @observable chartType?: string;
    @observable startEpoch?: number;
    @observable endEpoch?: number;
    @observable symbol?: string;
    @observable isConnectionOpened? = false;
    @observable isChartReady = false;
    @observable chartStatusListener?: (isChartReady: boolean) => boolean;
    @observable stateChangeListener?: (state: string, option?: TStateChangeOption) => void;
    @observable settings?: TSettings;
    @observable showLastDigitStats = false;
    @observable scrollToEpoch?: number | null;
    @observable onExportLayout?: (currentLayout: typeof CIQ.UI.Layout) => void;
    @observable clearChart?: () => void;
    @observable isChartClosed = false;
    @observable shouldMinimiseLastDigits = false;
    @observable isStaticChart? = false;
    @observable shouldFetchTradingTimes = true;
    @observable refreshActiveSymbols?: boolean;
    @observable hasReachedEndOfData = false;
    @observable prevChartType?: string;
    @observable isChartScrollingToEpoch = false;
    @observable crosshairState: number | null = 1;
    @observable crosshairTooltipLeftAllow: number | null = null;
    @observable maxTick?: number;
    @observable enableScroll: boolean | null = true;
    @observable enableZoom: boolean | null = true;
    @observable yAxisMargin = { top: 106, bottom: 64 };
    tradingTimes: string | null = null;
    activeSymbols: string | null = null;
    chartControlsWidgets?: TChartControlsWidgets;
    enabledChartFooter?: boolean;

    get stxx(): ChartStore['stxx'] {
        return this.chartStore.stxx;
    }
    get context() {
        return this.chartStore.context;
    }
    get chartTypeStore() {
        return this.mainStore.chartType;
    }
    get timeperiodStore() {
        return this.mainStore.timeperiod;
    }
    get loader() {
        return this.mainStore.loader;
    }
    get drawTools() {
        return this.mainStore.drawTools;
    }
    get indicatorRatio() {
        return this.mainStore.chart;
    }

    get rootElement() {
        return this.chartStore.rootElement;
    }

    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this.chartStore = mainStore.chart;
        when(() => !!this.context, this.onContextReady);
    }

    @action.bound onContextReady = () => {
        this.stxx.addEventListener('layout', this.saveLayout.bind(this));
        this.stxx.addEventListener('symbolChange', this.saveLayout.bind(this));
        this.stxx.addEventListener('drawing', this.saveDrawings.bind(this));
        this.stxx.addEventListener('move', this.scrollListener.bind(this));
        this.stxx.append('zoomOut', this.setEnableScroll.bind(this));
        this.stxx.append('zoomIn', this.setEnableScroll.bind(this));

        this.granularity = this.chartStore.granularity;
    };

    @action.bound updateProps({
        networkStatus,
        chartControlsWidgets,
        enabledChartFooter,
        chartStatusListener,
        stateChangeListener,
        getIndicatorHeightRatio,
        chartType,
        clearChart,
        endEpoch,
        isAnimationEnabled = true,
        isConnectionOpened,
        isStaticChart,
        granularity,
        margin = 0,
        onExportLayout,
        refreshActiveSymbols,
        scrollToEpoch,
        settings,
        shouldFetchTradingTimes = true,
        showLastDigitStats = false,
        startEpoch,
        symbol,
        crosshairState,
        zoom,
        maxTick,
        crosshairTooltipLeftAllow,
        yAxisMargin,
        enableScroll = null,
        enableZoom = null,
        anchorChartToLeft = false,
        chartData,
    }: TChartProps) {
        let isSymbolChanged = false;
        let isGranularityChanged = false;

        if (
            chartData?.tradingTimes &&
            typeof chartData.tradingTimes === 'object' &&
            JSON.stringify(chartData.tradingTimes) !== this.tradingTimes
        ) {
            this.mainStore.chart.tradingTimes?._calculatingTradingTime(chartData.tradingTimes);
            this.tradingTimes = JSON.stringify(chartData.tradingTimes);
        }
        if (
            chartData?.activeSymbols &&
            typeof chartData.activeSymbols === 'object' &&
            JSON.stringify(chartData.activeSymbols) !== this.activeSymbols
        ) {
            this.activeSymbols = JSON.stringify(chartData.activeSymbols);
            this.mainStore.chart.activeSymbols?.computeActiveSymbols(chartData.activeSymbols);
        }

        this.chartStatusListener = chartStatusListener;
        this.stateChangeListener = stateChangeListener;
        this.isAnimationEnabled = isAnimationEnabled;
        this.isConnectionOpened = isConnectionOpened;
        this.isStaticChart = isStaticChart;
        this.margin = margin;
        this.settings = settings;
        this.shouldFetchTradingTimes = shouldFetchTradingTimes;
        this.showLastDigitStats = showLastDigitStats;
        this.getIndicatorHeightRatio = getIndicatorHeightRatio;

        if (
            networkStatus &&
            (!this.mainStore.chart.networkStatus || networkStatus.class !== this.mainStore.chart.networkStatus.class)
        ) {
            this.mainStore.chart.networkStatus = networkStatus;
        }

        if (chartControlsWidgets !== this.chartControlsWidgets) {
            this.chartControlsWidgets = chartControlsWidgets;
            if (this.stxx) this.mainStore.chart.updateHeight();
        }

        if (enabledChartFooter !== this.enabledChartFooter) {
            this.enabledChartFooter = enabledChartFooter;
            if (this.stxx) this.mainStore.chart.updateHeight();
        }

        if (symbol !== this.symbol) {
            this.symbol = symbol;
            isSymbolChanged = true;

            this.mainStore.chartTitle.hidePrice();
            if (this.mainStore.chart && this.mainStore.chart.feed && scrollToEpoch) {
                this.mainStore.chart.feed.onMasterDataReinitialize(this.scrollChartToLeft);
            }
        }

        if (onExportLayout !== this.onExportLayout) {
            this.onExportLayout = onExportLayout;
            this.exportLayout();
        }

        if (chartType !== this.chartType && this.context) {
            if (chartType === 'table') this.prevChartType = this.chartTypeStore.type.id;
            this.setChartType(chartType);
        }

        if (granularity !== undefined && granularity !== this.granularity) {
            this.setChartGranularity(granularity);

            isGranularityChanged = true;
            if (this.mainStore.chart && this.mainStore.chart.feed && !isSymbolChanged && scrollToEpoch) {
                this.mainStore.chart.feed.onMasterDataReinitialize(this.scrollChartToLeft);
            }
        }

        if (this.chartStore.activeSymbols && refreshActiveSymbols !== this.refreshActiveSymbols) {
            this.refreshActiveSymbols = refreshActiveSymbols;

            if (this.refreshActiveSymbols) {
                this.chartStore.activeSymbols.retrieveActiveSymbols(this.refreshActiveSymbols);
            }
        }

        if (clearChart !== this.clearChart) {
            this.clearChart = clearChart;
            this.cleanChart();
        }

        // This if statement should be always after setting `this.scrollToEpoch` value
        if (this.startEpoch !== startEpoch || this.endEpoch !== endEpoch) {
            this.startEpoch = startEpoch;
            this.endEpoch = endEpoch;

            if (isStaticChart && this.stxx && this.granularity === this.mainStore.chart.granularity) {
                // Reload the chart if it is a static chart and the granularity hasn't changed
                this.mainStore.chart.newChart();
            } else if (this.mainStore.chart.feed) {
                /* When layout is importing and range is changing as the same time we dont need to set the range,
                   the imported layout witll take care of it. */
                if (!this.scrollToEpoch && !isSymbolChanged && !isGranularityChanged) {
                    this.mainStore.chart.feed.onRangeChanged(true);
                }
            }
        }

        // Please always assign scrollToEpoch after startEpoch and keep this if statement exactly after above if clause
        if (!isStaticChart && scrollToEpoch !== this.scrollToEpoch) {
            this.scrollToEpoch = scrollToEpoch;
            if (this.mainStore.chart && this.mainStore.chart.feed && !isSymbolChanged && !isGranularityChanged) {
                this.setIsChartScrollingToEpoch(true);
                this.scrollChartToLeft();
                if (anchorChartToLeft) {
                    // just to ensure scale 1:1 work prefectly if we have endEpoch
                    // we call scrollChartToLeft() twice with some delay and notify
                    // the STATE change with a delay to ensure scrolling is completed
                    setTimeout(() => this.scrollChartToLeft(), 400);
                    setTimeout(() => this.stateChange(STATE.SCROLL_TO_LEFT), 900);
                } else {
                    this.stateChange(STATE.SCROLL_TO_LEFT);
                }
            }
        }

        if (crosshairState !== undefined && crosshairState !== null && crosshairState !== this.crosshairState) {
            this.mainStore.crosshair.setCrosshairState(crosshairState);
            this.crosshairState = crosshairState;
        }

        if (crosshairTooltipLeftAllow !== undefined && this.crosshairTooltipLeftAllow !== crosshairTooltipLeftAllow) {
            this.crosshairTooltipLeftAllow = crosshairTooltipLeftAllow;
        }

        if (zoom) {
            if (zoom === 1) {
                this.mainStore.chartSize.zoomIn();
            } else {
                this.mainStore.chartSize.zoomOut();
            }
        }

        this.mainStore.chartSetting.setSettings(this.settings);

        if (maxTick && this.maxTick !== maxTick && this.stxx) {
            this.maxTick = maxTick;
            this.setMaxtTick();
        }

        if (yAxisMargin && typeof yAxisMargin === 'object') {
            this.yAxisMargin = {
                ...this.yAxisMargin,
                ...yAxisMargin,
            };
        }

        if (this.stxx && enableScroll !== null && this.enableScroll !== enableScroll) {
            this.enableScroll = enableScroll;
            this.stxx.allowScroll = enableScroll;
        }

        if (this.stxx && enableZoom !== null && this.enableZoom !== enableZoom) {
            this.enableZoom = enableZoom;
            this.stxx.allowZoom = enableZoom;
        }

        if (this.stxx) {
            this.stxx.chart.panel.yAxis.drawCurrentPriceLabel = !this.endEpoch;
            this.stxx.preferences.currentPriceLine = !this.endEpoch;
            this.stxx.isAutoScale = this.settings && this.settings.isAutoScale !== false;
            this.stxx.draw();
        }
    }

    @action.bound setMaxtTick() {
        if (this.stxx && this.maxTick) {
            this.stxx.setMaxTicks(this.maxTick);
            this.stxx.draw();
        }
    }

    @action.bound setIsChartScrollingToEpoch(isScrollingToEpoch: boolean) {
        this.isChartScrollingToEpoch = isScrollingToEpoch;
    }

    @action.bound setChartClosed(isClosed: boolean) {
        this.isChartClosed = isClosed;
        this.stateChange(STATE.MARKET_STATE_CHANGE, { symbol: this.symbol, isClosed });
    }

    setChartTheme(theme: string, isChartClosed = this.isChartClosed) {
        if (!this.stxx) return;
        this.stxx.clearStyles();
        this.stxx.setStyle('stx_grid', 'color', Theme[`${theme}_chart_grid`]);
        this.stxx.setStyle('stx_yaxis', 'color', Theme[`${theme}_chart_text`]);
        this.stxx.setStyle('stx_xaxis', 'color', Theme[`${theme}_chart_text`]);
        this.stxx.setStyle('stx_xaxis_dark', 'color', Theme[`${theme}_chart_text`]);

        if (this.rootElement) {
            (this.rootElement?.querySelector('.chartContainer') as HTMLElement).style.backgroundColor =
                Theme[`${theme}_chart_bg`];
        }
        // change chart colors to grey if the current market is closed and it is not a static chart
        if (isChartClosed && !this.isStaticChart) {
            this.stxx.setStyle('stx_mountain_chart', 'borderTopColor', Theme[`${theme}_chart_closed_mountain_border`]);

            // Candle type
            this.stxx.setStyle('stx_candle_up', 'color', Theme.chart_closed_candle_up);
            this.stxx.setStyle('stx_candle_shadow_up', 'color', Theme.chart_closed_candle_border);
            this.stxx.setStyle('stx_candle_down', 'color', Theme.chart_closed_candle_down);
            this.stxx.setStyle('stx_candle_shadow_down', 'color', Theme.chart_closed_candle_border);

            // Hollow type
            this.stxx.setStyle('stx_hollow_candle_up', 'color', Theme.chart_closed_candle_up);
            this.stxx.setStyle('stx_hollow_candle_down', 'color', Theme.chart_closed_candle_down);

            // OHLC type
            this.stxx.setStyle('stx_bar_up', 'color', Theme.chart_closed_candle_up);
            this.stxx.setStyle('stx_bar_down', 'color', Theme.chart_closed_candle_down);

            // current price bg color
            this.stxx.setStyle('stx_current_hr_down', 'background-color', Theme.chart_closed_current_hr);
            this.stxx.setStyle('stx_current_hr_up', 'background-color', Theme.chart_closed_current_hr);
        } else {
            this.stxx.setStyle('stx_mountain_chart', 'borderTopColor', Theme[`${theme}_chart_mountain_border`]);
            this.stxx.setStyle('stx_mountain_chart', 'backgroundColor', Theme[`${theme}_chart_mountain_bg`]);
            this.stxx.setStyle('stx_mountain_chart', 'color', Theme[`${theme}_chart_mountain_bg_shade`]);
            // current price bg color
            this.stxx.setStyle('stx_current_hr_down', 'background-color', Theme.chart_current_hr);
            this.stxx.setStyle('stx_current_hr_up', 'background-color', Theme.chart_current_hr);
        }
        this.stxx.draw();
    }

    @action.bound stateChange(tag: string, option?: TStateChangeOption) {
        if (this.stateChangeListener && typeof this.stateChangeListener === 'function') {
            this.stateChangeListener(tag, option);
        }
    }

    @action.bound setChartIsReady(isChartReady: boolean) {
        if (this.isChartReady !== isChartReady) {
            this.isChartReady = isChartReady;

            if (isChartReady) {
                this.chartStore.setResizeEvent();
                this.stateChange(STATE.READY);
            }

            if (this.chartStatusListener && typeof this.chartStatusListener === 'function') {
                this.chartStatusListener(isChartReady);
            }
        }
    }

    @action.bound setChartGranularity(granularity: TGranularity) {
        const isTimeUnitSecond = calculateTimeUnitInterval(granularity).timeUnit === 'second';
        const isChartTypeCandle =
            this.mainStore.chartType.isCandle ||
            (this.chartType && this.mainStore.chartType.isTypeCandle(this.chartType));

        if (this.context && isTimeUnitSecond && isChartTypeCandle) {
            this.setChartType('mountain'); // if granularity is zero, set the chartType to 'mountain'
        }
        this.granularity = granularity === null ? undefined : granularity;
    }

    @action.bound setChartType(chartType: string | undefined) {
        this.chartType = chartType;
        if (this.chartTypeStore.onChartTypeChanged) {
            this.chartTypeStore.onChartTypeChanged(chartType);
        }
    }

    @action.bound setShouldMinimiseLastDigit(status: boolean) {
        this.shouldMinimiseLastDigits = status;
    }

    setEnableScroll() {
        if (!this.enableScroll || !this.stxx) {
            return;
        }
        this.stxx.allowScroll = true;
    }

    setDisableScroll() {
        if (!this.stxx) {
            return;
        }
        this.stxx.allowScroll = false;
    }

    saveLayout() {
        if (!this.chartStore.chartId || !this.stxx) return;
        const layoutData = this.stxx.exportLayout(true);
        const json = JSON.stringify(layoutData);
        CIQ.localStorageSetItem(`layout-${this.chartStore.chartId}`, json);
    }

    // returns false if restoring layout fails
    restoreLayout() {
        let layoutData = createObjectFromLocalStorage(`layout-${this.chartStore.chartId}`);

        if (!layoutData || !layoutData.symbols.length) return false;

        // prop values will always take precedence
        if (this.symbol !== undefined && this.symbol !== '' && this.symbol !== layoutData.symbols[0].symbol) {
            // symbol prop takes precedence over local storage data
            const symbolObject = this.chartStore.activeSymbols?.getSymbolObj(this.symbol);
            layoutData.symbols = [{ symbol: this.symbol, symbolObject }];
        }

        for (const symbolDat of layoutData.symbols) {
            // Symbol from cache may be in different language, so replace it with server's
            const { symbol: cachedSymbol } = symbolDat;
            const updatedSymbol = this.chartStore.activeSymbols?.getSymbolObj(cachedSymbol);
            symbolDat.symbolObject = updatedSymbol;
            if (symbolDat.parameters) {
                symbolDat.parameters.display = updatedSymbol?.name;

                // These gap settings are default when new comparisons are added,
                // but for backward support we need to set them here.
                symbolDat.parameters.fillGaps = true;
                symbolDat.parameters.gapDisplayStyle = true;
            }
        }

        if (this.granularity !== undefined) {
            const periodicity = calculateTimeUnitInterval(this.granularity);
            layoutData = { ...layoutData, ...periodicity };
        } else {
            // update this.granularity with chartLayout
            const { timeUnit, interval, periodicity } = layoutData;
            const period = timeUnit ? interval : periodicity;
            this.chartStore.granularity = calculateGranularity(period, timeUnit || interval);
        }

        if (this.startEpoch || this.endEpoch) {
            // already set in chart params
            delete layoutData.span;
            delete layoutData.range;
        }

        if (this.chartType !== undefined) {
            layoutData.chartType = this.chartType;
        }

        // Update Indictor panel height
        const indicatorCount = Object.keys(layoutData.panels).filter(item => item !== 'chart').length;
        const indiactorHeightPercent = this.indicatorRatio.indicatorHeightRatio(indicatorCount).percent;
        Object.keys(layoutData.panels).forEach(id => {
            if (id === 'chart') {
                return;
            }
            const panel = layoutData.panels[id];
            panel.percent = indiactorHeightPercent;
        });

        this.stxx.importLayout(layoutData, {
            managePeriodicity: true,
            cb: () => {
                if (!this.context) return false;

                if (layoutData.tension) {
                    this.stxx.chart.tension = layoutData.tension;
                }
                this.restoreDrawings();
                if (this.chartStore.loader) {
                    this.chartStore.loader.hide();
                    this.mainStore.paginationLoader.updateOnPagination(false);
                    this.setChartIsReady(true);
                    this.stxx.home();
                }

                this.chartStore.setMainSeriesDisplay(this.stxx.chart.symbolObject.name);
            },
        });

        this.chartStore.updateCurrentActiveSymbol();

        return true;
    }

    saveDrawings() {
        if (!this.chartStore.chartId) return;
        const obj = this.stxx.exportDrawings();
        const symbol = this.stxx.chart.symbol;
        if (obj.length === 0) {
            CIQ.localStorage.removeItem(`${symbol}-${this.chartStore.chartId}`);
        } else {
            CIQ.localStorageSetItem(`${symbol}-${this.chartStore.chartId}`, JSON.stringify(obj));
        }
    }

    restoreDrawings() {
        if (this.stxx && this.stxx.chart) {
            const drawings = createObjectFromLocalStorage(`${this.stxx.chart.symbol}-${this.chartStore.chartId}`);
            if (drawings) {
                this.stxx.importDrawings(drawings);
                this.stxx.draw();
                if (this.drawTools) {
                    this.drawTools.computeActiveDrawTools();
                }
            }
        }
    }

    scrollChartToLeft = (leftTick?: TQuote | null, force?: boolean) => {
        if (!this.stxx?.chart) return;

        const scrollToEpoch = this.scrollToEpoch || (leftTick && getUTCEpoch(leftTick.DT as Date));
        this.stxx.chart.entryTick = null;

        if (this.scrollToEpoch && !this.startEpoch && !force) {
            const startEntry = this.stxx.chart.dataSet.find(
                (entry: TQuote) =>
                    entry.DT?.valueOf() === CIQ.strToDateTime(getUTCDate(scrollToEpoch as number)).valueOf()
            );

            if (startEntry) {
                this.stxx.chart.entryTick = this.stxx.tickFromDate(startEntry.DT);
            } else {
                this.stxx.chart.entryTick = this.stxx.chart.dataSet.length - 1;
            }

            const scrollToTarget = this.stxx.chart.dataSet.length - this.stxx.chart.entryTick + 1;
            if (this.stxx.animations.liveScroll && this.stxx.animations.liveScroll.running) {
                this.stxx.animations.liveScroll.stop();
            }

            this.stxx.minimumLeftBars = 1;
            this.stxx.micropixels = 0;

            this.stxx.scrollTo(this.stxx.chart, scrollToTarget, () => {
                this.stxx.setMaxTicks(5);
                this.stxx.micropixels = 0;
                this.setIsChartScrollingToEpoch(false);
                this.stxx.draw();

                // This assignment should be always after draw()
                this.stxx.chart.lockScroll = true;
            });
        } else if ((scrollToEpoch && this.startEpoch) || force) {
            // scale 1:1 happen
            this.stxx.chart.lockScroll = true;
            this.stxx.chart.entryTick = this.stxx.tickFromDate(
                getUTCDate(this.startEpoch || (scrollToEpoch as number))
            );
            const scrollToTarget = this.stxx.chart.dataSet.length - this.stxx.chart.entryTick;
            if (!this.endEpoch) {
                this.stxx.setMaxTicks(scrollToTarget + 3);
                this.stxx.chart.scroll = scrollToTarget + 1;
            } else {
                this.stxx.setMaxTicks(Math.floor((scrollToTarget * 3) / 2) || 2);
                this.stxx.chart.scroll = Math.floor((scrollToTarget * 5) / 4) || 1;
                this.setDisableScroll();
            }
            this.mainStore.chart.updateScaledOneOne(true);
            this.stxx.draw();
            this.setIsChartScrollingToEpoch(false);
        } else {
            this.stxx.chart.entryTick = null;
            this.stxx.chart.lockScroll = false;
            this.stxx.home();
            this.stxx.draw();
            this.setIsChartScrollingToEpoch(false);
        }
        this.mainStore.chart.feed?.offMasterDataReinitialize(this.scrollChartToLeft);
        this.mainStore.chart.feed?.offMasterDataUpdate(this.scrollChartToLeft);
    };

    cleanChart() {
        if (!this.clearChart || !this.isChartReady) return;

        // Remove comparsions
        for (const field in this.stxx.chart.series) {
            this.stxx.removeSeries(field);
        }
        // Remove indiactors
        for (const id in this.stxx.layout.studies) {
            const sd = this.stxx.layout.studies[id];
            CIQ.Studies.removeStudy(this.stxx, sd);
        }
        this.stxx.clearDrawings();

        // TODO: use constant
        this.mainStore.crosshair.onCrosshairChanged(2);
    }

    exportLayout() {
        if (!this.onExportLayout || !this.stxx) return;
        const currentLayout = this.stxx.exportLayout();
        currentLayout.drawings = this.stxx.exportDrawings();
        currentLayout.series = [];
        for (const field in this.stxx.chart.series) {
            currentLayout.series.push(field);
        }
        currentLayout.previousMaxTicks = this.stxx.chart.maxTicks;

        this.onExportLayout(currentLayout);
    }

    scrollListener({ grab }: TScrollListenerParamsData) {
        if (grab && this.stxx.chart.lockScroll) {
            this.stxx.chart.lockScroll = false;
        }
    }
}

export default ChartState;
