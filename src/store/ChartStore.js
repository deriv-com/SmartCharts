import ResizeObserver from 'resize-observer-polyfill';
import { action, observable, reaction } from 'mobx';
import PendingPromise from '../utils/PendingPromise';
import Context from '../components/ui/Context';
import KeystrokeHub from '../components/ui/KeystrokeHub';
import '../components/ui/Animation';
import { BinaryAPI, Feed } from '../feed';
import { stableSort, calculateTimeUnitInterval, getUTCDate } from '../utils';

class ChartStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    RANGE_PADDING_PX = 125;
    contextPromise = new PendingPromise();
    activeSymbols = [];
    rootNode = null;
    stxx = null;
    api = null;
    defaults = {
        symbol: 'R_100',
        granularity: 0,
        chartType: 'mountain',
    };
    granularity;
    enableRouting = null;
    chartNode = null;
    chartControlsNode = null;
    holderStyle;
    state;
    onMessage = null;
    @observable containerWidth = null;
    @observable context = null;
    @observable currentActiveSymbol;
    @observable isChartAvailable = true;
    @observable comparisonSymbols = [];
    @observable categorizedSymbols = [];
    @observable chartHeight;
    @observable chartContainerHeight;
    @observable isMobile = false;

    @action.bound setActiveSymbols(activeSymbols) {
        this.activeSymbols = this.processSymbols(activeSymbols);
        this.categorizedSymbols = this.categorizeActiveSymbols();
    }

    get loader() { return this.mainStore.loader; }
    get routingStore() {
        return this.mainStore.routing;
    }

    updateHeight(position) {
        const panelPosition = position || this.mainStore.chartSetting.position;
        const offsetHeight = (panelPosition === 'left') ? 0 : this.chartControlsNode.offsetHeight;
        this.chartHeight = this.chartNode.offsetHeight;
        this.chartContainerHeight = this.chartHeight - offsetHeight;
    }

    notify(message) {
        if (this.onMessage) { this.onMessage(message); }
    }

    updateCanvas = () => {
        if (this.stxx.slider) {
            this.stxx.slider.display(this.stxx.layout.rangeSlider);
        }
        this.stxx.resizeChart();
    };

    @action.bound resizeScreen() {
        if (!this.context) { return; }


        if (this.modalNode.clientWidth > 1100) {
            this.containerWidth = 1100;
        } else if (this.modalNode.clientWidth > 900) {
            this.containerWidth = 900;
        } else {
            this.containerWidth = 480;
        }


        this.updateHeight();
        // Height updates are not immediate, so we must resize the canvas with
        // a slight delay for it to pick up the correct chartContainer height.
        // In mobile devices, a longer delay is given as DOM updates are slower.
        setTimeout(this.updateCanvas, this.isMobile ? 500 : 100);
    }

    @action.bound init(rootNode, modalNode, props) {
        this.rootNode = rootNode;
        this.modalNode = modalNode;
        this.chartNode = this.rootNode.querySelector('.ciq-chart-area');
        this.chartControlsNode = this.rootNode.querySelector('.cq-chart-controls');

        const {
            symbol,
            chartType,
            granularity,
            requestAPI,
            requestSubscribe,
            requestForget,
            isMobile,
            enableRouting,
            onMessage,
            settings,
            onSettingsChange,
        } = props;
        this.api = new BinaryAPI(requestAPI, requestSubscribe, requestForget);
        const { chartSetting } = this.mainStore;
        chartSetting.setSettings(settings);
        chartSetting.onSettingsChange = onSettingsChange;
        this.isMobile = isMobile;
        this.state = this.mainStore.state;

        this.onMessage = onMessage;
        this.granularity = (granularity !== undefined) ? granularity : this.defaults.granularity;
        const engineParams = {
            maxMasterDataSize: 5000, // cap size so tick_history requests do not become too large
            markerDelay: null, // disable 25ms delay for placement of markers
            container: this.rootNode.querySelector('.chartContainer.primary'),
            controls: { chartControls: null }, // hide the default zoom buttons
            preferences: {
                currentPriceLine: true,
                whitespace: isMobile ? 50 : 150,
            },
            chart: {
                yAxis: {
                    // Put some top margin so chart doesn't get blocked by chart title
                    initialMarginTop: 125,
                    initialMarginBottom: 10,
                    // position: 'left',
                },
            },
            minimumLeftBars: 2,
            yTolerance: 999999, // disable vertical scrolling
        };
        let chartLayout = {
            chartType: chartType || this.defaults.chartType,
        };
        if (chartLayout.chartType === 'spline') { // cause there's no such thing as spline chart in ChartIQ
            chartLayout.chartType = 'mountain';
            engineParams.chart.tension = chartLayout.tension = 0.5;
        }
        const rangeSpan = this.getRangeSpan();
        if (rangeSpan) {
            chartLayout = { ...chartLayout, ...rangeSpan };
        }
        engineParams.layout = chartLayout;

        const stxx = this.stxx = new CIQ.ChartEngine(engineParams);

        const deleteElement = stxx.chart.panel.holder.parentElement.querySelector('#mouseDeleteText');
        const manageElement = stxx.chart.panel.holder.parentElement.querySelector('#mouseManageText');
        const manageTouchElement = stxx.chart.panel.holder.parentElement.querySelector('#overlayTrashCan');
        deleteElement.textConent = t.translate('right-click to delete');
        manageElement.textConent = t.translate('right-click to manage');
        manageTouchElement.textContent = t.translate('tap to manage');

        CIQ.Animation(stxx, { stayPut: true });

        // connect chart to data
        this.feed = new Feed(this.api, stxx, this.mainStore);
        stxx.attachQuoteFeed(this.feed, {
            refreshInterval: null,
        });

        this.enableRouting = enableRouting;
        if (this.enableRouting) {
            this.routingStore.handleRouting();
        }

        this.holderStyle = stxx.chart.panel.holder.style;

        stxx.append('deleteHighlighted', this.updateComparisons);

        const context = new Context(stxx, this.rootNode);

        new KeystrokeHub(document.querySelector('body'), context, { // eslint-disable-line no-new
            cb: KeystrokeHub.defaultHotKeys,
        });

        // TODO: excluded studies

        this.loader.show();

        const studiesStore = this.mainStore.studies;
        stxx.callbacks.studyOverlayEdit = studiesStore.editStudy;
        stxx.callbacks.studyPanelEdit = studiesStore.editStudy;

        this.state.restorePreferences();

        this.api.getActiveSymbols().then(action(({ active_symbols }) => {
            /**
             * Updating market close status each 10 minute
             */
            this.onMarketClosedStatus();
            setInterval(this.onMarketClosedStatus.bind(this), 10 * 60 * 1000);
            this.setActiveSymbols(active_symbols);
            const isRestoreSuccess = this.state.restoreLayout();

            if (!isRestoreSuccess) {
                this.changeSymbol(
                    symbol || this.defaults.symbol,
                    this.granularity,
                );
            }

            this.context = context;
            this.contextPromise.resolve(this.context);
            this.resizeScreen();

            reaction(() => [
                this.state.symbol,
                this.state.granularity,
            ], () => {
                if (this.state.symbol !== undefined || this.state.granularity !== undefined) {
                    this.changeSymbol(this.state.symbol, this.state.granularity);
                }
            });
        }));

        this.resizeObserver = new ResizeObserver(this.resizeScreen);
        this.resizeObserver.observe(modalNode);

        this.feed.onComparisonDataUpdate(this.updateComparisons);
    }

    /**
     * Get tradeTimes if not loaded yet
     * OR update the active symbols by comapring open time
     */
    onMarketClosedStatus() {
        this.api.getTradingTimes()
            .then(this.updateMarketClosedStatus);
    }

    @action.bound updateMarketClosedStatus(response) {
        const nowUtc = (new Date()).getTime();
        const toEpochGMT = (hour, crossDay) => {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + (crossDay || 0));
            const dateStr = currentDate.toISOString().substring(0, 11);
            return new Date(`${dateStr}${hour}Z`).getTime();
        };
        response.trading_times.markets.forEach((market) => {
            market.submarkets.forEach((submarket) => {
                submarket.symbols.forEach((symbol) => {
                    const foundSymbol = this.activeSymbols.find(item => item.symbol === symbol.symbol);
                    if (foundSymbol) {
                        let isOpen = false;
                        for (let i = 0; i <= symbol.times.open.length; i++) {
                            const { open, close } = symbol.times;
                            if (open.length && close.length) {
                                const openTime = toEpochGMT(open[i]);
                                const closeTime = toEpochGMT(close[i]);

                                // If open time is cross day, then should check time till tomorrow
                                // and yesterday till now
                                if (
                                    (openTime > closeTime && nowUtc >= toEpochGMT(open[i], -1) && nowUtc <= closeTime)
                                        || (openTime > closeTime && nowUtc >= toEpochGMT(open[i]) && nowUtc <= toEpochGMT(close[i], 1))
                                        || (nowUtc >= openTime && nowUtc <= closeTime)
                                ) {
                                    isOpen = true;
                                    break;
                                }
                            }
                        }
                        foundSymbol.exchange_is_open = isOpen;
                    }
                });
            });
        });

        this.categorizedSymbols = this.categorizeActiveSymbols();
    }

    removeComparison(symbolObj) {
        this.context.stx.removeSeries(symbolObj.symbol);
        this.updateComparisons();
    }

    @action.bound updateCurrentActiveSymbol() {
        const { symbolObject } = this.stxx.chart;
        this.currentActiveSymbol = symbolObject;
        this.stxx.chart.yAxis.decimalPlaces = symbolObject.decimal_places;
        this.categorizedSymbols = this.categorizeActiveSymbols();
    }

    @action.bound setChartAvailability(status) {
        this.isChartAvailable = status;
    }

    @action.bound changeSymbol(symbolObj, granularity) {
        if (typeof symbolObj === 'string') {
            symbolObj = this.activeSymbols.find(s => s.symbol === symbolObj);
        }

        const isSymbolAvailable = symbolObj && this.currentActiveSymbol;

        if (
            (isSymbolAvailable
                && symbolObj.symbol === this.currentActiveSymbol.symbol)
            && (granularity !== undefined
                && granularity === this.granularity)
        ) {
            return;
        }

        const isResetComparisons = isSymbolAvailable
            && (symbolObj.symbol !== this.currentActiveSymbol.symbol);
        if (isResetComparisons) {
            this.comparisonSymbols = [];
            for (const field in this.stxx.chart.series) {
                if (this.stxx.chart.series[field].parameters.bucket !== 'study') {
                    this.stxx.removeSeries(field);
                }
            }
        }

        let params;
        if (granularity !== undefined) {
            this.granularity = granularity;
            params = { periodicity: calculateTimeUnitInterval(granularity) };
        }

        this.newChart(symbolObj, params);

        if (symbolObj) {
            this.updateCurrentActiveSymbol();
        }

        const { chartType: chartTypeStore } = this.mainStore;
        if (chartTypeStore.chartTypeProp === undefined) {
            const isTick = this.stxx.layout.timeUnit === 'second';
            const isCandle = chartTypeStore.isCandle;
            if (isCandle && isTick) {
                // Tick charts cannot be represented with candles
                chartTypeStore.setType('mountain');
            } else if (!isTick && !isCandle) {
                chartTypeStore.setType('candle');
            }
        }
    }

    // Calling newChart with symbolObj as undefined refreshes the chart
    @action.bound newChart(symbolObj = this.currentActiveSymbol, params) {
        this.loader.show();
        const onChartLoad = (err) => {
            this.loader.hide();
            if (err) {
                /* TODO, symbol not found error */
                return;
            }
            this.state.restoreDrawings();
        };
        const rangeSpan = this.getRangeSpan();
        this.stxx.newChart(symbolObj, null, null, onChartLoad, { ...params, ...rangeSpan });
    }

    getRangeSpan() {
        const { startEpoch, endEpoch } = this.state;
        let range, span;
        const paddingRatio = this.chartNode.clientWidth / this.RANGE_PADDING_PX;
        const elapsedSeconds = endEpoch - startEpoch;
        const epochPadding = elapsedSeconds / paddingRatio | 0;
        if (startEpoch !== undefined || endEpoch !== undefined) {
            const dtLeft  = (startEpoch !== undefined) ? new Date(getUTCDate(startEpoch - epochPadding)) : undefined;
            const dtRight = (endEpoch   !== undefined) ? new Date(getUTCDate(endEpoch + epochPadding))   : undefined;
            const periodicity = calculateTimeUnitInterval(this.granularity);
            range = {
                dtLeft,
                dtRight,
                periodicity,
                goIntoFuture: true,
                goIntoPast: true,
            };
            if (dtLeft) {
                span = { base: 'all', periodicity };
            }
            return { range, span };
        }
    }

    // Makes requests to tick history API that will replace
    // Existing chart tick/ohlc data
    @action.bound refreshChart() {
        this.newChart();
    }

    @action.bound updateComparisons() {
        if (!this.context) { return; }
        const stx = this.context.stx;
        const comparisonSymbolsKeys = Object.keys(stx.chart.series);
        if (comparisonSymbolsKeys.length !== this.comparisonSymbols.length) {
            const comparisons = [];
            const q = stx.currentQuote();
            if (q) {
                for (const sybl of comparisonSymbolsKeys) {
                    const srs = stx.chart.series[sybl];
                    const prm = srs.parameters;
                    const price = srs.lastQuote ? srs.lastQuote.Close : undefined;

                    comparisons.push({
                        color: prm.color,
                        price,
                        symbolObject: prm.symbolObject,
                    });
                }
            }
            this.comparisonSymbols = comparisons;
            return;
        }

        // Update the comparison prices:
        let i = 0;
        for (const sybl of comparisonSymbolsKeys) {
            const comp = this.comparisonSymbols[i];
            const srs = stx.chart.series[sybl];
            comp.price = srs.lastQuote ? srs.lastQuote.Close : undefined;
            i++;
        }
    }

    @action.bound destroy() {
        this.resizeObserver.disconnect();
        // Destroying the chart does not unsubscribe the streams;
        // we need to manually unsubscribe them.
        this.feed.unsubscribeAll();
        this.feed = null;
        this.stxx.updateChartData = function () {}; // prevent any data from entering the chart
        this.stxx.isDestroyed = true;
        this.stxx.destroy();
        this.stxx = null;
    }

    processSymbols(symbols) {
        const processedSymbols = [];

        // Stable sort is required to retain the order of the symbol name
        stableSort(symbols, (a, b) => a.submarket_display_name.localeCompare(b.submarket_display_name));

        for (const s of symbols) {
            processedSymbols.push({
                symbol: s.symbol,
                name: s.display_name,
                market: s.market,
                market_display_name: s.market_display_name,
                submarket_display_name: s.submarket_display_name,
                exchange_is_open: s.exchange_is_open,
                decimal_places: s.pip.length - 2,
            });
        }


        // Categorize symbols in order defined by another array; there's probably a more
        // efficient algo for this, but for just ~100 items it's not worth the effort
        const order = ['forex', 'indices', 'stocks', 'commodities', 'volidx'];
        const orderedSymbols = [];
        for (const o of order) {
            for (const p of processedSymbols) {
                if (o === p.market) {
                    orderedSymbols.push(p);
                }
            }
        }

        return orderedSymbols;
    }

    categorizeActiveSymbols() {
        if (this.activeSymbols.length <= 0 || !this.currentActiveSymbol) { return []; }

        const activeSymbols = this.activeSymbols;
        const categorizedSymbols = [];
        if (activeSymbols.length > 0) {
            const first = activeSymbols[0];
            const getSubcategory = d => ({
                subcategoryName: d.submarket_display_name,
                data: [],
            });
            const getCategory = d => ({
                categoryName: d.market_display_name,
                categoryId: d.market,
                hasSubcategory: true,
                data: [],
            });
            let subcategory = getSubcategory(first);
            let category = getCategory(first);
            for (const symbol of activeSymbols) {
                if (category.categoryName !== symbol.market_display_name) {
                    category.data.push(subcategory);
                    categorizedSymbols.push(category);
                    subcategory = getSubcategory(symbol);
                    category = getCategory(symbol);
                }
                if (subcategory.subcategoryName !== symbol.submarket_display_name) {
                    category.data.push(subcategory);
                    subcategory = getSubcategory(symbol);
                }
                const selected = symbol.symbol === this.currentActiveSymbol.symbol;
                subcategory.data.push({
                    enabled: true,
                    selected,
                    itemId: symbol.symbol,
                    display: symbol.name,
                    dataObject: symbol,
                });
            }

            category.data.push(subcategory);
            categorizedSymbols.push(category);
        }

        return categorizedSymbols;
    }
}

export default ChartStore;
