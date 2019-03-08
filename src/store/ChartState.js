/* eslint-disable no-new */
import { action, observable, when } from 'mobx';
import { createObjectFromLocalStorage, calculateTimeUnitInterval, calculateGranularity, getUTCDate } from '../utils';

class ChartState {
    @observable granularity;
    @observable chartType;
    @observable startEpoch;
    @observable endEpoch;
    @observable symbol;
    @observable isConnectionOpened;
    @observable settings;
    @observable showLastDigitStats;
    @observable scrollToEpoch;
    @observable onExportLayout;
    @observable clearChart;
    @observable importedLayout;
    @observable isOnPagination = false;
    @observable paginationEndEpoch;

    get comparisonStore() { return this.mainStore.comparison; }
    get stxx() { return this.chartStore.stxx; }
    get context() { return this.chartStore.context; }
    get chartTypeStore() { return this.mainStore.chartType; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        this.chartStore = mainStore.chart;
        when(() => this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stxx.addEventListener('layout', this.saveLayout.bind(this));
        this.stxx.addEventListener('symbolChange', this.saveLayout.bind(this));
        this.stxx.addEventListener('drawing', this.saveDrawings.bind(this));

        this.chartStore.feed.onStartPagination(this.setOnPagination.bind(this));
        this.chartStore.feed.onPagination(this.setOnPagination.bind(this));
    };

    @action.bound updateProps({ id, settings, isConnectionOpened, symbol, granularity, chartType, startEpoch, endEpoch, onExportLayout, clearChart, importedLayout, removeAllComparisons, isAnimationEnabled = true, showLastDigitStats = false, scrollToEpoch, scrollToEpochOffset = 0, zoom }) {
        this.chartId = id;
        this.settings = settings;
        this.isConnectionOpened = isConnectionOpened;
        this.symbol = symbol;
        this.startEpoch = startEpoch;
        this.endEpoch = endEpoch;
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

        if (this.stxx) {
            this.stxx.drawPriceLabels = !!this.endEpoch;
            this.stxx.isAutoScale = this.settings ? this.settings.isAutoScale : false;
        }
        if (this.granularity !== granularity && this.context) {
            this.granularity = granularity;
            this.chartStore.changeSymbol(undefined, granularity);
        }
        if (this.chartType !== chartType && this.context) {
            this.chartType = chartType;
            this.chartTypeStore.setType(chartType);
        }
        if (removeAllComparisons) {
            this.comparisonStore.removeAll();
        }

        if (this.scrollToEpoch !== scrollToEpoch && this.context) {
            this.scrollToEpoch = scrollToEpoch;
            this.scrollChartToLeft();
        }

        if (this.zoom !== zoom) {
            this.zoom = +zoom;
            if (this.context && this.stxx && this.zoom) {
                if (this.zoom >= 0) {
                    this.stxx.zoomIn(null, (Math.abs(100 - this.zoom) || 0.01) / 100);
                } else {
                    this.stxx.zoomOut(null, (100 + Math.abs(this.zoom)) / 100);
                }
            }
        }
    }

    @action.bound setOnPagination({ end }) {
        this.isOnPagination     = !this.isOnPagination;
        this.paginationEndEpoch = this.isOnPagination ? end : null;
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
            const { timeUnit, interval } = layoutData;
            if (timeUnit) {
                this.chartStore.granularity = calculateGranularity(interval, timeUnit);
            } else {
                this.chartStore.granularity = 86400; // 1 day
            }
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

    scrollChartToLeft() {
        if (this.scrollToEpoch) {
            const startEntry = this.stxx.getDataSegment()
                .reverse()
                .find(entry =>  entry.DT <= new Date(getUTCDate(this.scrollToEpoch)));
            this.stxx.setStartDate(startEntry.DT);
            if (this.scrollToEpochOffset) {
                this.stxx.chart.scroll += this.scrollToEpochOffset - this.stxx.chart.scroll;
            }
            this.stxx.chart.lockScroll = true;
            this.stxx.allowScroll = false;
            this.stxx.draw();
        } else {
            this.stxx.chart.lockScroll = false;
            this.stxx.allowScroll = true;
            this.stxx.home();
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
        this.mainStore.crosshair.setCrosshairState(0);

        // TODO: use constant
        this.mainStore.chart.changeSymbol(this.stxx.chart.symbol, 0);
        this.mainStore.chartType.setType({ id:'linear' });
    }

    importLayout() {
        if (!this.importedLayout || !Object.keys(this.importedLayout).length) return;
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

                setTimeout(() => {
                    if (this.importedLayout && this.importedLayout.drawings) {
                        this.stxx.importDrawings(this.importedLayout.drawings);
                        this.stxx.draw();
                    }
                }, 500);

                this.stxx.changeOccurred('layout');
                this.mainStore.studies.updateActiveStudies();
            },
        });

        this.mainStore.crosshair.setCrosshairState(this.importedLayout.crosshair);
    }

    exportLayout() {
        if (!this.onExportLayout) return;
        const currentLayout = this.stxx.exportLayout();
        currentLayout.drawings = this.stxx.exportDrawings();
        currentLayout.series = [];
        for (const field in this.stxx.chart.series) {
            currentLayout.series.push(field);
        }

        this.onExportLayout(currentLayout);
    }
}

export default ChartState;
