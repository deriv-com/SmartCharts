import {
    action,
    observable,
    reaction,
    computed }                 from 'mobx';
import {
    ActiveSymbols,
    BinaryAPI,
    TradingTimes }             from '../binaryapi';
import inject                  from '../chartiq_injections';
import Context                 from '../components/ui/Context';
import KeystrokeHub            from '../components/ui/KeystrokeHub';
import animateChart            from '../components/ui/Animation';
import { Feed }                from '../feed';
import plotSpline              from '../SplinePlotter';
import {
    calculateTimeUnitInterval,
    getUTCDate,
    cloneCategories }          from '../utils';
import PendingPromise          from '../utils/PendingPromise';

import ResizeIcon      from '../../sass/icons/chart/resize-icon.svg';
import EditIcon        from '../../sass/icons/edit/ic-edit.svg';
import DeleteIcon      from '../../sass/icons/delete/ic-delete.svg';
import DownIcon        from '../../sass/icons/chart/ic-down.svg';
import JumpToTodayIcon from '../../sass/icons/chart/jump-to-today.svg';
import MaximizeIcon    from '../../sass/icons/chart/ic-maximize.svg';
// import '../utils/raf';

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
    defaultMinimumBars = 5;
    _barriers = [];
    @observable containerWidth = null;
    @observable context = null;
    @observable currentActiveSymbol;
    @observable isChartAvailable = true;
    @observable chartHeight;
    @observable chartContainerHeight;
    @observable isMobile = false;
    @observable cursorInChart = false;
    @observable shouldRenderDialogs = false;
    @observable yAxiswidth = 0;

    get loader() { return this.mainStore.loader; }
    get routingStore() {
        return this.mainStore.routing;
    }
    get stateStore() {
        return this.mainStore.state;
    }

    @computed get pip() { return this.currentActiveSymbol.decimal_places; }

    updateHeight(position) {
        const historicalMobile = this.mainStore.chartSetting.historical && this.isMobile;
        const panelPosition = position || this.mainStore.chartSetting.position;
        // TODO use constant here for chartcontrol height
        const offsetHeight = (panelPosition === 'bottom' && this.stateStore.chartControlsWidgets) ? 40 : 0;
        this.chartHeight = this.chartNode.offsetHeight;
        this.chartContainerHeight = this.chartHeight - offsetHeight - (historicalMobile ? 45 : 0);
    }

    updateCanvas = () => {
        if (!this.stxx) { return; }
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
        this.updateCanvas();
        // Height updates are not immediate, so we must resize the canvas with
        // a slight delay for it to pick up the correct chartContainer height.
        // In mobile devices, a longer delay is given as DOM updates are slower.
        setTimeout(this.updateCanvas, this.isMobile ? 500 : 100);
    }

    init = (rootNode, modalNode, props) => {
        this.loader.show();
        this.mainStore.state.setChartIsReady(false);
        this.loader.setState('chart-engine');

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
        const _self = this;

        // Add custom injections to the CIQ
        inject();

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
        CIQ.ChartEngine.prototype.home = function (params) {
            this.swipe.amplitude = 0;
            const layout = this.layout;
            if (typeof params !== 'object') {
                // backward compatibility
                params = {
                    maintainWhitespace: params,
                };
            }

            function resetPanelZooms(stx) {
                for (const p in stx.panels) {
                    const yAxes = stx.panels[p].yaxisLHS.concat(stx.panels[p].yaxisRHS);
                    for (let a = 0; a < yAxes.length; a++) stx.calculateYAxisMargins(yAxes[a]);
                }
            }
            function scrollToCallback(self, chart, exactScroll) {
                return function () {
                    resetPanelZooms(self);
                    chart.scroll = exactScroll;
                    self.draw();
                };
            }
            if (typeof params.maintainWhitespace === 'undefined') params.maintainWhitespace = true;  // maintain the whitespace unless set to false

            this.cancelTouchSingleClick = true;
            if (!this.chart.dataSet || !this.chart.dataSet.length) {
                // to clear out anything that may have been on the screen. Otherwise we still show stale data.
                this.draw();
                return;
            }
            this.micropixels = 0;
            const barsDisplayedOnScreen = Math.floor(this.chart.width / layout.candleWidth);
            for (const chartName in this.charts) {
                const chart = this.charts[chartName];
                if (params.chart && params.chart !== chart) continue;

                let whitespace = 0;
                if (params.maintainWhitespace && this.preferences.whitespace >= 0) whitespace = this.preferences.whitespace;
                if (params.whitespace || params.whitespace === 0) whitespace = params.whitespace;
                const leftMargin = this.getLabelOffsetInPixels(chart, layout.chartType);
                if (leftMargin > whitespace) whitespace = leftMargin;

                let exactScroll = Math.min(barsDisplayedOnScreen, chart.dataSet.length); // the scroll must be the number of bars you want to see.
                if (this.chart.allowScrollPast) exactScroll = barsDisplayedOnScreen; // If whitespace allowed on left of screen
                this.micropixels = this.chart.width - (exactScroll * layout.candleWidth) - whitespace;
                this.preferences.whitespace = whitespace;
                while (this.micropixels > layout.candleWidth) { // If micropixels is larger than a candle then scroll back further
                    exactScroll++;
                    this.micropixels -= layout.candleWidth;
                }
                while (this.micropixels < 0) {
                    exactScroll--;
                    this.micropixels += layout.candleWidth;
                }
                this.micropixels -= layout.candleWidth;
                exactScroll++;
                if ((!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars) && !this.standaloneBars[layout.chartType]) this.micropixels += layout.candleWidth / 2; // bar charts display at beginning of candle

                if (this.isHistoricalMode() && _self.isMobile) {
                    exactScroll = parseInt(exactScroll * 0.8, 10); // eslint-disable-line
                } else if (this.isHistoricalMode()) {
                    exactScroll = parseInt(exactScroll * 0.9, 10); // eslint-disable-line
                }

                if (params.animate) {
                    const self = this;
                    this.scrollTo(chart, exactScroll, scrollToCallback(self, chart, exactScroll));
                } else {
                    chart.scroll = exactScroll;
                    resetPanelZooms(this);
                }
            }
            this.draw();
        };
        CIQ.ChartEngine.prototype.isHistoricalMode = function () {
            return !!_self.stateStore.endEpoch;
        };

        this.rootNode = rootNode;
        this.modalNode = modalNode;
        this.chartNode = this.rootNode.querySelector('.ciq-chart-area');
        this.chartControlsNode = this.rootNode.querySelector('.cq-chart-controls');

        CIQ.Plotter.prototype.getYAxisWidth = () => this.yAxiswidth;

        // monkey patching to handle radius and height for `current price label`
        CIQ.ChartEngine.prototype.createYAxisLabel = function (panel, txt, y, backgroundColor, color, ctx, yAxis) {
            if (panel.yAxis.drawPriceLabels === false || panel.yAxis.noDraw) return;
            const yax = yAxis || panel.yAxis;
            if (yax.noDraw || !yax.width) return;
            const context = ctx || this.chart.context;
            // SmartChart Team: this prop modified
            const margin = 9;
            let height = 24;
            let radius;

            if (this.labelType === 'currentSpot') {
                this.canvasFont('stx_current_hr_up', context);
            } else {
                this.canvasFont('stx_price_label', context);
            }
            const tickWidth = this.drawBorders ? 3 : 0; // pixel width of tick off edge of border
            const textWidth = context.measureText(txt).width;
            let width;
            try {
                if (textWidth + margin > yax.width) {
                    width = textWidth + tickWidth + margin * 2;
                } else {
                    width = yax.width + margin;
                }
            } catch (e) { width = yax.width; } // Firefox doesn't like this in hidden iframe

            // some y-axis label has style of `roundRectArrow` and some has `rect`, we reduce
            // 14px which is about the `roundRectArrow` style arrow to make the label all fit
            width -= 14;
            if (this.chart.yAxis.width < width) {
                this.chart.yAxis.width = width;
                this.calculateYAxisPositions();
            } else  {
                width = this.chart.yAxis.width;
            }

            let x = this.width - this.chart.yAxis.width;
            let left = ((width - textWidth) / 2);

            if (yax.width < 0) x += (yax.width - width);
            const position = (yax.position === null ? panel.chart.yAxis.position : yax.position);
            if (position === 'left') {
                width *= -1;
                if (yax.width < 0) x -= (yax.width + width);
                radius = -3;
                context.textAlign = 'right';
            }
            if (y + (height / 2) > yax.bottom) y = yax.bottom - (height / 2);
            if (y - (height / 2) < yax.top) y = yax.top + (height / 2);

            if (typeof (CIQ[this.yaxisLabelStyle]) === 'undefined') {
                this.yaxisLabelStyle = 'roundRectArrow';  // in case of user error, set a default.
            }
            let yaxisLabelStyle = this.yaxisLabelStyle;
            if (yax.yaxisLabelStyle) yaxisLabelStyle = yax.yaxisLabelStyle;

            // as crosshair and countdown style is `rect`, so due to previous rule we should
            // increase there x position to fit the y-axis
            x += 1;
            if (this.labelType === 'currentSpot') {
                x += 13;
                left  -= 8;
                radius = 0;
            } else if (this.labelType === 'crosshair') {
                height = 30;
            }

            const params = {
                ctx:context,
                x,
                y,
                top: y - (height / 2),
                width,
                height,
                radius,
                backgroundColor,
                fill: true,
                stroke: false,
                margin:{ left, top: 1 },
                txt,
                color,
            };
            CIQ[yaxisLabelStyle](params);
        };

        const {
            symbol,
            chartType,
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
        } = props;
        this.api = new BinaryAPI(requestAPI, requestSubscribe, requestForget, requestForgetStream);
        // trading times and active symbols can be reused across multiple charts
        this.tradingTimes = ChartStore.tradingTimes || (ChartStore.tradingTimes = new TradingTimes(this.api, this.mainStore.state.shouldFetchTradingTimes));
        this.activeSymbols = ChartStore.activeSymbols || (ChartStore.activeSymbols = new ActiveSymbols(this.api, this.tradingTimes));

        const { chartSetting } = this.mainStore;
        chartSetting.setSettings(settings);
        chartSetting.onSettingsChange = onSettingsChange;
        this.isMobile = isMobile;
        this.state = this.mainStore.state;

        this.mainStore.notifier.onMessage = onMessage;
        this.granularity = (granularity !== undefined) ? granularity : this.defaults.granularity;
        const engineParams = {
            maxMasterDataSize: this.getMaxMasterDataSize(this.granularity), // cap size so tick_history requests do not become too large
            markerDelay: null, // disable 25ms delay for placement of markers
            container: this.rootNode.querySelector('.chartContainer'),
            controls: { chartControls: null }, // hide the default zoom buttons
            yaxisLabelStyle: 'roundRect',
            preferences: {
                currentPriceLine: true,
                whitespace: isMobile ? 50 : 150,
            },
            chart: {
                yAxis: {
                    // Put some top margin so chart doesn't get blocked by chart title
                    initialMarginTop: 125,
                    initialMarginBottom: 100,
                    // position: 'left',
                    displayBorder: true,
                    justifyRight: false,
                },
                xAxis: {
                    displayBorder: true,
                },
                gaplines: true,
                dynamicYAxis: true,
            },
            minimumLeftBars: this.defaultMinimumBars,
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

        // TODO this part of the code prevent the chart to go to home after refreshing the page when the chart was zoomed in before.
        // let defaultMinimumBars = this.defaultMinimumBars;
        // if (stxx.chart.maxTicks - 10 > 50) {
        //     defaultMinimumBars = 50;
        // }
        // stxx.minimumLeftBars = Math.min(stxx.chart.maxTicks, defaultMinimumBars);

        // macos trackpad is so sensitive that it'll break our zoom animation.
        // unfortunately there is no way to detect a trackpad from javascript,
        // here we drop 'wheel' events shorter that 40ms
        // TODO: email chartiq support to fix this.
        const org_run = stxx.animations.zoom.run.bind(stxx.animations.zoom);
        let wheelInMotion = false;
        stxx.animations.zoom.run = (fc, startValues, endValues) => {
            if (wheelInMotion) return;
            wheelInMotion = true;
            setTimeout(() => { wheelInMotion = false; }, 40);
            return org_run(fc, startValues, endValues);
        };

        stxx.isAutoScale = settings && settings.isAutoScale !== false;

        ChartStore.chartCount += 1;

        const deleteElement = stxx.chart.panel.holder.parentElement.querySelector('.mouseDeleteText');
        const manageElement = stxx.chart.panel.holder.parentElement.querySelector('.mouseManageText');
        deleteElement.textContent = t.translate('right-click to delete');
        manageElement.textContent = t.translate('right-click to manage');

        if (this.state.isAnimationEnabled) animateChart(stxx, { stayPut: true });
        // stxx.chart.lockScroll = true;

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

        const studiesStore = this.mainStore.studies;
        stxx.callbacks.studyOverlayEdit = studiesStore.editStudy;
        stxx.callbacks.studyPanelEdit = studiesStore.editStudy;

        this.loader.setState('market-symbol');
        this.activeSymbols.retrieveActiveSymbols().then(() => {
            this.loader.setState('trading-time');
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

                this.chartClosedOpenThemeChange(!this.currentActiveSymbol.exchange_is_open);

                this.mainStore.chart.tradingTimes.onMarketOpenCloseChanged(action((changes) => {
                    for (const sy in changes) {
                        if (this.currentActiveSymbol.symbol === sy) {
                            this.chartClosedOpenThemeChange(!changes[sy]);
                        }
                    }
                }));

                stxx.container.addEventListener('mouseenter', this.onMouseEnter);
                stxx.container.addEventListener('mouseleave', this.onMouseLeave);

                this.contextPromise.resolve(this.context);
                this.resizeScreen();

                reaction(() => [
                    this.state.symbol,
                    this.state.granularity,
                ], () => {
                    if (this.state.symbol !== undefined || (this.state.granularity !== undefined)) {
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
                    this.chartClosedOpenThemeChange(false);
                    this.mainStore.notifier.notifyMarketOpen(name);
                } else {
                    this.chartClosedOpenThemeChange(true);
                    this.mainStore.notifier.notifyMarketClose(name);
                }
            }
        }
        if (shouldRefreshChart) {
            // refresh to stream opened market
            this.refreshChart();
        }
    };

    getMaxMasterDataSize(granularity) {
        let maxMasterDataSize = 5000;
        // When granularity is 1 day
        if (granularity === 86400) maxMasterDataSize = Math.floor(2.8 * 365);
        // When granularity is 8 hours
        else if (granularity === 28800) maxMasterDataSize = Math.floor(2.8 * 365 * 3);
        return maxMasterDataSize;
    }

    chartClosedOpenThemeChange(isChartClosed) {
        this.mainStore.state.setChartClosed(isChartClosed);
        this.mainStore.state.setChartTheme(this.mainStore.chartSetting.theme, isChartClosed);
    }

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
            this.stxx.maxMasterDataSize = this.getMaxMasterDataSize(this.granularity);
            params = { periodicity: calculateTimeUnitInterval(granularity) };
        }

        if (params === undefined && symbolObj) {
            // Remove comparisons before symbol changes
            for (const field in this.stxx.chart.series) {
                this.stxx.removeSeries(field);
            }
        }

        this.newChart(symbolObj, params);

        if (symbolObj) {
            this.updateCurrentActiveSymbol();
        }
    }

    @action.bound calculateYaxisWidth = (price) => {
        if (!price) return;
        const { context } = this.context.stx.chart;

        const priceWidth = context.measureText(price.toFixed(this.pip)).width + 20;
        if (priceWidth > this.yAxiswidth) {
            this.yAxiswidth = priceWidth;

            this.stxx.chart.yAxis.width = priceWidth;
            this.stxx.calculateYAxisPositions();
            this.stxx.draw();
        }
    }

    @action.bound updateYaxisWidth = () => {
        if (this.stxx && this.stxx.masterData && this.stxx.masterData.length) {
            const currentQuote = this.context.stx.currentQuote();
            if (currentQuote && currentQuote.Close) {
                this.calculateYaxisWidth(currentQuote.Close);
            } else {
                const lastDataWithClose = this.stxx.masterData.find(x => x.Close);
                if (lastDataWithClose) {
                    this.calculateYaxisWidth(lastDataWithClose.Close);
                }
            }
        }
    }

    // Calling newChart with symbolObj as undefined refreshes the chart
    @action.bound newChart(symbolObj = this.currentActiveSymbol, params) {
        if (!symbolObj) return;
        this.stxx.chart.symbolDisplay = symbolObj.name;
        this.loader.show();
        this.mainStore.state.setChartIsReady(false);
        const onChartLoad = (err) => {
            this.setMainSeriesDisplay(symbolObj.name);

            this.loader.hide();
            this.mainStore.state.setChartIsReady(true);
            if (err) {
                /* TODO, symbol not found error */
                return;
            }
            this.state.restoreDrawings();
            if (this.mainStore.chart.feed) {
                this.mainStore.chart.feed.scaleChart();
            }
        };
        this.yAxiswidth = 0;
        const rangeSpan = this.getRangeSpan();
        this.stxx.newChart(symbolObj, null, null, onChartLoad, { ...params, ...rangeSpan });
        this.chartClosedOpenThemeChange(!symbolObj.exchange_is_open);
    }

    getRangeSpan() {
        const { startEpoch, endEpoch } = this.state;
        let range, span;
        const paddingRatio = this.chartNode.clientWidth / this.RANGE_PADDING_PX;
        const elapsedSeconds = (endEpoch || startEpoch) - (startEpoch || endEpoch);
        const epochPadding = elapsedSeconds / paddingRatio | 0;
        if (startEpoch || endEpoch) {
            const dtLeft  = (startEpoch) ? CIQ.strToDateTime(getUTCDate(startEpoch - epochPadding)) : undefined;
            const dtRight = (endEpoch) ? CIQ.strToDateTime(getUTCDate(endEpoch + epochPadding))   : undefined;
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
        if (this.stxx && this.stxx.chart) {
            // Set display name of main series (to be shown in crosshair tooltip)
            this.stxx.chart.seriesRenderers._main_series.seriesParams[0].display = name;
            // TODO, we use to use `field` field to recgnize main seris and show
            // it's crosshair, as in ChartIQ 6.2.2 they are going to remove this field
            // we should find another way of detecting main series price, till then
            // we found this temporary solution.
            this.stxx.chart.seriesRenderers._main_series.seriesParams[0].field = 'Close';
        }
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
