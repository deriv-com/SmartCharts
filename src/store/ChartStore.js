import { action, observable, reaction, computed } from 'mobx';
import PendingPromise from '../utils/PendingPromise';
import Context from '../components/ui/Context';
import KeystrokeHub from '../components/ui/KeystrokeHub';
import animateChart from '../components/ui/Animation';
import plotSpline from '../SplinePlotter';
import { Feed } from '../feed';
import { ActiveSymbols, BinaryAPI, TradingTimes } from '../binaryapi';
import { calculateTimeUnitInterval, getUTCDate, cloneCategories } from '../utils';

import ResizeIcon from '../../sass/icons/chart/resize-icon.svg';
import EditIcon from '../../sass/icons/edit/ic-edit.svg';
import DeleteIcon from '../../sass/icons/delete/ic-delete.svg';
import DownIcon from '../../sass/icons/chart/ic-down.svg';
import JumpToTodayIcon from '../../sass/icons/chart/jump-to-today.svg';
import MaximizeIcon from '../../sass/icons/chart/ic-maximize.svg';

function renderSVGString(icon) {
    const vb = icon.viewBox.split(' ').slice(2);
    // eslint-disable-next-line no-undef
    return `<svg width="${vb[0]}" height="${vb[1]}"><use xlink:href="${__webpack_public_path__ + icon.url}" /></svg>`;
}


class ChartStore {
    static keystrokeHub;
    static chartCount = 0;
    static tradingTimes;
    static activeSymbols;

    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    RANGE_PADDING_PX = 125;
    contextPromise = new PendingPromise();
    rootNode = null;
    stxx = null;
    api = null;
    defaults = {
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
    @observable chartHeight;
    @observable chartContainerHeight;
    @observable isMobile = false;
    @observable cursorInChart = false;
    @observable shouldRenderDialogs = false;

    get loader() { return this.mainStore.loader; }
    get routingStore() {
        return this.mainStore.routing;
    }

    updateHeight(position) {
        const historicalMobile = this.mainStore.chartSetting.historical && this.isMobile;
        const panelPosition = position || this.mainStore.chartSetting.position;
        const offsetHeight = (panelPosition === 'left') ? 0 : this.chartControlsNode.offsetHeight;
        this.chartHeight = this.chartNode.offsetHeight;
        this.chartContainerHeight = this.chartHeight - offsetHeight - (historicalMobile ? 45 : 0);
    }

    updateCanvas = () => {
        if (this.stxx.slider) {
            this.stxx.slider.display(this.stxx.layout.rangeSlider);
        }
        this.stxx.resizeChart();
    };

    @action.bound resizeScreen() {
        if (!this.context) { return; }


        if (this.modalNode.clientWidth >= 1280) {
            this.containerWidth = 1280;
        } else if (this.modalNode.clientWidth >= 900) {
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

    init = (rootNode, modalNode, props) => {
        if (window.CIQ) {
            this._initChart(rootNode, modalNode, props);
        } else {
            import(/* webpackChunkName: "chartiq" */ 'chartiq').then(action(({ CIQ, SplinePlotter }) => {
                CIQ.ChartEngine.htmlControls.baselineHandle = `<div class="stx-baseline-handle" style="display: none;">${renderSVGString(ResizeIcon)}</div>`;
                CIQ.ChartEngine.htmlControls.iconsTemplate = `<div class="stx-panel-control"><div class="stx-panel-title"></div><div class="stx-btn-panel"><span class="stx-ico-up">${renderSVGString(DownIcon)}</span></div><div class="stx-btn-panel"><span class="stx-ico-focus">${renderSVGString(MaximizeIcon)}</span></div><div class="stx-btn-panel"><span class="stx-ico-down">${renderSVGString(DownIcon)}</span></div><div class="stx-btn-panel"><span class="stx-ico-edit">${renderSVGString(EditIcon)}</span></div><div class="stx-btn-panel"><span class="stx-ico-close">${renderSVGString(DeleteIcon)}</span></div></div>`;
                CIQ.ChartEngine.htmlControls.mSticky = `<div class="stx_sticky"> <span class="mStickyInterior"></span> <span class="mStickyRightClick"><span class="overlayEdit stx-btn" style="display:none"><span class="ic-edit">${renderSVGString(EditIcon)}</span><span class="ic-delete">${renderSVGString(DeleteIcon)}</span></span> <span class="overlayTrashCan stx-btn" style="display:none"><span class="ic-edit">${renderSVGString(EditIcon)}</span><span class="ic-delete">${renderSVGString(DeleteIcon)}</span></span> <span class="mouseDeleteInstructions"><span>(</span><span class="mouseDeleteText">right-click to delete</span><span class="mouseManageText">right-click to manage</span><span>)</span></span></span></div>`;
                CIQ.ChartEngine.htmlControls.home = `<div class="stx_jump_today" style="display:none">${renderSVGString(JumpToTodayIcon)}</div>`;

                window.CIQ = CIQ;
                SplinePlotter.plotSpline = plotSpline;
                this._initChart(rootNode, modalNode, props);
            }));
        }
    };

    @action.bound _initChart(rootNode, modalNode, props) {
        /**
         * only home button click part modified to avoid calling
         * newChart() on home function while historical enable
         */
        CIQ.ChartEngine.prototype.registerHTMLElements = function () {
            const c = this.chart.container;
            for (const control in CIQ.ChartEngine.htmlControls) {
                if (typeof this.chart[control] === 'undefined' && typeof this.controls[control] === 'undefined') {
                    if (!this.allowZoom && control === 'chartControls') continue;
                    let el = this.container.querySelector(`.${control}`, c);
                    if (el) {
                        this.chart[control] = el;
                        this.controls[control] = el;
                    } else {
                        const rawHTML = CIQ.ChartEngine.htmlControls[control];
                        if (!rawHTML) continue;
                        const div = document.createElement('DIV');
                        div.innerHTML = rawHTML;
                        el = div.firstChild;
                        c.appendChild(el);
                        this.chart[control] = el;
                        this.controls[control] = el;
                        CIQ.appendClassName(el, control);
                    }
                }
            }
            const chartControls = this.controls.chartControls, home = this.controls.home;
            if (chartControls) {
                const zoomIn = this.container.querySelector('.stx-zoom-in', chartControls);
                const zoomOut = this.container.querySelector('.stx-zoom-out', chartControls);

                CIQ.safeClickTouch(zoomIn, (function (self) { return function (e) { self.zoomIn(e); e.stopPropagation(); }; }(this)));
                CIQ.safeClickTouch(zoomOut, (function (self) { return function (e) { self.zoomOut(e); e.stopPropagation(); }; }(this)));
                if (!CIQ.touchDevice) {
                    this.makeModal(zoomIn);
                    this.makeModal(zoomOut);
                }
            }
            if (home) {
                CIQ.safeClickTouch(home, (function (self) {
                    return function (e) {
                        e.stopPropagation();
                        self.home({ animate: true });
                    };
                }(this)));
                if (!CIQ.touchDevice) {
                    this.makeModal(home);
                }
            }
        };

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

        // trading times and active symbols can be reused across multiple charts
        this.tradingTimes = ChartStore.tradingTimes || (ChartStore.tradingTimes = new TradingTimes(this.api));
        this.activeSymbols = ChartStore.activeSymbols || (ChartStore.activeSymbols = new ActiveSymbols(this.api, this.tradingTimes));

        const { chartSetting } = this.mainStore;
        chartSetting.setSettings(settings);
        chartSetting.onSettingsChange = onSettingsChange;
        this.isMobile = isMobile;
        this.state = this.mainStore.state;

        this.mainStore.notifier.onMessage = onMessage;
        this.granularity = (granularity !== undefined) ? granularity : this.defaults.granularity;
        const engineParams = {
            maxMasterDataSize: 5000, // cap size so tick_history requests do not become too large
            markerDelay: null, // disable 25ms delay for placement of markers
            container: this.rootNode.querySelector('.chartContainer'),
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
                    width: -10,
                    justifyRight: true,
                },
                gaplines: true,
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
        ChartStore.chartCount += 1;

        const deleteElement = stxx.chart.panel.holder.parentElement.querySelector('.mouseDeleteText');
        const manageElement = stxx.chart.panel.holder.parentElement.querySelector('.mouseManageText');
        deleteElement.textContent = t.translate('right-click to delete');
        manageElement.textContent = t.translate('right-click to manage');

        animateChart(stxx, { stayPut: true });

        // connect chart to data
        this.feed = new Feed(this.api, stxx, this.mainStore, this.tradingTimes);
        stxx.attachQuoteFeed(this.feed, {
            refreshInterval: null,
        });

        this.enableRouting = enableRouting;
        if (this.enableRouting) {
            this.routingStore.handleRouting();
        }

        this.holderStyle = stxx.chart.panel.holder.style;

        const context = new Context(stxx, this.rootNode);

        // only one instance of keystrokeHub should exist
        if (ChartStore.keystrokeHub === undefined) {
            ChartStore.keystrokeHub = new KeystrokeHub(document.body, null, {
                cb: KeystrokeHub.defaultHotKeys,
            });
        }

        // TODO: excluded studies

        this.loader.show();

        const studiesStore = this.mainStore.studies;
        stxx.callbacks.studyOverlayEdit = studiesStore.editStudy;
        stxx.callbacks.studyPanelEdit = studiesStore.editStudy;

        this.activeSymbols.retrieveActiveSymbols().then(() => {
            this.tradingTimes.initialize().then(action(() => {
                // In the odd event that chart is destroyed by the time
                // the request finishes, just calmly return...
                if (stxx.isDestroyed) { return; }

                const isRestoreSuccess = this.state.restoreLayout();

                if (!isRestoreSuccess) {
                    this.changeSymbol(
                        // default to first available symbol
                        symbol || Object.keys(this.activeSymbols.symbolMap)[0],
                        this.granularity,
                    );
                }

                this.context = context;

                stxx.container.addEventListener('mouseenter', this.onMouseEnter);
                stxx.container.addEventListener('mouseleave', this.onMouseLeave);

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

                this.tradingTimes.onMarketOpenCloseChanged(this.onMarketOpenClosedChange);

                setTimeout(action(() => {
                    // Defer the render of the dialogs and dropdowns; this enables
                    // considerable performance improvements for slower devices.
                    this.shouldRenderDialogs = true;
                }), 500);
            }));
        });

        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(this.resizeScreen);
            this.resizeObserver.observe(modalNode);
        } else {
            import(/* webpackChunkName: "resize-observer-polyfill" */ 'resize-observer-polyfill').then(({ default: ResizeObserver }) => {
                window.ResizeObserver = ResizeObserver;
                if (stxx.isDestroyed || !modalNode) { return; }
                this.resizeObserver = new ResizeObserver(this.resizeScreen);
                this.resizeObserver.observe(modalNode);
            });
        }
    }

    onMarketOpenClosedChange = (changes) => {
        const symbolObjects = this.stxx.getSymbols().map(item => item.symbolObject);
        let shouldRefreshChart = false;
        for (const { symbol, name } of symbolObjects) {
            if (symbol in changes) {
                if (changes[symbol]) {
                    shouldRefreshChart = true;
                    this.mainStore.notifier.notifyMarketOpen(name);
                } else {
                    this.mainStore.notifier.notifyMarketClose(name);
                }
            }
        }
        if (shouldRefreshChart) {
            // refresh to stream opened market
            this.refreshChart();
        }
    };

    @computed get categorizedSymbols() {
        if (!this.activeSymbols || this.activeSymbols.categorizedSymbols.length === 0) return [];

        const activeSymbols = this.activeSymbols.activeSymbols;
        return cloneCategories(activeSymbols, (item) => {
            const selected = item.dataObject.symbol === this.currentActiveSymbol.symbol;
            return {
                ...item,
                selected,
            };
        });
    }

    @action.bound onMouseEnter() {
        this.cursorInChart = true;
        /*
        * Disable key press events for chart until we can get it not to
        * interfere with key presses outside the chart:
        */
        // ChartStore.keystrokeHub.setActiveContext(this.context);
    }

    @action.bound onMouseLeave() {
        this.cursorInChart = false;
        /*
        * Disable key press events for chart until we can get it not to
        * interfere with key presses outside the chart:
        */
        // ChartStore.keystrokeHub.setActiveContext(null);
    }

    @action.bound updateCurrentActiveSymbol() {
        const { symbolObject } = this.stxx.chart;
        this.currentActiveSymbol = symbolObject;
        this.stxx.chart.yAxis.decimalPlaces = symbolObject.decimal_places;

        this.setMainSeriesDisplay(symbolObject.name);
    }

    @action.bound setChartAvailability(status) {
        this.isChartAvailable = status;
    }

    @action.bound changeSymbol(symbolObj, granularity) {
        if (typeof symbolObj === 'string') {
            symbolObj = this.activeSymbols.getSymbolObj(symbolObj);
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
            this.contextPromise.then(() => {
                const isTick = this.stxx.layout.timeUnit === 'second';
                const isCandle = chartTypeStore.isCandle;
                if (isCandle && isTick) {
                    // Tick charts cannot be represented with candles
                    chartTypeStore.setType('mountain');
                } else if (!isTick && !isCandle) {
                    chartTypeStore.setType('candle');
                }
            });
        }
    }

    // Calling newChart with symbolObj as undefined refreshes the chart
    @action.bound newChart(symbolObj = this.currentActiveSymbol, params) {
        this.stxx.chart.symbolDisplay = symbolObj.name;
        this.loader.show();
        const onChartLoad = (err) => {
            this.setMainSeriesDisplay(symbolObj.name);

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

    setMainSeriesDisplay(name) {
        // Set display name of main series (to be shown in crosshair tooltip)
        this.stxx.chart.seriesRenderers._main_series.seriesParams[0].display = name;
        // TODO, we use to use `field` field to recgnize main seris and show
        // it's crosshair, as in ChartIQ 6.2.2 they are going to remove this field
        // we should find another way of detecting main series price, till then
        // we found this temporary solution.
        this.stxx.chart.seriesRenderers._main_series.seriesParams[0].field = 'Close';
    }

    // Makes requests to tick history API that will replace
    // Existing chart tick/ohlc data
    @action.bound refreshChart() {
        this.newChart();
    }

    @action.bound destroy() {
        ChartStore.chartCount -= 1;

        if (this.resizeObserver) { this.resizeObserver.disconnect(); }
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
        if (ChartStore.keystrokeHub.context === this.context) {
            ChartStore.keystrokeHub.setActiveContext(null);
        }
        if (this.stxx) {
            this.stxx.container.removeEventListener('mouseenter', this.onMouseEnter);
            this.stxx.container.removeEventListener('mouseleave', this.onMouseLeave);
            this.stxx.updateChartData = function () {}; // prevent any data from entering the chart
            this.stxx.isDestroyed = true;
            this.stxx.destroy();
            this.stxx = null;
        }
    }
}

export default ChartStore;
