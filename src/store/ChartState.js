/* eslint-disable no-new */
import { action, observable, when } from 'mobx';
import { createObjectFromLocalStorage, calculateTimeUnitInterval, calculateGranularity, getUTCDate, getUTCEpoch } from '../utils';
import Theme from '../../sass/_themes.scss';

class ChartState {
    @observable granularity;
    @observable chartType;
    @observable startEpoch;
    @observable endEpoch;
    @observable symbol;
    @observable isConnectionOpened;
    @observable isChartReady = false;
    @observable chartStatusListener;
    @observable settings;
    @observable showLastDigitStats;
    @observable scrollToEpoch;
    @observable onExportLayout;
    @observable clearChart;
    @observable isChartClosed = false;
    @observable shouldMinimiseLastDigits = false;
    @observable isStaticChart = false;
    @observable shouldFetchTradingTimes = true;
    @observable refreshActiveSymbols;
    @observable hasReachedEndOfData = false;
    @observable prevChartType;
    @observable isChartScrollingToEpoch = false;
    @observable crosshairState = 1;
    @observable maxTick;
    chartControlsWidgets;

    get comparisonStore() { return this.mainStore.comparison; }
    get stxx() { return this.chartStore.stxx; }
    get context() { return this.chartStore.context; }
    get chartTypeStore() { return this.mainStore.chartType; }
    get timeperiodStore() { return this.mainStore.timeperiod; }
    get loader() { return this.mainStore.loader; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        this.chartStore = mainStore.chart;
        when(() => this.context, this.onContextReady);
    }

    @action.bound onContextReady = () => {
        this.stxx.addEventListener('layout', this.saveLayout.bind(this));
        this.stxx.addEventListener('symbolChange', this.saveLayout.bind(this));
        this.stxx.addEventListener('drawing', this.saveDrawings.bind(this));
        this.stxx.addEventListener('move', this.scrollListener.bind(this));

        this.rootNode = this.mainStore.chart.rootNode;
        this.granularity = this.chartStore.granularity;
        this.stxx.maxMasterDataSize = this.chartStore.getMaxMasterDataSize(this.granularity);
    };

    @action.bound updateProps({
        chartControlsWidgets,
        chartStatusListener,
        chartType,
        clearChart,
        endEpoch,
        id,
        isAnimationEnabled = true,
        isConnectionOpened,
        isStaticChart,
        granularity,
        margin = 0,
        onExportLayout,
        refreshActiveSymbols,
        removeAllComparisons,
        scrollToEpoch,
        settings,
        shouldFetchTradingTimes = true,
        showLastDigitStats = false,
        startEpoch,
        symbol,
        crosshairState,
        zoom,
        maxTick,
    }) {
        let isSymbolChanged = false;
        let isGranularityChanged = false;

        this.chartId = id;
        this.chartStatusListener = chartStatusListener;
        this.isAnimationEnabled = isAnimationEnabled;
        this.isConnectionOpened = isConnectionOpened;
        this.isStaticChart = isStaticChart;
        this.margin = margin;
        this.settings = settings;
        this.shouldFetchTradingTimes = shouldFetchTradingTimes;
        this.showLastDigitStats = showLastDigitStats;

        if (chartControlsWidgets !== this.chartControlsWidgets) {
            this.chartControlsWidgets = chartControlsWidgets;
            if (this.stxx) this.mainStore.chart.updateHeight();
        }

        if (symbol !== this.symbol) {
            this.symbol = symbol;
            isSymbolChanged = true;

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

        if (this.chartStore.activeSymbols && (refreshActiveSymbols !== this.refreshActiveSymbols)) {
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
            }
        }

        if (removeAllComparisons) {
            this.comparisonStore.removeAll();
        }

        if (crosshairState !== null && crosshairState !== this.crosshairState) {
            this.mainStore.crosshair.setCrosshairState(crosshairState);
            this.crosshairState = crosshairState;
        }

        if (zoom) {
            if (zoom === 1) {
                this.mainStore.chartSize.zoomIn();
            } else {
                this.mainStore.chartSize.zoomOut();
            }
        }

        this.mainStore.chartSetting.setSettings(this.settings);

        if (maxTick && this.stxx) {
            this.maxTick = maxTick;
            this.setMaxtTick();
        }

        if (this.stxx) {
            this.stxx.chart.panel.yAxis.drawCurrentPriceLabel = !this.endEpoch;
            this.stxx.preferences.currentPriceLine = !this.endEpoch;
            this.stxx.isAutoScale = this.settings && this.settings.isAutoScale !== false;
            this.stxx.draw();
        }
    }

    @action.bound setMaxtTick() {
        if (this.maxTick && this.stxx && this.stxx.chart.dataSet) {
            const dataSetLength = this.stxx.chart.dataSet.length;
            let tickIndex = dataSetLength - this.maxTick;
            if (tickIndex < 0) tickIndex = dataSetLength;

            const expectTime = this.stxx.chart.dataSet[tickIndex];
            if (expectTime) {
                this.stxx.chart.entryTick = this.stxx.tickFromDate(expectTime.DT);

                this.stxx.chart.lockScroll = true;
                const scrollToTarget = this.stxx.chart.dataSet.length - this.stxx.chart.entryTick;

                this.stxx.setMaxTicks(scrollToTarget);
                this.stxx.chart.scroll = scrollToTarget;

                this.stxx.draw();
                this.setIsChartScrollingToEpoch(false);

                this.stxx.chart.lockScroll = false;
                this.mainStore.state.setIsChartScrollingToEpoch(true);
            }
        }
    }

    @action.bound setIsChartScrollingToEpoch(isScrollingToEpoch) {
        this.isChartScrollingToEpoch = isScrollingToEpoch;
    }

    @action.bound hasReachedEndOfData(hasReachedEndOfData) {
        this.hasReachedEndOfData = hasReachedEndOfData;
    }

    @action.bound setChartClosed(isClosed) {
        this.isChartClosed = isClosed;
    }

    setChartTheme(theme, isChartClosed = this.isChartClosed) {
        this.stxx.clearStyles();
        this.stxx.setStyle('stx_grid', 'color', Theme[`${theme}_chart_grid`]);
        this.stxx.setStyle('stx_yaxis', 'color', Theme[`${theme}_chart_text`]);
        this.stxx.setStyle('stx_xaxis', 'color', Theme[`${theme}_chart_text`]);
        this.stxx.setStyle('stx_xaxis_dark', 'color', Theme[`${theme}_chart_text`]);
        if (!this.rootNode) {
            this.rootNode = this.mainStore.chart.rootNode;
        }
        this.rootNode.querySelector('.chartContainer').style.backgroundColor = Theme[`${theme}_chart_bg`];
        // change chart colors to grey if the current market is closed and it is not a static chart
        if (isChartClosed && !this.isStaticChart) {
            const closedChartColor = 'rgba(129, 133, 152, 0.35)';
            this.stxx.setStyle('stx_mountain_chart', 'borderTopColor', closedChartColor);
            this.stxx.setStyle('stx_mountain_chart', 'backgroundColor', Theme[`${theme}_chart_mountain_bg`]);
            this.stxx.setStyle('stx_mountain_chart', 'color', Theme[`${theme}_chart_mountain_bg_shade`]);

            // line chart
            this.stxx.setStyle('stx_line_chart', 'color', closedChartColor);
            this.stxx.setStyle('stx_line_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_line_down', 'color', closedChartColor);
            this.stxx.setStyle('stx_line_even', 'color', closedChartColor);
            // bar chart
            this.stxx.setStyle('stx_bar_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_bar_down', 'color', closedChartColor);
            this.stxx.setStyle('stx_bar_even', 'color', closedChartColor);
            // candle chart
            this.stxx.setStyle('stx_candle_up', 'color', Theme[`${theme}_chart_closed_candle`]);
            this.stxx.setStyle('stx_candle_down', 'color', Theme[`${theme}_chart_closed_candle`]);
            this.stxx.setStyle('stx_candle_even', 'color', Theme[`${theme}_chart_closed_candle`]);
            // candle wick
            this.stxx.setStyle('stx_candle_shadow_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_candle_shadow_down', 'color', closedChartColor);
            this.stxx.setStyle('stx_candle_shadow_even', 'color', closedChartColor);
            // hollow candle
            this.stxx.setStyle('stx_hollow_candle_up', 'color', Theme[`${theme}_chart_closed_candle`]);
            this.stxx.setStyle('stx_hollow_candle_down', 'color', Theme[`${theme}_chart_closed_candle`]);
            this.stxx.setStyle('stx_hollow_candle_even', 'color', Theme[`${theme}_chart_closed_candle`]);
            // baseline chart
            this.stxx.setStyle('stx_baseline_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_baseline_down', 'color', closedChartColor);
            this.stxx.setStyle('stx_baseline_even', 'color', closedChartColor);
            // kagi
            this.stxx.setStyle('stx_kagi_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_kagi_down', 'color', closedChartColor);
            // this.stxx.setStyle('stx_kagi_even', 'color', closedChartColor);
            // pandf
            this.stxx.setStyle('stx_pandf_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_pandf_down', 'color', closedChartColor);
            // current price text color
            this.stxx.setStyle('stx_current_hr_down', 'color', Theme[`${theme}_candle_text_closed`]);
            this.stxx.setStyle('stx_current_hr_up', 'color', Theme[`${theme}_candle_text_closed`]);
            // current price bg color
            this.stxx.setStyle('stx_current_hr_down', 'background-color', Theme[`${theme}_candle_bg_closed`]);
            this.stxx.setStyle('stx_current_hr_up', 'background-color', Theme[`${theme}_candle_bg_closed`]);
        } else {
            this.stxx.setStyle('stx_mountain_chart', 'borderTopColor', Theme[`${theme}_chart_mountain_border`]);
            this.stxx.setStyle('stx_mountain_chart', 'backgroundColor', Theme[`${theme}_chart_mountain_bg`]);
            this.stxx.setStyle('stx_mountain_chart', 'color', Theme[`${theme}_chart_mountain_bg_shade`]);

            this.stxx.setStyle('stx_line_chart', 'color', Theme[`${theme}_chart_mountain_border`]);
        }
        this.stxx.draw();
    }

    @action.bound setChartIsReady(isChartReady) {
        if (this.isChartReady !== isChartReady) {
            this.isChartReady = isChartReady;
            if (this.chartStatusListener && typeof this.chartStatusListener === 'function') {
                this.chartStatusListener(isChartReady);
            }
        }
    }

    @action.bound setChartGranularity(granularity) {
        const isTimeUnitSecond = calculateTimeUnitInterval(granularity).timeUnit === 'second';
        const isChartTypeCandle = this.mainStore.chartType.isCandle
            || (this.chartType && this.mainStore.chartType.isTypeCandle(this.chartType));

        if (this.context && isTimeUnitSecond && isChartTypeCandle) {
            this.setChartType('mountain'); // if granularity is zero, set the chartType to 'mountain'
        }
        this.granularity = granularity === null ? undefined : granularity;
    }

    @action.bound setChartType(chartType) {
        this.chartType = chartType;
        if (this.chartTypeStore.onChartTypeChanged) {
            this.chartTypeStore.onChartTypeChanged(chartType);
        }
    }

    @action.bound setShouldMinimiseLastDigit(status) {
        this.shouldMinimiseLastDigits = status;
    }

    saveLayout() {
        if (!this.chartId) return;
        const layoutData = this.stxx.exportLayout(true);
        const json = JSON.stringify(layoutData);
        CIQ.localStorageSetItem(`layout-${this.chartId}`, json);
    }

    // returns false if restoring layout fails
    restoreLayout() {
        let layoutData = createObjectFromLocalStorage(`layout-${this.chartId}`);

        if (!layoutData || !layoutData.symbols.length) return false;

        // prop values will always take precedence
        if (this.symbol !== undefined && this.symbol !== layoutData.symbols[0].symbol) {
            // symbol prop takes precedence over local storage data
            const symbolObject = this.chartStore.activeSymbols.getSymbolObj(this.symbol);
            layoutData.symbols = [{ symbol: this.symbol, symbolObject }];
        }

        for (const symbolDat of layoutData.symbols) {
            // Symbol from cache may be in different language, so replace it with server's
            const { symbol: cachedSymbol } = symbolDat;
            const updatedSymbol = this.chartStore.activeSymbols.getSymbolObj(cachedSymbol);
            symbolDat.symbolObject = updatedSymbol;
            if (symbolDat.parameters) {
                symbolDat.parameters.display = updatedSymbol.name;

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

        this.stxx.importLayout(layoutData, {
            managePeriodicity: true,
            cb: () => {
                if (layoutData.tension) {
                    this.stxx.chart.tension = layoutData.tension;
                }
                this.restoreDrawings();
                if (this.chartStore.loader) {
                    this.chartStore.loader.hide();
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
        if (!this.chartId) return;
        const obj = this.stxx.exportDrawings();
        const symbol = this.stxx.chart.symbol;
        if (obj.length === 0) {
            CIQ.localStorage.removeItem(`${symbol}-${this.chartId}`);
        } else {
            CIQ.localStorageSetItem(`${symbol}-${this.chartId}`, JSON.stringify(obj));
        }
    }

    restoreDrawings() {
        if (this.stxx && this.stxx.chart) {
            const drawings = createObjectFromLocalStorage(`${this.stxx.chart.symbol}-${this.chartId}`);
            if (drawings) {
                this.stxx.importDrawings(drawings);
                this.stxx.draw();
            }
        }
    }

    scrollChartToLeft = (leftTick, force) => {
        const scrollToEpoch = this.scrollToEpoch || (leftTick && getUTCEpoch(leftTick.DT));
        this.stxx.chart.entryTick = null;

        if (this.scrollToEpoch && !this.startEpoch && !force) {
            const startEntry = this.stxx.chart.dataSet
                .find(entry =>  entry.DT.valueOf() === CIQ.strToDateTime(getUTCDate(scrollToEpoch)).valueOf());

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
        } else if (scrollToEpoch && this.startEpoch || force) {
            this.stxx.chart.lockScroll = true;
            this.stxx.chart.entryTick = this.stxx.tickFromDate(getUTCDate(this.startEpoch || scrollToEpoch));
            const scrollToTarget = this.stxx.chart.dataSet.length - this.stxx.chart.entryTick;

            if (!this.endEpoch) {
                this.stxx.setMaxTicks(scrollToTarget + 3);
                this.stxx.chart.scroll = scrollToTarget + 1;
            } else {
                this.stxx.setMaxTicks(scrollToTarget + (Math.floor(scrollToTarget / 5) || 2));
                this.stxx.chart.scroll = scrollToTarget + (Math.floor(scrollToTarget / 10) || 1);
            }
            this.stxx.draw();
            this.setIsChartScrollingToEpoch(false);
        } else {
            this.stxx.chart.entryTick = null;
            this.stxx.chart.lockScroll = false;
            this.stxx.home();
            this.stxx.draw();
            this.setIsChartScrollingToEpoch(false);
        }
        this.mainStore.chart.feed.offMasterDataReinitialize(this.scrollChartToLeft);
        this.mainStore.chart.feed.offMasterDataUpdate(this.scrollChartToLeft);
    }

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
        this.mainStore.crosshair.onChange(2);
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

    scrollListener({ grab }) {
        if (grab && this.stxx.chart.lockScroll) {
            this.stxx.chart.lockScroll = false;
        }
        if (this.stxx && this.stxx.chart && !this.stxx.chart.lockScroll) {
            const dataSegment = this.stxx.chart.dataSegment;
            const whiteSpace = this.chartStore.isMobile ? 50 : 150;
            if (this.stxx.masterData.length < this.stxx.chart.maxTicks - whiteSpace) {
                this.stxx.minimumLeftBars = this.stxx.chart.maxTicks - whiteSpace;
            } else if (dataSegment) {
                const hasReachedRight = this.stxx.chart.scroll <= this.stxx.chart.maxTicks - 1;
                const noMoreScroll = this.hasReachedEndOfData || (this.stxx.masterData.length === this.stxx.maxMasterDataSize);
                let defaultMinimumBars = this.mainStore.chart.defaultMinimumBars;
                if (this.stxx.chart.maxTicks - 10 > 50) {
                    defaultMinimumBars = 50;
                }
                this.stxx.minimumLeftBars = noMoreScroll && !hasReachedRight ? this.stxx.chart.maxTicks : Math.min(this.stxx.chart.maxTicks, defaultMinimumBars);
            }
        }
    }
}

export default ChartState;
