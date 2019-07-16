/* eslint-disable no-new */
import { action, observable, when } from 'mobx';
import { createObjectFromLocalStorage, calculateTimeUnitInterval, calculateGranularity, getUTCDate } from '../utils';
import Theme from '../../sass/_themes.scss';

class ChartState {
    @observable granularity;
    @observable chartType;
    @observable startEpoch;
    @observable startEpochMargin;
    @observable endEpoch;
    @observable endEpochMargin;
    @observable symbol;
    @observable isConnectionOpened;
    @observable isChartReady = false;
    @observable chartStatusListener;
    @observable settings;
    @observable showLastDigitStats;
    @observable scrollToEpoch;
    @observable onExportLayout;
    @observable clearChart;
    @observable importedLayout;
    @observable isOnPagination = false;
    @observable paginationEndEpoch;
    @observable isChartClosed = false;
    @observable shouldMinimiseLastDigits = false;
    @observable isStaticChart = false;
    @observable shouldFetchTradingTimes = true;
    @observable refreshActiveSymbols;
    @observable hasReachedEndOfData = false;

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

        this.chartStore.feed.onStartPagination(this.setOnPagination.bind(this));
        this.chartStore.feed.onPagination(this.setOnPagination.bind(this));

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
        importedLayout,
        isAnimationEnabled = true,
        isConnectionOpened,
        isStaticChart,
        granularity,
        margin = 0,
        onExportLayout,
        refreshActiveSymbols,
        removeAllComparisons,
        scrollToEpoch,
        scrollToEpochOffset = 0,
        settings,
        shouldFetchTradingTimes = true,
        showLastDigitStats = false,
        startEpoch,
        symbol,
        zoom,
    }) {
        this.chartId = id;
        this.chartStatusListener = chartStatusListener;
        this.endEpoch = endEpoch;
        this.isAnimationEnabled = isAnimationEnabled;
        this.isConnectionOpened = isConnectionOpened;
        this.isStaticChart = isStaticChart;
        this.margin = margin;
        this.scrollToEpochOffset = scrollToEpochOffset;
        this.settings = settings;
        this.shouldFetchTradingTimes = shouldFetchTradingTimes;
        this.showLastDigitStats = showLastDigitStats;
        this.startEpoch = startEpoch;

        if (chartControlsWidgets !== this.chartControlsWidgets) {
            this.chartControlsWidgets = chartControlsWidgets;
            if (this.stxx) this.mainStore.chart.updateHeight();
        }

        if (symbol !== this.symbol) {
            this.symbol = symbol;
            if (this.mainStore.chart && this.mainStore.chart.feed) {
                this.mainStore.chart.feed.onMasterDataUpdate(this.scrollChartToLeft);
            }
        }

        if (chartType !== this.chartType && this.context) {
            this.setChartType(chartType);
        } else if (granularity !== undefined && granularity !== this.granularity) {
            this.setChartGranularity(granularity);
        }

        if (this.chartStore.activeSymbols && (refreshActiveSymbols !== this.refreshActiveSymbols)) {
            this.refreshActiveSymbols = refreshActiveSymbols;
            this.chartStore.activeSymbols.retrieveActiveSymbols(this.refreshActiveSymbols);
        }

        if (!isStaticChart && scrollToEpoch && scrollToEpoch !== this.scrollToEpoch) {
            this.scrollToEpoch = scrollToEpoch;
            if (this.mainStore.chart && this.mainStore.chart.feed) {
                this.mainStore.chart.feed.onMasterDataUpdate(this.scrollChartToLeft);
            }
        }

        if (clearChart !== this.clearChart) {
            this.clearChart = clearChart;
            this.cleanChart();
        }

        if (importedLayout && JSON.stringify(importedLayout) !== JSON.stringify(this.importedLayout)) {
            this.importedLayout = importedLayout;
            this.importLayout();
        }

        if (onExportLayout !== this.onExportLayout) {
            this.onExportLayout = onExportLayout;
            this.exportLayout();
        }

        if (removeAllComparisons) {
            this.comparisonStore.removeAll();
        }

        if (zoom !== this.zoom) {
            this.zoom = +zoom;
            if (this.context && this.stxx && this.zoom) {
                if (this.zoom >= 0) {
                    // this.stxx.zoomIn(null, (Math.abs(100 - this.zoom) || 0.01) / 100);
                } else {
                    // this.stxx.zoomOut(null, (100 + Math.abs(this.zoom)) / 100);
                }
            }
        }

        if (this.stxx) {
            this.stxx.chart.panel.yAxis.drawCurrentPriceLabel = !this.endEpoch;
            this.stxx.preferences.currentPriceLine = !this.endEpoch;
            this.stxx.isAutoScale = this.settings && this.settings.isAutoScale !== false;
            this.stxx.draw();
        }
    }

    @action.bound hasReachedEndOfData(hasReachedEndOfData) {
        this.hasReachedEndOfData = hasReachedEndOfData;
    }

    @action.bound setChartClosed(isClosed) {
        this.isChartClosed = isClosed;
    }

    @action.bound setChartTheme(theme, isChartClosed = this.isChartClosed) {
        this.stxx.clearStyles();
        this.stxx.setStyle('stx_grid', 'color', Theme[`${theme}chartgrid`]);
        if (!this.rootNode) return;
        this.rootNode.querySelector('.chartContainer').style.backgroundColor = Theme[`${theme}chartbg`];
        if (isChartClosed) {
            const closedChartColor = 'rgba(129, 133, 152, 0.35)';
            this.stxx.setStyle('stx_mountain_chart', 'borderTopColor', closedChartColor);
            this.stxx.setStyle('stx_mountain_chart', 'background-color', 'transparent');
            this.stxx.setStyle('stx_mountain_chart', 'color', 'transparent');
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
            this.stxx.setStyle('stx_candle_up', 'color', Theme[`${theme}chartclosedcandle`]);
            this.stxx.setStyle('stx_candle_down', 'color', Theme[`${theme}chartclosedcandle`]);
            this.stxx.setStyle('stx_candle_even', 'color', Theme[`${theme}chartclosedcandle`]);
            // candle wick
            this.stxx.setStyle('stx_candle_shadow_up', 'color', closedChartColor);
            this.stxx.setStyle('stx_candle_shadow_down', 'color', closedChartColor);
            this.stxx.setStyle('stx_candle_shadow_even', 'color', closedChartColor);
            // hollow candle
            this.stxx.setStyle('stx_hollow_candle_up', 'color', Theme[`${theme}chartclosedcandle`]);
            this.stxx.setStyle('stx_hollow_candle_down', 'color', Theme[`${theme}chartclosedcandle`]);
            this.stxx.setStyle('stx_hollow_candle_even', 'color', Theme[`${theme}chartclosedcandle`]);
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
            this.stxx.setStyle('stx_current_hr_down', 'color', Theme[`${theme}candletextclosed`]);
            this.stxx.setStyle('stx_current_hr_up', 'color', Theme[`${theme}candletextclosed`]);
            // current price bg color
            this.stxx.setStyle('stx_current_hr_down', 'background-color', Theme[`${theme}candlebgclosed`]);
            this.stxx.setStyle('stx_current_hr_up', 'background-color', Theme[`${theme}candlebgclosed`]);
        } else {
            this.stxx.setStyle('stx_mountain_chart', 'borderTopColor', Theme[`${theme}chartmountainborder`]);
            this.stxx.setStyle('stx_line_chart', 'color', Theme[`${theme}chartmountainborder`]);
        }
        this.stxx.draw();
    }

    @action.bound setOnPagination({ end }) {
        this.isOnPagination     = !this.isOnPagination;
        this.paginationEndEpoch = this.isOnPagination ? end : null;
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
                this.restoreDrawings(this.stxx, this.stxx.chart.symbol);
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
        const drawings = createObjectFromLocalStorage(`${this.stxx.chart.symbol}-${this.chartId}`);
        if (drawings) {
            this.stxx.importDrawings(drawings);
            this.stxx.draw();
        }
    }

    scrollChartToLeft = () => {
        this.stxx.chart.entryTick = null;
        if (this.scrollToEpoch && !this.startEpoch) {
            let startEntry = this.stxx.chart.dataSet
                .find(entry =>  entry.DT.valueOf() === CIQ.strToDateTime(getUTCDate(this.scrollToEpoch)).valueOf());

            if (!startEntry) {
                startEntry = {
                    DT: CIQ.strToDateTime(getUTCDate(this.scrollToEpoch)),
                    Close: null,
                };

                /**
                 * Adding an invisible bar if the bar
                 * does not exist on the masterData
                 */
                this.stxx.updateChartData(
                    startEntry,
                    null,
                    { fillGaps: true },
                );
                this.stxx.createDataSet();
            }
            this.stxx.maxMasterDataSize = 0;
            const scrollAnimator = new CIQ.EaseMachine(Math.easeOutCubic, 1000);
            const scrollToTarget = this.stxx.chart.dataSegment.length;
            scrollAnimator.run((bar) => {
                bar = Math.ceil(bar); // round-up for precision
                const scroll = this.stxx.chart.dataSegment.length - bar;
                if (scroll <= 2 || bar === scrollToTarget) {
                    /**
                     * Stop scrolling and draw markers if
                     * the scroll value is off-screen or if the animator has reached target.
                     * We check scroll <= '2' because sometimes the chart is scrolled so that the first
                     * bar is partially hidden off-screen
                     */
                    scrollAnimator.stop();
                    this.stxx.chart.entryTick = this.stxx.tickFromDate(startEntry.DT);
                    this.stxx.chart.lockScroll = true;
                    this.stxx.chart.isScrollLocationChanged = true; // set to true to draw markers
                } else {
                    this.stxx.chart.scroll = scroll;
                }
            },
            0, scrollToTarget);
            this.stxx.draw();
        } else if (this.startEpoch) {
            this.stxx.chart.lockScroll = true;
            this.stxx.chart.isScrollLocationChanged = true;
        } else {
            this.stxx.chart.lockScroll = false;
            this.stxx.chart.isScrollLocationChanged = false;
            this.stxx.home();
            this.stxx.draw();
        }
        this.mainStore.chart.feed.offMasterDataUpdate(this.scrollChartToLeft);
    }

    cleanChart() {
        if (!this.clearChart) return;
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
        this.mainStore.crosshair.setCrosshairState(2);
    }

    importLayout() {
        if (!this.stxx || !this.importedLayout || !Object.keys(this.importedLayout).length) return;

        this.loader.show();
        this.loader.setState('chart-data');

        /* Clear current chart interval to make sure importedlayout works as expected
        if it has same interval with previous state of chart but there is no stream for it */
        if (Object.keys(this.mainStore.chart.feed._activeStreams).length === 0) {
            this.stxx.layout.interval = undefined;
        }

        // Clear start and end epoch before importing that layout
        this.startEpoch = this.endEpoch = null;

        this.stxx.importLayout(this.importedLayout, {
            managePeriodicity: true,
            preserveTicksAndCandleWidth: true,
            cb: () => {
                if (this.importedLayout && this.importedLayout.series) {
                    this.importedLayout.series.forEach((symbol) => {
                        const symbolObject = this.chartStore.activeSymbols.getSymbolObj(symbol);
                        this.mainStore.comparison.onSelectItem(symbolObject);
                    });
                }

                const { timeUnit, interval, periodicity } = this.importedLayout;
                const period = timeUnit ? interval : periodicity;
                const granularity = calculateGranularity(period, timeUnit || interval);
                this.chartStore.granularity = granularity;
                if (this.timeperiodStore.onGranularityChange) {
                    this.timeperiodStore.onGranularityChange(granularity);
                }

                if (this.chartTypeStore.onChartTypeChanged) {
                    const chartType = this.chartTypeStore.getChartTypeFromLayout(this.importedLayout);
                    this.chartTypeStore.setChartTypeFromLayout(this.importedLayout);
                    this.chartTypeStore.onChartTypeChanged(chartType);
                }

                this.stxx.changeOccurred('layout');
                this.mainStore.studies.updateActiveStudies();

                setTimeout(() => {
                    if (this.importedLayout && this.importedLayout.drawings) {
                        this.stxx.importDrawings(this.importedLayout.drawings);
                        this.stxx.draw();
                    }

                    if (this.importedLayout && this.importedLayout.isDone) {
                        if (this.importedLayout.previousMaxTicks) {
                            this.stxx.setMaxTicks(this.importedLayout.previousMaxTicks);
                            this.stxx.home();
                            delete this.importLayout.previousMaxTicks;
                        }

                        // Run the callback when layout import is done
                        this.importedLayout.isDone();

                        this.loader.hide();
                    }
                }, 500);
            },
        });

        this.mainStore.crosshair.setCrosshairState(this.importedLayout.crosshair);

        this.stxx.chart.lockScroll = false;
        this.stxx.chart.entryTick = undefined;
        this.stxx.maxMasterDataSize = 5000;
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
        if (this.stxx && this.stxx.chart) {
            const dataSegment = this.stxx.chart.dataSegment;
            const whiteSpace = this.chartStore.isMobile ? 50 : 150;
            if (this.stxx.masterData.length < this.stxx.chart.maxTicks - whiteSpace) {
                this.stxx.minimumLeftBars = this.stxx.chart.maxTicks - whiteSpace;
            } else if (dataSegment) {
                const hasReachedRight = this.stxx.chart.scroll <= this.stxx.chart.maxTicks - 1;
                const noMoreScroll = this.hasReachedEndOfData || (this.stxx.masterData.length === this.stxx.maxMasterDataSize);
                this.stxx.minimumLeftBars = noMoreScroll && !hasReachedRight ? this.stxx.chart.maxTicks : 2;
            }
        }
    }
}

export default ChartState;
