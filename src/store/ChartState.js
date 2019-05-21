/* eslint-disable no-new */
import { action, observable, when } from 'mobx';
import { createObjectFromLocalStorage, calculateTimeUnitInterval, calculateGranularity, getUTCDate } from '../utils';
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
    @observable importedLayout;
    @observable isOnPagination = false;
    @observable paginationEndEpoch;
    @observable isChartClosed = false;
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

        this.granularity = this.chartStore.granularity;
    };

    @action.bound updateProps({ id, settings, isConnectionOpened, chartStatusListener, symbol, granularity, chartType, isStaticChart, startEpoch, endEpoch, onExportLayout, clearChart, importedLayout, removeAllComparisons, isAnimationEnabled = true, showLastDigitStats = false, scrollToEpoch, scrollToEpochOffset = 0, zoom, chartControlsWidgets }) {
        let isGranularityChanged = false;
        let isSymbolChanged = false;
        this.chartId = id;
        this.settings = settings;
        this.isConnectionOpened = isConnectionOpened;
        this.chartStatusListener = chartStatusListener;

        if (this.symbol !== symbol) {
            this.symbol = symbol;
            isSymbolChanged = true;
        }

        this.rootNode = this.mainStore.chart.rootNode;

        this.isAnimationEnabled = isAnimationEnabled;
        this.showLastDigitStats = showLastDigitStats;
        this.scrollToEpochOffset = scrollToEpochOffset;

        if (onExportLayout !== this.onExportLayout) {
            this.onExportLayout = onExportLayout;
            this.exportLayout();
        }

        if (clearChart !== this.clearChart) {
            this.clearChart = clearChart;
            this.cleanChart();
        }

        if (JSON.stringify(importedLayout) !== JSON.stringify(this.importedLayout)) {
            this.importedLayout = importedLayout;
            this.importLayout();
        }

        if (granularity !== undefined && this.granularity !== granularity && this.context) {
            if (calculateTimeUnitInterval(granularity).timeUnit === 'second' && (this.mainStore.chartType.isCandle || (chartType && this.mainStore.chartType.isTypeCandle(chartType)))) {
                chartType = 'mountain';

                if (this.chartTypeStore.onChartTypeChanged) {
                    this.chartTypeStore.onChartTypeChanged(chartType);
                }
            }

            isGranularityChanged = true;
            this.granularity = granularity === null ? undefined : granularity;
        }
        if (this.chartType !== chartType && this.context) {
            this.chartType = chartType;
            this.chartTypeStore.setType(chartType);
        }

        if (this.startEpoch !== startEpoch || this.endEpoch !== endEpoch) {
            this.startEpoch = startEpoch;
            this.endEpoch = endEpoch;
            if (isStaticChart && this.stxx && this.granularity === this.mainStore.chart.granularity) {
                // Reload the chart if it is a static chart and the granularity hasn't changed
                this.mainStore.chart.newChart();
            } else if (this.mainStore.chart.feed) {
                /* When layout is importing and range is changing as the same time we dont need to set the range,
                   the imported layout witll take care of it. */
                if (!this.importedLayout && !isGranularityChanged && !this.scrollToEpoch) {
                    this.mainStore.chart.feed.onRangeChanged(true);
                }
            }
        }

        if (removeAllComparisons) {
            this.comparisonStore.removeAll();
        }

        if (this.scrollToEpoch !== scrollToEpoch && this.context) {
            this.scrollToEpoch = scrollToEpoch;
            if (isSymbolChanged || isGranularityChanged) {
                this.mainStore.chart.feed.onMasterDataUpdate(this.scrollChartToLeft);
            } else {
                this.scrollChartToLeft();
            }
        }

        if (this.zoom !== zoom) {
            this.zoom = +zoom;
            if (this.context && this.stxx && this.zoom) {
                if (this.zoom >= 0) {
                    // this.stxx.zoomIn(null, (Math.abs(100 - this.zoom) || 0.01) / 100);
                } else {
                    // this.stxx.zoomOut(null, (100 + Math.abs(this.zoom)) / 100);
                }
            }
        }

        if (chartControlsWidgets !== this.chartControlsWidgets) {
            this.chartControlsWidgets = chartControlsWidgets;
            if (this.stxx) this.mainStore.chart.updateHeight();
        }

        if (this.stxx) {
            this.stxx.chart.panel.yAxis.drawCurrentPriceLabel = !this.endEpoch;
            this.stxx.preferences.currentPriceLine = !this.endEpoch;
            this.stxx.isAutoScale = this.settings && settings.isAutoScale !== false;
        }
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

    saveLayout() {
        if (!this.chartId) return;
        const layoutData = this.stxx.exportLayout(true);
        const json = JSON.stringify(layoutData);
        CIQ.localStorageSetItem(`layout-${this.chartId}`, json);
    }

    // returns false if restoring layout fails
    restoreLayout() {
        let layoutData = createObjectFromLocalStorage(`layout-${this.chartId}`);

        if (!layoutData) return false;

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
        this.mainStore.chart.feed.offMasterDataUpdate(this.scrollChartToLeft);
        if (this.scrollToEpoch && !this.startEpoch) {
            let startEntry = this.stxx.chart.dataSet
                .find(entry =>  entry.DT.valueOf() === new Date(getUTCDate(this.scrollToEpoch)).valueOf());

            if (!startEntry) {
                startEntry = {
                    DT: new Date(getUTCDate(this.scrollToEpoch)),
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
            this.stxx.chart.lockScroll = true;
            const tick = this.stxx.tickFromDate(startEntry.DT);
            this.stxx.setMaxTicks(5);
            this.stxx.chart.scroll = this.stxx.chart.dataSet.length - tick + 1;
            this.stxx.chart.entryTick = tick;
            this.stxx.maxMasterDataSize = 0;
            this.stxx.draw();
        } else if (this.startEpoch) {
            this.stxx.chart.lockScroll = true;
        } else {
            this.stxx.chart.lockScroll = false;
            this.stxx.home();
            this.stxx.draw();
        }
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
    }
}

export default ChartState;
