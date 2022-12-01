/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
import { action, computed, observable, reaction, makeObservable } from 'mobx';
import moment from 'moment';
import { CIQ } from 'src/utils/CIQ';
import MainStore from '.';
import { ActiveSymbols, BinaryAPI, TradingTimes } from '../binaryapi';
import { TProcessedSymbolItem, TSubCategoryDataItem } from '../binaryapi/ActiveSymbols';
import inject from '../chartiq_injections';
import animateChart from '../components/ui/Animation';
import Context from '../components/ui/Context';
import KeystrokeHub from '../components/ui/KeystrokeHub';
import { STATE } from '../Constant';
import { Feed } from '../feed';
import plotSpline from '../SplinePlotter';
import {
    ChartType,
    IPendingPromise,
    TChanges,
    TChartProps,
    TGranularity,
    TNetworkConfig,
    TPaginationCallback,
    TPaginationCallbackParams,
    TQuote,
    TRatio,
} from '../types';
import {
    calculateTimeUnitInterval,
    cloneCategories,
    createObjectFromLocalStorage,
    getUTCDate,
    prepareIndicatorName,
    renderSVGString,
} from '../utils';
import PendingPromise from '../utils/PendingPromise';
import ChartState from './ChartState';

type TDefaults = {
    granularity: TGranularity;
    chartType: string;
};

type TRange = {
    dtLeft?: Date;
    dtRight?: Date;
    padding?: number;
    chart?: any;
    goIntoFuture?: boolean;
    goIntoPast?: boolean;
    periodicity?: TNewChartParams['periodicity'];
    pixelsPerBar?: number;
    dontSaveRangeToLayout?: boolean;
    forceLoad?: boolean;
};
type TSpan = {
    base: string;
    multiplier?: number;
    maintainPeriodicity?: boolean;
    padding?: number;
    forceLoad?: boolean;
    chart?: any;
    periodicity?: TNewChartParams['periodicity'];
};
type TNewChartParams = {
    range?: TRange;
    span?: TSpan;
    periodicity?: { period?: number; timeUnit?: string; interval?: number };
    stretchToFillScreen?: boolean;
};
type THomeParams = {
    animate?: boolean;
    maintainWhitespace?: boolean;
    whitespace?: number;
    chart?: any;
};
type TDisplayStickyParams = {
    message?: string;
    backgroundColor?: string;
    forceShow?: boolean;
    noDelete?: boolean;
    noEdit?: boolean;
    type?: string;
    positioner?: (ref: Element) => void;
};
type TStxSymbolItem = {
    interval: number;
    periodicity: number;
    setSpan: TSpan | null;
    symbol: string;
    symbolObject: TProcessedSymbolItem;
    timeUnit: string;
};

class ChartStore {
    static keystrokeHub: KeystrokeHub;
    static chartCount = 0;
    static tradingTimes: TradingTimes | null;
    static activeSymbols: ActiveSymbols;
    chartId?: string;
    feed?: Feed | null;
    mainStore: MainStore;
    resizeObserver?: ResizeObserver;

    containerWidth: number | null = null;
    context: Context | null = null;
    currentActiveSymbol?: TProcessedSymbolItem | null;
    isChartAvailable = true;
    chartHeight?: number;
    chartContainerHeight?: number;
    isMobile?: boolean = false;
    isScaledOneOne = false;
    shouldRenderDialogs = false;
    yAxiswidth = 0;
    serverTime?: string;
    networkStatus?: TNetworkConfig;
    isLive = false;
    constructor(mainStore: MainStore) {
        makeObservable(this, {
            containerWidth: observable,
            context: observable,
            currentActiveSymbol: observable,
            isChartAvailable: observable,
            chartHeight: observable,
            chartContainerHeight: observable,
            isMobile: observable,
            isScaledOneOne: observable,
            shouldRenderDialogs: observable,
            yAxiswidth: observable,
            serverTime: observable,
            networkStatus: observable,
            pip: computed,
            addDeleteElement: action.bound,
            addManageElement: action.bound,
            resizeScreen: action.bound,
            _initChart: action.bound,
            categorizedSymbols: computed,
            onServerTimeChange: action.bound,
            updateCurrentActiveSymbol: action.bound,
            setChartAvailability: action.bound,
            changeSymbol: action.bound,
            calculateYaxisWidth: action.bound,
            updateYaxisWidth: action.bound,
            newChart: action.bound,
            setYaxisWidth: action.bound,
            updateScaledOneOne: action.bound,
            refreshChart: action.bound,
            destroy: action.bound,
            openFullscreen: action.bound,
            granularity: observable,
        });

        this.mainStore = mainStore;
    }
    feedCall: { tradingTimes?: boolean; activeSymbols?: boolean } = {};
    RANGE_PADDING_PX = 125;
    contextPromise: IPendingPromise<Context, void> | null = PendingPromise<Context, void>();
    rootNode: HTMLElement | null = null;
    api: BinaryAPI | null = null;
    defaults: TDefaults = {
        granularity: 0,
        chartType: 'mountain',
    };
    granularity: TGranularity;
    enableRouting?: boolean | null = null;
    chartNode?: HTMLElement | null = null;
    chartControlsNode?: HTMLElement | null = null;
    state?: ChartState;
    onMessage = null;

    tradingTimes?: TradingTimes;
    activeSymbols?: ActiveSymbols;
    get loader() {
        return this.mainStore.loader;
    }
    get routingStore() {
        return this.mainStore.routing;
    }
    get stateStore() {
        return this.mainStore.state;
    }
    get studiesStore() {
        return this.mainStore.studies;
    }
    get pip() {
        return this.currentActiveSymbol?.decimal_places;
    }
    get rootElement() {
        return this.chartId ? document.getElementById(this.chartId) : null;
    }
    currentCloseQuote = (): TQuote | null => {
        // let currentQuote = this.stxx.currentQuote();
        // if (currentQuote && !currentQuote.Close) {
        //     const dataSegmentClose = [...this.stxx.chart.dataSegment].filter(item => item && item.Close);
        //     if (dataSegmentClose && dataSegmentClose.length) {
        //         currentQuote = dataSegmentClose[dataSegmentClose.length - 1];
        //     } else {
        //         const dataSetClose = [...this.stxx.chart.dataSet].filter(item => item && item.Close);
        //         if (dataSetClose && dataSetClose.length) {
        //             currentQuote = dataSetClose[dataSetClose.length - 1];
        //         }
        //     }
        // }
        // return currentQuote;
        return null;
    };
    updateHeight(position?: string) {
        const historicalMobile = this.mainStore.chartSetting.historical && this.isMobile;
        const panelPosition = position || this.mainStore.chartSetting.position;
        // TODO use constant here for chartcontrol height
        let offsetHeight = 0;
        if (this.stateStore.enabledChartFooter) {
            offsetHeight = 32;
        } else if (panelPosition === 'bottom' && this.stateStore.chartControlsWidgets) {
            offsetHeight = 40;
        }
        this.chartHeight = this.chartNode?.offsetHeight;
        this.chartContainerHeight = (this.chartHeight || 0) - offsetHeight - (historicalMobile ? 45 : 0);
    }
    updateCanvas = () => {
        // if (this.stxx.slider) {
        //     this.stxx.slider.display(this.stxx.layout.rangeSlider);
        // }
        // this.stxx.resizeChart();
    };
    addDeleteElement = () => {
        // const deleteElement = this.stxx.chart.panel.holder.parentElement.querySelector('.mouseDeleteText');
        // deleteElement.textContent = t.translate('Right click to delete');
    };
    addManageElement = () => {
        // const manageElement = this.stxx.chart.panel.holder.parentElement.querySelector('.mouseManageText');
        // manageElement.textContent = t.translate('Right click to manage');
    };
    resizeScreen() {
        if (this.rootNode && this.rootNode.clientWidth >= 1280) {
            this.containerWidth = 1280;
        } else if (this.rootNode && this.rootNode.clientWidth >= 900) {
            this.containerWidth = 900;
        } else {
            this.containerWidth = 480;
        }
        this.updateHeight();
        this.updateCanvas();
        // Height updates are not immediate, so we must resize the canvas with
        // a slight delay for it to pick up the correct chartContainer height.
        // In mobile devices, a longer delay is given as DOM updates are slower.
        setTimeout(this.updateCanvas, this.isMobile ? 500 : 100);
    }
    /**
     * Get the height ratio of each active indicator in the bottom of chart
     *
     * this method get the number of active indicator that locate in the bottom
     * chart and by considering the chart height return the height that each
     * indicator should have.
     * if the getIndicatorHeightRatio callback passed to the chart from parent
     * component, use that callback to calculate the height ratio. the callback
     * should return an object that contain {height, percent} properties. otherwise
     * the chart ignore it and calculate the ratio by itself
     *
     * @version 0.3.16
     * @param {number} num: count of active indicator in the bottom of chart
     * @returns {number} height: height of each active indicator in the bottom
     * @returns {number} percent: percent of height of an indicator compare to the chart heigh
     */
    indicatorHeightRatio = (num: number) => {
        let ratio = {} as TRatio;
        if (typeof this.stateStore.getIndicatorHeightRatio === 'function' && this.chartNode) {
            ratio = this.stateStore.getIndicatorHeightRatio(this.chartNode.offsetHeight, num);
        }
        if (this.chartNode && (!ratio || !ratio.height || !ratio.percent)) {
            const chartHeight = this.chartNode.offsetHeight;
            const isSmallScreen = chartHeight < 780;
            const denominator = num >= 5 ? num : num + 1;
            const reservedHeight = this.isMobile ? 160 : 320;
            const indicatorsHeight = Math.round(
                (chartHeight - (reservedHeight + (isSmallScreen ? 20 : 0))) / denominator
            );
            ratio = {
                height: indicatorsHeight,
                percent: indicatorsHeight / chartHeight,
            };
        }
        return ratio;
    };
    init = (rootNode: HTMLElement | null, props: React.PropsWithChildren<TChartProps>) => {
        this.loader.show();
        this.mainStore.state.setChartIsReady(false);
        this.loader.setState('chart-engine');
        this.chartId = props.id || 'base-chart';
        this._initChart(rootNode, props);
    };

    _initChart(rootNode: HTMLElement | null, props: React.PropsWithChildren<TChartProps>) {
        // Add custom injections to the CIQ
        inject({
            drawToolsStore: this.mainStore.drawTools,
        });
        this.rootNode = rootNode as (HTMLElement & { CIQ: typeof CIQ }) | null;

        this.chartNode = this.rootNode?.querySelector('.ciq-chart-area');

        this.chartControlsNode = this.rootNode?.querySelector('.cq-chart-controls');

        const {
            symbol,
            granularity,
            requestAPI,
            requestSubscribe,
            requestForget,
            requestForgetStream,
            isMobile,
            enableRouting,
            onMessage,
            settings,
            onSettingsChange,
            getMarketsOrder,
            initialData,
            chartData,
            feedCall,
            isLive,
        } = props;
        this.feedCall = feedCall || {};
        this.api = new BinaryAPI(requestAPI, requestSubscribe, requestForget, requestForgetStream);
        // trading times and active symbols can be reused across multiple charts
        this.tradingTimes =
            ChartStore.tradingTimes ||
            (ChartStore.tradingTimes = new TradingTimes(this.api, {
                enable: this.feedCall.tradingTimes,
                shouldFetchTradingTimes: this.mainStore.state.shouldFetchTradingTimes,
                tradingTimes: initialData?.tradingTimes,
            }));
        this.activeSymbols =
            ChartStore.activeSymbols ||
            (ChartStore.activeSymbols = new ActiveSymbols(this.api, this.tradingTimes, {
                enable: this.feedCall.activeSymbols,
                getMarketsOrder,
                activeSymbols: initialData?.activeSymbols,
                chartData,
            }));
        const { chartSetting } = this.mainStore;
        chartSetting.setSettings(settings);
        chartSetting.onSettingsChange = onSettingsChange;
        this.isMobile = isMobile;
        this.state = this.mainStore.state;
        this.mainStore.notifier.onMessage = onMessage;
        this.granularity = granularity !== undefined ? granularity : this.defaults.granularity;
        this.isLive = isLive || false;

        // let _chartType = chartType || this.defaults.chartType;

        // if (_chartType === 'spline') {
        //     // cause there's no such thing as spline chart in ChartIQ
        //     _chartType = 'mountain';
        // }
        // this.chartType = _chartType;
        // if (rangeSpan) {
        //     chartLayout = { ...chartLayout, ...rangeSpan };
        // }
        // engineParams.layout = chartLayout;

        ChartStore.chartCount += 1;

        this.addDeleteElement();
        this.addManageElement();

        // connect chart to data
        this.feed = new Feed(this.api, this.mainStore, this.tradingTimes);
        this.enableRouting = enableRouting;
        if (this.enableRouting) {
            this.routingStore.handleRouting();
        }
        const context = new Context(this.rootNode);
        // only one instance of keystrokeHub should exist
        if (ChartStore.keystrokeHub === undefined) {
            ChartStore.keystrokeHub = new KeystrokeHub(document.body, null, {
                cb: KeystrokeHub.defaultHotKeys,
            });
        }
        // TODO: excluded studies
        // stxx.addEventListener('studyOverlayEdit', this.studiesStore.editStudy);
        // stxx.addEventListener('studyPanelEdit', this.studiesStore.editStudy);
        this.stateStore.stateChange(STATE.INITIAL);
        this.loader.setState('market-symbol');
        this.activeSymbols?.retrieveActiveSymbols().then(() => {
            this.loader.setState('trading-time');
            this.tradingTimes?.initialize().then(
                action(() => {
                    const isRestoreSuccess = this.state?.restoreLayout();
                    this.loadChartWithInitalData(symbol, initialData?.masterData);
                    if (!isRestoreSuccess) {
                        this.changeSymbol(
                            // default to first available symbol
                            symbol || (this.activeSymbols && Object.keys(this.activeSymbols.symbolMap)[0]),
                            this.granularity
                        );
                    }
                    this.context = context;
                    this.chartClosedOpenThemeChange(!this.currentActiveSymbol?.exchange_is_open);
                    this.mainStore.chart.tradingTimes?.onMarketOpenCloseChanged(
                        action((changes: TChanges) => {
                            for (const sy in changes) {
                                if (this.currentActiveSymbol?.symbol === sy) {
                                    this.chartClosedOpenThemeChange(!changes[sy]);
                                }
                            }
                        })
                    );

                    this.contextPromise?.resolve?.(this.context);
                    this.resizeScreen();

                    reaction(
                        () => [this.state?.symbol, this.state?.granularity],
                        () => {
                            if (this.state?.symbol !== undefined || this.state?.granularity !== undefined) {
                                this.changeSymbol(this.state.symbol, this.state.granularity);
                            }
                        }
                    );
                    this.tradingTimes?.onMarketOpenCloseChanged(this.onMarketOpenClosedChange);
                    this.tradingTimes?.onTimeChanged(this.onServerTimeChange);
                    setTimeout(
                        action(() => {
                            // Defer the render of the dialogs and dropdowns; this enables
                            // considerable performance improvements for slower devices.
                            this.shouldRenderDialogs = true;
                        }),
                        500
                    );
                })
            );
        });
    }
    setResizeEvent = () => {
        const listener = (entries: ResizeObserverEntry[]) => {
            entries.forEach(() => {
                if (this.rootNode && this.rootNode.clientWidth > 0) this.resizeScreen();
            });
        };
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(listener);
            if (this.rootNode) this.resizeObserver.observe(this.rootNode);
        } else {
            import(/* webpackChunkName: "resize-observer-polyfill" */ 'resize-observer-polyfill').then(
                ({ default: ResizeObserver }) => {
                    window.ResizeObserver = ResizeObserver;

                    // if (this.stxx.isDestroyed || !this.rootNode) {
                    //     return;
                    // }
                    // this.resizeObserver = new ResizeObserver(listener);
                    // this.resizeObserver.observe(this.rootNode);
                }
            );
        }
    };
    onMarketOpenClosedChange = (changes: TChanges) => {
        // const symbolObjects = this.stxx.getSymbols().map((item: TStxSymbolItem) => item.symbolObject);
        // let shouldRefreshChart = false;
        // for (const { symbol, name } of symbolObjects) {
        //     if (symbol in changes) {
        //         if (changes[symbol]) {
        //             shouldRefreshChart = true;
        //             this.chartClosedOpenThemeChange(false);
        //             this.mainStore.notifier.notifyMarketOpen(name);
        //         } else {
        //             this.chartClosedOpenThemeChange(true);
        //             this.mainStore.notifier.notifyMarketClose(name);
        //         }
        //     }
        // }
        // if (shouldRefreshChart) {
        //     // refresh to stream opened market
        //     this.refreshChart();
        // }
    };

    chartClosedOpenThemeChange(isChartClosed: boolean) {
        this.mainStore.state.setChartClosed(isChartClosed);
        this.mainStore.state.setChartTheme(this.mainStore.chartSetting.theme, isChartClosed);
    }
    get categorizedSymbols() {
        if (!this.activeSymbols || this.activeSymbols.categorizedSymbols.length === 0) return [];
        const activeSymbols = this.activeSymbols.activeSymbols;
        return cloneCategories<TSubCategoryDataItem>(activeSymbols, item => {
            const selected = (item as TSubCategoryDataItem).dataObject.symbol === this.currentActiveSymbol?.symbol;
            return {
                ...item,
                selected,
            };
        });
    }
    onServerTimeChange() {
        if (this.tradingTimes?._serverTime) {
            this.serverTime = moment(this.tradingTimes._serverTime.getEpoch() * 1000).format(
                'DD MMM YYYY HH:mm:ss [GMT]'
            );
        }
    }

    updateCurrentActiveSymbol(symbolObj: TProcessedSymbolItem) {
        this.currentActiveSymbol = symbolObj;
        // this.stxx.chart.yAxis.decimalPlaces = symbolObject.decimal_places;
        this.setMainSeriesDisplay(symbolObj.name);
    }
    setChartAvailability(status: boolean) {
        this.isChartAvailable = status;
    }
    changeSymbol(
        symbolObj: TProcessedSymbolItem | string | undefined,
        granularity?: TGranularity,
        isLanguageChanged = false
    ) {
        if (typeof symbolObj === 'string') {
            symbolObj = this.activeSymbols?.getSymbolObj(symbolObj);
        }
        const isSymbolAvailable = symbolObj && this.currentActiveSymbol;
        if (
            isSymbolAvailable &&
            symbolObj?.symbol === this.currentActiveSymbol?.symbol &&
            granularity !== undefined &&
            granularity === this.granularity &&
            !isLanguageChanged
        ) {
            return;
        }
        if (granularity !== undefined) {
            this.granularity = granularity;
        }

        this.newChart(symbolObj);
        if (symbolObj) {
            this.updateCurrentActiveSymbol(symbolObj);
        }
    }
    calculateYaxisWidth = (price: number) => {
        if (!price) return;

        // const { context } = this.context?.stx.chart;
        // const priceWidth = context.measureText(price.toFixed(this.pip)).width + 20;
        // if (priceWidth > this.yAxiswidth) {
        //     this.yAxiswidth = priceWidth;

        //     // this.stxx.chart.yAxis.width = priceWidth;

        //     // this.stxx.calculateYAxisPositions();

        //     // this.stxx.draw();
        // }
    };
    updateYaxisWidth = () => {
        // if (this.stxx && this.stxx.masterData && this.stxx.masterData.length) {
        //     if (this.currentCloseQuote() && this.currentCloseQuote()?.Close) {
        //         this.calculateYaxisWidth(this.currentCloseQuote()?.Close as number);
        //     }
        // }
    };
    // Calling newChart with symbolObj as undefined refreshes the chart
    newChart(symbolObj = this.currentActiveSymbol) {
        if (!symbolObj) return;

        if (this.currentActiveSymbol) {
            this.feed?.unsubscribe({ symbol: this.currentActiveSymbol.symbol, granularity: this.granularity });
        }

        this.loader.show();
        this.mainStore.state.setChartIsReady(false);
        const onChartLoad = (err: string) => {
            this.setMainSeriesDisplay(symbolObj.name);
            this.loader.hide();
            this.chartClosedOpenThemeChange(!symbolObj.exchange_is_open);
            this.mainStore.paginationLoader.updateOnPagination(false);
            this.mainStore.drawTools.computeActiveDrawTools();
            this.mainStore.state.setChartIsReady(true);
            if (err) {
                /* TODO, symbol not found error */
                return;
            }
            this.state?.restoreDrawings();
            if (this.mainStore.chart.feed) {
                // this.mainStore.chart.feed.scaleChart();
            }
        };
        this.yAxiswidth = 0;

        this.feed!.fetchInitialData(
            symbolObj.symbol,
            this.feed!._serverTime.getLocalDate(),
            new Date(),
            {
                granularity: this.mainStore.state.granularity,
                symbolObject: symbolObj,
            },
            ({ quotes, error }: TPaginationCallbackParams) => {
                this.loader.hide();
                this.mainStore.chartAdapter.newChart();
                this.mainStore.chartAdapter.onTickHistory(quotes || []);
                this.mainStore.chart.feed?.offMasterDataUpdate(this.mainStore.chartAdapter.onTick);
                this.mainStore.chart.feed?.onMasterDataUpdate(this.mainStore.chartAdapter.onTick);
                onChartLoad(error as string);
            }
        );
        // CIQ.extend(parameters, { ...params, ...rangeSpan }, true);

        //  this.stxx.loadChart(symbolObj, parameters, onChartLoad);
    }
    /**
     * load the chart with given data
     *
     * by this methos, beside of waiting for Feed@fetchInitialData to provide first data
     * the chart are initiled by give masterData. Chart need a symbol to be able to get
     * loaded, so if the passed symbol didn't fill, it try to get the symbol from `layout-*`
     * storage
     *
     * @param {string} symbol the symbol used to load the chart
     * @param {array} masterData array of ticks regards of desire tick
     */
    loadChartWithInitalData(symbol: string | undefined, masterData: TQuote[] | undefined) {
        if (!masterData) return;
        const layoutData = createObjectFromLocalStorage(`layout-${this.chartId}`);
        if (!layoutData || !layoutData.symbols.length) return;
        const layout_symbol = layoutData.symbols[0].symbol;
        if (!(symbol || layout_symbol)) {
            console.error('symbol is not specificed, without it, chart is unable to be loaded!');
            return;
        }

        // this.stxx.loadChart(
        //     symbol || layout_symbol,
        //     {
        //         masterData,
        //         periodicity: {
        //             period: layoutData.periodicity,
        //             interval: layoutData.interval,
        //             timeUnit: layoutData.timeUnit,
        //         },
        //     },
        //     () => {
        //         this.loader.hide();
        //     }
        // );
    }
    remainLabelY = (): number => {
        // const stx = this.context?.stx;
        const topPos = 36;
        const labelHeight = 24;
        const bottomPos = 66;
        // let y = stx.chart.currentPriceLabelY + labelHeight;
        // if (stx.chart.currentPriceLabelY > stx.chart.panel.bottom - bottomPos) {
        //     y = stx.chart.panel.bottom - bottomPos;
        //     y = y < stx.chart.currentPriceLabelY - labelHeight ? y : stx.chart.currentPriceLabelY - labelHeight;
        // } else if (stx.chart.currentPriceLabelY < stx.chart.panel.top) {
        //     y = topPos;
        // }
        return 0;
    };
    setYaxisWidth = (width?: number) => {
        this.yAxiswidth = width || this.yAxiswidth;

        // this.stxx.chart.yAxis.width = width || this.yAxiswidth;

        // this.stxx.calculateYAxisPositions();

        // this.stxx.draw();
    };

    setMainSeriesDisplay(name: string) {
        // if (this.stxx && this.stxx.chart) {
        //     // Set display name of main series (to be shown in crosshair tooltip)
        //     this.stxx.chart.seriesRenderers._main_series.seriesParams[0].display = name;
        //     // TODO, we use to use `field` field to recgnize main seris and show
        //     // it's crosshair, as in ChartIQ 6.2.2 they are going to remove this field
        //     // we should find another way of detecting main series price, till then
        //     // we found this temporary solution.
        //     this.stxx.chart.seriesRenderers._main_series.seriesParams[0].field = 'Close';
        // }
    }
    updateScaledOneOne(state: boolean) {
        this.isScaledOneOne = state;
    }
    // Makes requests to tick history API that will replace
    // Existing chart tick/ohlc data
    refreshChart() {
        this.newChart();
    }
    destroy() {
        ChartStore.chartCount -= 1;
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.tradingTimes && ChartStore.chartCount === 0) {
            ChartStore.tradingTimes = null;
            this.tradingTimes.destructor();
        }
        // Destroying the chart does not unsubscribe the streams;
        // we need to manually unsubscribe them.
        if (this.feed) {
            this.feed.unsubscribeAll();
            this.feed = null;
        }
        // if (ChartStore.keystrokeHub && ChartStore.keystrokeHub.context === this.context) {
        //     ChartStore.keystrokeHub.setActiveContext(null);
        // }
        // if (this.stxx) {

        //     // eslint-disable-next-line @typescript-eslint/no-empty-function
        //     this.stxx.updateChartData = function () {}; // prevent any data from entering the chart

        //     this.stxx.isDestroyed = true;

        //     this.stxx.destroy();
        //     this.stxx = null;
        // }
        this.mainStore.drawTools.destructor();
        this.currentActiveSymbol = null;
        this.contextPromise = null;
        this.context = null;
    }

    openFullscreen() {
        const fullscreen_map: Record<string, string[]> = {
            element: ['fullscreenElement', 'webkitFullscreenElement', 'mozFullScreenElement', 'msFullscreenElement'],
            fnc_enter: ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen'],
            fnc_exit: ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen'],
        };
        const isInFullScreen = fullscreen_map.element.some(
            fnc => document[fnc as keyof Document] && document[fnc as keyof Document] !== null
        );
        const el = isInFullScreen ? document : document.documentElement;
        const fncToCall = fullscreen_map[isInFullScreen ? 'fnc_exit' : 'fnc_enter'].find(
            fnc => (el as HTMLElement)[fnc as keyof HTMLElement]
        );
        // fncToCall can be undefined for iOS that does not support fullscreenAPI
        if (fncToCall) {
            (el as HTMLElement)[fncToCall as 'requestFullscreen']()?.catch(() => undefined);
        }
    }
}
export default ChartStore;
