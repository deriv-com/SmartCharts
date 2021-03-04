import { action, observable, reaction, computed } from 'mobx';
import moment from 'moment';
import { ActiveSymbols, BinaryAPI, TradingTimes } from '../binaryapi';
import inject from '../chartiq_injections';
import Context from '../components/ui/Context';
import KeystrokeHub from '../components/ui/KeystrokeHub';
import animateChart from '../components/ui/Animation';
import { Feed } from '../feed';
import plotSpline from '../SplinePlotter';
import { calculateTimeUnitInterval, getUTCDate, cloneCategories, prepareIndicatorName, createObjectFromLocalStorage, renderSVGString, } from '../utils';
import PendingPromise from '../utils/PendingPromise';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart/resize-... Remove this comment to see the full error message
import ResizeIcon from '../../sass/icons/chart/resize-icon.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/edit/ic-edit.... Remove this comment to see the full error message
import EditIcon from '../../sass/icons/edit/ic-edit.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/delete/ic-del... Remove this comment to see the full error message
import DeleteIcon from '../../sass/icons/delete/ic-delete.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart/ic-down... Remove this comment to see the full error message
import DownIcon from '../../sass/icons/chart/ic-down.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/navigation-wi... Remove this comment to see the full error message
import HomeIcon from '../../sass/icons/navigation-widgets/ic-home.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart/ic-maxi... Remove this comment to see the full error message
import MaximizeIcon from '../../sass/icons/chart/ic-maximize.svg';
// import '../utils/raf';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Constant' was resolved to '/Users/balak... Remove this comment to see the full error message
import { STATE } from '../Constant';
class ChartStore {
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'keystrokeHub' implicitly has an 'any' type... Remove this comment to see the full error message
    static keystrokeHub;
    static chartCount = 0;
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'tradingTimes' implicitly has an 'any' type... Remove this comment to see the full error message
    static tradingTimes;
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'activeSymbols' implicitly has an 'any' typ... Remove this comment to see the full error message
    static activeSymbols;
    chartId: any;
    feed: any;
    mainStore: any;
    resizeObserver: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
    }
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'feedCall' implicitly has an 'any' type.
    feedCall;
    RANGE_PADDING_PX = 125;
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    contextPromise = new PendingPromise();
    rootNode = null;
    stxx = null;
    api = null;
    defaults = {
        granularity: 0,
        chartType: 'mountain',
    };
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'granularity' implicitly has an 'any' type.
    granularity;
    enableRouting = null;
    chartNode = null;
    chartControlsNode = null;
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'holderStyle' implicitly has an 'any' type.
    holderStyle;
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'state' implicitly has an 'any' type.
    state;
    onMessage = null;
    defaultMinimumBars = 5;
    _barriers = [];
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    containerWidth = null;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    context = null;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    currentActiveSymbol;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    isChartAvailable = true;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    chartHeight;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    chartContainerHeight;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    isMobile = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    isScaledOneOne = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    cursorInChart = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    shouldRenderDialogs = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    yAxiswidth = 0;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    serverTime;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    networkStatus;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    lastCountDownSecond;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    countDownLabel;
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
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get pip() {
        return this.currentActiveSymbol.decimal_places;
    }
    get rootElement() {
        return document.getElementById(this.chartId);
    }
    currentCloseQuote = () => {
        if (!this.stxx) {
            return;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        let currentQuote = this.stxx.currentQuote();
        if (currentQuote && !currentQuote.Close) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const dataSegmentClose = [...this.stxx.chart.dataSegment].filter(item => item && item.Close);
            if (dataSegmentClose && dataSegmentClose.length) {
                currentQuote = dataSegmentClose[dataSegmentClose.length - 1];
            }
            else {
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                const dataSetClose = [...this.stxx.chart.dataSet].filter(item => item && item.Close);
                if (dataSetClose && dataSetClose.length) {
                    currentQuote = dataSetClose[dataSetClose.length - 1];
                }
            }
        }
        return currentQuote;
    };
    updateHeight(position: any) {
        const historicalMobile = this.mainStore.chartSetting.historical && this.isMobile;
        const panelPosition = position || this.mainStore.chartSetting.position;
        // TODO use constant here for chartcontrol height
        let offsetHeight = 0;
        if (this.stateStore.enabledChartFooter) {
            offsetHeight = 32;
        }
        else if (panelPosition === 'bottom' && this.stateStore.chartControlsWidgets) {
            offsetHeight = 40;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.chartHeight = this.chartNode.offsetHeight;
        this.chartContainerHeight = this.chartHeight - offsetHeight - (historicalMobile ? 45 : 0);
    }
    updateCanvas = () => {
        if (!this.stxx) {
            return;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (this.stxx.slider) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.slider.display(this.stxx.layout.rangeSlider);
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.resizeChart();
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    resizeScreen() {
        if (!this.context) {
            return;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (this.rootNode.clientWidth >= 1280) {
            // @ts-expect-error ts-migrate(2322) FIXME: Type '1280' is not assignable to type 'null'.
            this.containerWidth = 1280;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        else if (this.rootNode.clientWidth >= 900) {
            // @ts-expect-error ts-migrate(2322) FIXME: Type '900' is not assignable to type 'null'.
            this.containerWidth = 900;
        }
        else {
            // @ts-expect-error ts-migrate(2322) FIXME: Type '480' is not assignable to type 'null'.
            this.containerWidth = 480;
        }
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
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
    indicatorHeightRatio = (num: any) => {
        let ratio = {};
        if (typeof this.stateStore.getIndicatorHeightRatio === 'function') {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            ratio = this.stateStore.getIndicatorHeightRatio(this.chartNode.offsetHeight, num);
        }
        if (!ratio || !(ratio as any).height || !(ratio as any).percent) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const chartHeight = this.chartNode.offsetHeight;
            const isSmallScreen = chartHeight < 780;
            const denominator = num >= 5 ? num : num + 1;
            const reservedHeight = this.isMobile ? 160 : 320;
            const indicatorsHeight = Math.round((chartHeight - (reservedHeight + (isSmallScreen ? 20 : 0))) / denominator);
            ratio = {
                height: indicatorsHeight,
                percent: indicatorsHeight / chartHeight,
            };
        }
        return ratio;
    };
    init = (rootNode: any, props: any) => {
        this.loader.show();
        this.mainStore.state.setChartIsReady(false);
        this.loader.setState('chart-engine');
        this.chartId = props.id || 'base-chart';
        if ((window as any).CIQ) {
            this._initChart(rootNode, props);
        }
        else {
            // @ts-expect-error ts-migrate(2307) FIXME: Cannot find module 'chartiq' or its corresponding ... Remove this comment to see the full error message
            import(/* webpackChunkName: "chartiq" */ 'chartiq').then(action(({ CIQ, SplinePlotter }) => {
                CIQ.ChartEngine.htmlControls.baselineHandle = `<div class="stx-baseline-handle" style="display: none;">${renderSVGString(ResizeIcon)}</div>`;
                CIQ.ChartEngine.htmlControls.iconsTemplate = `<div class="stx-panel-control"><div class="stx-panel-title"></div><div class="stx-btn-panel stx-show"><span class="stx-ico-up">${renderSVGString(DownIcon)}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-down">${renderSVGString(DownIcon)}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-focus">${renderSVGString(MaximizeIcon)}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-edit">${renderSVGString(EditIcon)}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-close">${renderSVGString(DeleteIcon)}</span></div></div>`;
                CIQ.ChartEngine.htmlControls.mSticky = `<div class="stx_sticky"> <span class="mStickyInterior"></span> <span class="mStickyRightClick"><span class="overlayEdit stx-btn" style="display:none"><span class="ic-edit">${renderSVGString(EditIcon)}</span><span class="ic-delete">${renderSVGString(DeleteIcon)}</span></span> <span class="overlayTrashCan stx-btn" style="display:none"><span class="ic-edit">${renderSVGString(EditIcon)}</span><span class="ic-delete">${renderSVGString(DeleteIcon)}</span></span> <span class="mouseDeleteInstructions"><span class="mouseDeleteText">Right click to delete</span><span class="mouseManageText">Right click to manage</span></span></span></div>`;
                CIQ.ChartEngine.htmlControls.home = `<div class="stx_jump_today" style="display:none">${renderSVGString(HomeIcon)}</div>`;
                (window as any).CIQ = CIQ;
                SplinePlotter.plotSpline = plotSpline;
                this._initChart(rootNode, props);
            }));
        }
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    _initChart(rootNode: any, props: any) {
        const _self = this;
        // Add custom injections to the CIQ
        inject({
            drawToolsStore: this.mainStore.drawTools,
        });
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.extend(CIQ.Studies.studyLibrary.Detrended, {
            calculateFN(stx: any, sd: any) {
                const quotes = sd.chart.scrubbed;
                if (quotes.length < sd.days + 1) {
                    sd.error = true;
                    return;
                }
                let field = sd.inputs.Field;
                if (!field || field === 'field')
                    field = 'Close';
                const offset = Math.floor(sd.days / 2 + 1);
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                CIQ.Studies.MA(sd.inputs['Moving Average Type'], sd.days, field, -offset, 'MA', stx, sd);
                let days = Math.max(sd.days - offset - 1, sd.startFrom - offset);
                if (days < 0)
                    days = 0;
                for (let i = days; i < quotes.length - offset; i++) {
                    let val = quotes[i][field];
                    if (val && typeof val === 'object')
                        val = val[sd.subField];
                    const maVal = quotes[i][`MA ${sd.name}`];
                    if ((val || val === 0) && (maVal || maVal === 0))
                        quotes[i][`Result ${sd.name}`] = val - maVal;
                }
            },
        });
        /**
         * only home button click part modified to avoid calling
         * newChart() on home function while historical enable
         */
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.ChartEngine.prototype.registerHTMLElements = function () {
            const c = this.chart.container;
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            for (const control in CIQ.ChartEngine.htmlControls) {
                if (typeof this.chart[control] === 'undefined' && typeof this.controls[control] === 'undefined') {
                    if (!this.allowZoom && control === 'chartControls')
                        continue;
                    let el = this.container.querySelector(`.${control}`, c);
                    if (el) {
                        this.chart[control] = el;
                        this.controls[control] = el;
                    }
                    else {
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                        const rawHTML = CIQ.ChartEngine.htmlControls[control];
                        if (!rawHTML)
                            continue;
                        const div = document.createElement('DIV');
                        div.innerHTML = rawHTML;
                        el = div.firstChild;
                        c.appendChild(el);
                        this.chart[control] = el;
                        this.controls[control] = el;
                        el.classList.add(control);
                    }
                }
            }
            const chartControls = this.controls.chartControls, home = this.controls.home;
            if (chartControls) {
                const zoomIn = this.container.querySelector('.stx-zoom-in', chartControls);
                const zoomOut = this.container.querySelector('.stx-zoom-out', chartControls);
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                CIQ.safeClickTouch(zoomIn, (function (self) {
                    return function (e: any) {
                        self.zoomIn(e);
                        e.stopPropagation();
                    };
                })(this));
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                CIQ.safeClickTouch(zoomOut, (function (self) {
                    return function (e: any) {
                        self.zoomOut(e);
                        e.stopPropagation();
                    };
                })(this));
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                if (!CIQ.touchDevice) {
                    this.makeModal(zoomIn);
                    this.makeModal(zoomOut);
                }
            }
            if (home) {
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                CIQ.safeClickTouch(home, (function (self) {
                    return function (e: any) {
                        e.stopPropagation();
                        self.home({ animate: true });
                    };
                })(this));
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                if (!CIQ.touchDevice) {
                    this.makeModal(home);
                }
            }
        };
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.ChartEngine.prototype.home = function (params: any) {
            this.swipe.amplitude = 0;
            const layout = this.layout;
            if (typeof params !== 'object') {
                // backward compatibility
                params = {
                    maintainWhitespace: params,
                };
            }
            function resetPanelZooms(stx: any) {
                for (const p in stx.panels) {
                    const yAxes = stx.panels[p].yaxisLHS.concat(stx.panels[p].yaxisRHS);
                    for (let a = 0; a < yAxes.length; a++)
                        stx.calculateYAxisMargins(yAxes[a]);
                }
            }
            function scrollToCallback(self: any, chart: any, exactScroll: any) {
                return function () {
                    resetPanelZooms(self);
                    chart.scroll = exactScroll;
                    self.draw();
                };
            }
            if (typeof params.maintainWhitespace === 'undefined')
                params.maintainWhitespace = true; // maintain the whitespace unless set to false
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
                if (params.chart && params.chart !== chart)
                    continue;
                let whitespace = 0;
                if (params.maintainWhitespace && this.preferences.whitespace >= 0) {
                    whitespace = this.preferences.whitespace;
                }
                if (params.whitespace || params.whitespace === 0)
                    whitespace = params.whitespace;
                const leftMargin = this.getLabelOffsetInPixels(chart, layout.chartType);
                if (leftMargin > whitespace)
                    whitespace = leftMargin;
                let exactScroll = Math.min(barsDisplayedOnScreen, chart.dataSet.length); // the scroll must be the number of bars you want to see.
                if (this.chart.allowScrollPast)
                    exactScroll = barsDisplayedOnScreen; // If whitespace allowed on left of screen
                this.micropixels = this.chart.width - exactScroll * layout.candleWidth - whitespace;
                this.preferences.whitespace = whitespace;
                while (this.micropixels > layout.candleWidth) {
                    // If micropixels is larger than a candle then scroll back further
                    exactScroll++;
                    this.micropixels -= layout.candleWidth;
                }
                while (this.micropixels < 0) {
                    exactScroll--;
                    this.micropixels += layout.candleWidth;
                }
                this.micropixels -= layout.candleWidth;
                exactScroll++;
                if (!this.mainSeriesRenderer || !this.mainSeriesRenderer.standaloneBars) {
                    this.micropixels += layout.candleWidth / 2;
                } // bar charts display at beginning of candle
                if (this.isHistoricalMode() && _self.isMobile) {
                    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    exactScroll = parseInt(exactScroll * 0.8, 10); // eslint-disable-line
                }
                else if (this.isHistoricalMode()) {
                    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    exactScroll = parseInt(exactScroll * 0.9, 10); // eslint-disable-line
                }
                if (params.animate) {
                    const self = this;
                    this.scrollTo(chart, exactScroll, scrollToCallback(self, chart, exactScroll));
                }
                else {
                    chart.scroll = exactScroll;
                    resetPanelZooms(this);
                }
            }
            this.draw();
        };
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.ChartEngine.prototype.isHistoricalMode = function () {
            return !!_self.stateStore.endEpoch;
        };
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.ChartEngine.prototype.getNearestCloseQuote = function () {
            return _self.currentCloseQuote();
        };
        this.rootNode = rootNode;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.chartNode = this.rootNode.querySelector('.ciq-chart-area');
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.chartControlsNode = this.rootNode.querySelector('.cq-chart-controls');
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.Plotter.prototype.getYAxisWidth = () => this.yAxiswidth;
        // monkey patching to handle radius and height for `current price label`
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.ChartEngine.prototype.createYAxisLabel = function (panel: any, txt: any, y: any, backgroundColor: any, color: any, ctx: any, yAxis: any) {
            if (panel.yAxis.drawPriceLabels === false || panel.yAxis.noDraw)
                return;
            const yax = yAxis || panel.yAxis;
            if (yax.noDraw || !yax.width)
                return;
            const context = ctx || this.chart.context;
            // SmartChart Team: this prop modified
            const margin = 9;
            let height = 24;
            let radius;
            if (this.labelType === 'currentSpot') {
                this.canvasFont('stx_current_hr_up', context);
            }
            else {
                this.canvasFont('stx_price_label', context);
            }
            const tickWidth = this.drawBorders ? 3 : 0; // pixel width of tick off edge of border
            const textWidth = context.measureText(txt).width;
            let width;
            try {
                if (textWidth + margin > yax.width) {
                    width = textWidth + tickWidth + margin * 2;
                }
                else {
                    width = yax.width + margin;
                }
            }
            catch (e) {
                width = yax.width;
            } // Firefox doesn't like this in hidden iframe
            // some y-axis label has style of `roundRectArrow` and some has `rect`, we reduce
            // 14px which is about the `roundRectArrow` style arrow to make the label all fit
            width -= 14;
            if (this.chart.yAxis.width < width) {
                this.chart.yAxis.width = width;
                this.calculateYAxisPositions();
            }
            else {
                width = this.chart.yAxis.width;
            }
            let x = this.width - this.chart.yAxis.width;
            let left = (width - textWidth) / 2;
            if (yax.width < 0)
                x += yax.width - width;
            const position = yax.position === null ? panel.chart.yAxis.position : yax.position;
            if (position === 'left') {
                width *= -1;
                if (yax.width < 0)
                    x -= yax.width + width;
                radius = -3;
                context.textAlign = 'right';
            }
            if (y + height / 2 > yax.bottom)
                y = yax.bottom - height / 2;
            if (y - height / 2 < yax.top)
                y = yax.top + height / 2;
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            if (typeof CIQ[this.yaxisLabelStyle] === 'undefined') {
                this.yaxisLabelStyle = 'roundRectArrow'; // in case of user error, set a default.
            }
            let yaxisLabelStyle = this.yaxisLabelStyle;
            if (yax.yaxisLabelStyle)
                yaxisLabelStyle = yax.yaxisLabelStyle;
            // as crosshair and countdown style is `rect`, so due to previous rule we should
            // increase there x position to fit the y-axis
            x += 1;
            if (this.labelType === 'currentSpot') {
                x += 13;
                left -= 8;
                radius = 0;
            }
            else if (this.labelType === 'crosshair') {
                height = 30;
            }
            const params = {
                ctx: context,
                x,
                y,
                top: y - height / 2,
                width,
                height,
                radius,
                backgroundColor,
                fill: true,
                stroke: false,
                margin: { left, top: 1 },
                txt,
                color,
            };
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            CIQ[yaxisLabelStyle](params);
        };
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.ChartEngine.prototype.displaySticky = function (params: any) {
            const m = this.controls.mSticky;
            if (!m)
                return;
            const mi = m.querySelector('.mStickyInterior');
            if (!mi)
                return;
            const overlayTrashCan = m.querySelector('.overlayTrashCan');
            const overlayEdit = m.querySelector('.overlayEdit');
            const mouseDeleteInstructions = m.querySelector('.mouseDeleteInstructions');
            const longPressText = m.querySelector('.stickyLongPressText');
            mouseDeleteInstructions.classList.remove('no_edit');
            // backwards compatibility:
            if (!params || typeof params !== 'object') {
                params = {
                    message: arguments[0],
                    backgroundColor: arguments[1],
                    forceShow: arguments[2],
                    noDelete: arguments[3],
                    type: arguments[4],
                };
            }
            let message = params.message, backgroundColor = params.backgroundColor;
            const type = params.type, noEdit = params.noEdit, forceShow = params.forceShow, noDelete = params.noDelete;
            if (!forceShow && !message) {
                mi.innerHTML = '';
                m.style.display = 'none';
                if (overlayTrashCan)
                    overlayTrashCan.style.display = 'none';
                if (overlayEdit)
                    overlayEdit.style.display = 'none';
                if (mouseDeleteInstructions)
                    mouseDeleteInstructions.style.display = 'none';
                if (longPressText)
                    longPressText.style.display = 'none';
            }
            else {
                if (!message)
                    message = '';
                if (backgroundColor === 'auto')
                    backgroundColor = this.defaultColor;
                if (forceShow && !message) {
                    mi.style.backgroundColor = '';
                    mi.style.color = '';
                    mi.style.display = 'none';
                }
                else if (backgroundColor) {
                    mi.style.backgroundColor = backgroundColor;
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                    mi.style.color = CIQ.chooseForegroundColor(backgroundColor);
                    mi.style.display = 'inline-block';
                }
                else {
                    mi.style.backgroundColor = '';
                    mi.style.color = '';
                    mi.style.display = 'inline-block';
                }
                // This line ony changed
                const nameObj = prepareIndicatorName(message);
                mi.innerHTML = nameObj.bars ? `${nameObj.name} (${nameObj.bars})` : nameObj.name;
                const rtClick = m.querySelector('.mStickyRightClick');
                rtClick.className = 'mStickyRightClick'; // reset
                if (type)
                    rtClick.classList.add(`rightclick_${type}`);
                rtClick.style.display = '';
                m.style.display = 'inline-block';
                if (noDelete || this.bypassRightClick === true || this.bypassRightClick[type]) {
                    rtClick.style.display = 'none';
                }
                else if (this.highlightViaTap || this.touches.length) {
                    if (overlayTrashCan)
                        overlayTrashCan.style.display = 'inline-block';
                    if (overlayEdit && !noEdit)
                        overlayEdit.style.display = 'inline-block';
                    if (mouseDeleteInstructions)
                        mouseDeleteInstructions.style.display = 'none';
                    if (longPressText)
                        longPressText.style.display = 'none';
                    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                    CIQ[`${message === '' ? '' : 'un'}appendClassName`](m, 'hide');
                }
                else {
                    if (noEdit)
                        mouseDeleteInstructions.classList.add('no_edit');
                    if (mouseDeleteInstructions)
                        mouseDeleteInstructions.style.display = 'block';
                    if (longPressText) {
                        longPressText.style.display = 'none';
                        const drag = this.preferences.dragging;
                        if (drag && params.panel && !params.panel.noDrag) {
                            if ((drag === true || drag.study) && type === 'study') {
                                longPressText.style.display = 'block';
                            }
                            else if ((drag === true || drag.series) && type === 'series') {
                                longPressText.style.display = 'block';
                            }
                        }
                    }
                }
                this.positionSticky(m);
            }
        };
        // In some cases we faced some cases that color1 or color2 get undefined
        // and this cause the application to crash, as a result, we we set below
        // condition to slient that error
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.colorsEqual = function (color1: any, color2: any) {
            if (!color2 || !color1 || typeof color1 !== 'string' || typeof color2 !== 'string') {
                return false;
            } // Modified by SmartChart team
            if (color1 === color2)
                return true;
            if (!color1 && !color2)
                return true;
            if (!color1 || !color2)
                return false;
            if (color1 === 'transparent')
                color1 = 'rgba(0,0,0,0)';
            if (color2 === 'transparent')
                color2 = 'rgba(0,0,0,0)';
            const alpha = /^rgba\(.*,(.+)\)/;
            let rgba1 = color1.match(alpha);
            let rgba2 = color2.match(alpha);
            rgba1 = rgba1 ? parseFloat(rgba1[1]) : 1;
            rgba2 = rgba2 ? parseFloat(rgba2[1]) : 1;
            if (rgba1 !== rgba2)
                return false;
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            const first = CIQ.colorToHex(color1);
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            const second = CIQ.colorToHex(color2);
            return first.toLowerCase() === second.toLowerCase();
        };
        const { symbol, chartType, granularity, requestAPI, requestSubscribe, requestForget, requestForgetStream, isMobile, enableRouting, onMessage, settings, onSettingsChange, getMarketsOrder, initialData, feedCall, } = props;
        this.feedCall = feedCall || {};
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'BinaryAPI' is not assignable to type 'null'.
        this.api = new BinaryAPI(requestAPI, requestSubscribe, requestForget, requestForgetStream);
        // trading times and active symbols can be reused across multiple charts
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
        this.tradingTimes =
            ChartStore.tradingTimes ||
                (ChartStore.tradingTimes = new TradingTimes(this.api, {
                    enable: this.feedCall.tradingTimes,
                    shouldFetchTradingTimes: this.mainStore.state.shouldFetchTradingTimes,
                    initialData: initialData?.tradingTimes,
                }));
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'activeSymbols' is a static member of typ... Remove this comment to see the full error message
        this.activeSymbols =
            ChartStore.activeSymbols ||
                // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
                (ChartStore.activeSymbols = new ActiveSymbols(this.api, this.tradingTimes, {
                    enable: this.feedCall.activeSymbols,
                    getMarketsOrder,
                    initialData: initialData?.activeSymbols,
                }));
        const { chartSetting } = this.mainStore;
        chartSetting.setSettings(settings);
        chartSetting.onSettingsChange = onSettingsChange;
        this.isMobile = isMobile;
        this.state = this.mainStore.state;
        this.mainStore.notifier.onMessage = onMessage;
        this.granularity = granularity !== undefined ? granularity : this.defaults.granularity;
        const engineParams = {
            maxMasterDataSize: this.getMaxMasterDataSize(this.granularity),
            markerDelay: null,
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            container: this.rootNode.querySelector('.chartContainer'),
            controls: { chartControls: null },
            yaxisLabelStyle: 'roundRect',
            preferences: {
                currentPriceLine: true,
                whitespace: isMobile ? 50 : 150,
            },
            chart: {
                yAxis: {
                    // Put some top margin so chart doesn't get blocked by chart title
                    initialMarginTop: this.stateStore.yAxisMargin.top,
                    initialMarginBottom: this.stateStore.yAxisMargin.bottom,
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
            yTolerance: 999999,
        };
        let chartLayout = {
            chartType: chartType || this.defaults.chartType,
        };
        if (chartLayout.chartType === 'spline') {
            // cause there's no such thing as spline chart in ChartIQ
            chartLayout.chartType = 'mountain';
            (engineParams.chart as any).tension = (chartLayout as any).tension = 0.5;
        }
        const rangeSpan = this.getRangeSpan();
        if (rangeSpan) {
            chartLayout = { ...chartLayout, ...rangeSpan };
        }
        (engineParams as any).layout = chartLayout;
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        const stxx = (this.stxx = new CIQ.ChartEngine(engineParams));
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
        stxx.animations.zoom.run = (fc: any, startValues: any, endValues: any) => {
            if (wheelInMotion)
                return;
            wheelInMotion = true;
            setTimeout(() => {
                wheelInMotion = false;
            }, 40);
            return org_run(fc, startValues, endValues);
        };
        /**
         * We got the error of `Cannot read property 't2' of undefined`
         * that we coun't reproduce and after contacting ChartIQ support
         * we still couldn't determind why this issue happen, as a result
         * this peice of code is to makes that error slient.
         */
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        stxx.prepend('touchmove', function (this: any, this: any, this: any) {
            if (this.grabStartValues && this.grabStartValues.t2 && this.grabStartValues.t1)
                return false; // continue
            return true; // exit
        });
        stxx.isAutoScale = settings && settings.isAutoScale !== false;
        ChartStore.chartCount += 1;
        const deleteElement = stxx.chart.panel.holder.parentElement.querySelector('.mouseDeleteText');
        const manageElement = stxx.chart.panel.holder.parentElement.querySelector('.mouseManageText');
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        deleteElement.textContent = t.translate('Right click to delete');
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        manageElement.textContent = t.translate('Right click to manage');
        if (this.state.isAnimationEnabled)
            animateChart(stxx, { stayPut: true });
        // stxx.chart.lockScroll = true;
        // connect chart to data
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
        this.feed = new Feed(this.api, stxx, this.mainStore, this.tradingTimes);
        stxx.attachQuoteFeed(this.feed, {
            refreshInterval: null,
        });
        this.enableRouting = enableRouting;
        if (this.enableRouting) {
            this.routingStore.handleRouting();
        }
        this.holderStyle = stxx.chart.panel.holder.style;
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 3 arguments, but got 2.
        const context = new Context(stxx, this.rootNode);
        // only one instance of keystrokeHub should exist
        if (ChartStore.keystrokeHub === undefined) {
            ChartStore.keystrokeHub = new KeystrokeHub(document.body, null, {
                cb: KeystrokeHub.defaultHotKeys,
            });
        }
        // TODO: excluded studies
        stxx.addEventListener('studyOverlayEdit', this.studiesStore.editStudy);
        stxx.addEventListener('studyPanelEdit', this.studiesStore.editStudy);
        this.stateStore.stateChange(STATE.INITIAL);
        this.loader.setState('market-symbol');
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'activeSymbols' is a static member of typ... Remove this comment to see the full error message
        this.activeSymbols.retrieveActiveSymbols().then(() => {
            this.loader.setState('trading-time');
            // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
            this.tradingTimes.initialize().then(action(() => {
                // In the odd event that chart is destroyed by the time
                // the request finishes, just calmly return...
                if (stxx.isDestroyed) {
                    return;
                }
                const isRestoreSuccess = this.state.restoreLayout();
                this.loadChartWithInitalData(symbol, initialData?.masterData);
                if (!isRestoreSuccess) {
                    this.changeSymbol(
                    // default to first available symbol
                    // @ts-expect-error ts-migrate(2576) FIXME: Property 'activeSymbols' is a static member of typ... Remove this comment to see the full error message
                    symbol || Object.keys(this.activeSymbols.symbolMap)[0], this.granularity);
                }
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'Context' is not assignable to type 'null'.
                this.context = context;
                this.chartClosedOpenThemeChange(!this.currentActiveSymbol.exchange_is_open);
                this.mainStore.chart.tradingTimes.onMarketOpenCloseChanged(action((changes: any) => {
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
                reaction(() => [this.state.symbol, this.state.granularity], () => {
                    if (this.state.symbol !== undefined || this.state.granularity !== undefined) {
                        this.changeSymbol(this.state.symbol, this.state.granularity);
                    }
                });
                // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
                this.tradingTimes.onMarketOpenCloseChanged(this.onMarketOpenClosedChange);
                // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
                this.tradingTimes.onTimeChanged(this.onServerTimeChange);
                setTimeout(action(() => {
                    // Defer the render of the dialogs and dropdowns; this enables
                    // considerable performance improvements for slower devices.
                    this.shouldRenderDialogs = true;
                }), 500);
            }));
        });
    }
    setResizeEvent = () => {
        if ('ResizeObserver' in window) {
            // @ts-expect-error ts-migrate(2693) FIXME: 'ResizeObserver' only refers to a type, but is bei... Remove this comment to see the full error message
            this.resizeObserver = new ResizeObserver(this.resizeScreen);
            this.resizeObserver.observe(this.rootNode);
        }
        else {
            import(/* webpackChunkName: "resize-observer-polyfill" */ 'resize-observer-polyfill').then(({ default: ResizeObserver }) => {
                (window as any).ResizeObserver = ResizeObserver;
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                if (this.stxx.isDestroyed || !this.rootNode) {
                    return;
                }
                this.resizeObserver = new ResizeObserver(this.resizeScreen);
                this.resizeObserver.observe(this.rootNode);
            });
        }
    };
    onMarketOpenClosedChange = (changes: any) => {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        const symbolObjects = this.stxx.getSymbols().map((item: any) => item.symbolObject);
        let shouldRefreshChart = false;
        for (const { symbol, name } of symbolObjects) {
            if (symbol in changes) {
                if (changes[symbol]) {
                    shouldRefreshChart = true;
                    this.chartClosedOpenThemeChange(false);
                    this.mainStore.notifier.notifyMarketOpen(name);
                }
                else {
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
    getMaxMasterDataSize(granularity: any) {
        let maxMasterDataSize = 5000;
        // When granularity is 1 day
        if (granularity === 86400)
            maxMasterDataSize = Math.floor(2.8 * 365);
        // When granularity is 8 hours
        else if (granularity === 28800)
            maxMasterDataSize = Math.floor(2.8 * 365 * 3);
        return maxMasterDataSize;
    }
    chartClosedOpenThemeChange(isChartClosed: any) {
        this.mainStore.state.setChartClosed(isChartClosed);
        this.mainStore.state.setChartTheme(this.mainStore.chartSetting.theme, isChartClosed);
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get categorizedSymbols() {
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'activeSymbols' is a static member of typ... Remove this comment to see the full error message
        if (!this.activeSymbols || this.activeSymbols.categorizedSymbols.length === 0)
            return [];
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'activeSymbols' is a static member of typ... Remove this comment to see the full error message
        const activeSymbols = this.activeSymbols.activeSymbols;
        return cloneCategories(activeSymbols, item => {
            const selected = item.dataObject.symbol === this.currentActiveSymbol.symbol;
            return {
                ...item,
                selected,
            };
        });
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onServerTimeChange() {
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
        this.serverTime = moment(this.tradingTimes._serverTime.getEpoch() * 1000).format('DD MMM YYYY HH:mm:ss [GMT]');
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onMouseEnter() {
        this.cursorInChart = true;
        /*
         * Disable key press events for chart until we can get it not to
         * interfere with key presses outside the chart:
         */
        // ChartStore.keystrokeHub.setActiveContext(this.context);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onMouseLeave() {
        this.cursorInChart = false;
        /*
         * Disable key press events for chart until we can get it not to
         * interfere with key presses outside the chart:
         */
        // ChartStore.keystrokeHub.setActiveContext(null);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateCurrentActiveSymbol() {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        const { symbolObject } = this.stxx.chart;
        this.currentActiveSymbol = symbolObject;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.chart.yAxis.decimalPlaces = symbolObject.decimal_places;
        this.setMainSeriesDisplay(symbolObject.name);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setChartAvailability(status: any) {
        this.isChartAvailable = status;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    changeSymbol(symbolObj: any, granularity: any) {
        if (!this.stxx)
            return;
        if (typeof symbolObj === 'string') {
            // @ts-expect-error ts-migrate(2576) FIXME: Property 'activeSymbols' is a static member of typ... Remove this comment to see the full error message
            symbolObj = this.activeSymbols.getSymbolObj(symbolObj);
        }
        const isSymbolAvailable = symbolObj && this.currentActiveSymbol;
        if (isSymbolAvailable &&
            symbolObj.symbol === this.currentActiveSymbol.symbol &&
            granularity !== undefined &&
            granularity === this.granularity) {
            return;
        }
        let params;
        if (granularity !== undefined) {
            this.granularity = granularity;
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.maxMasterDataSize = this.getMaxMasterDataSize(this.granularity);
            params = { periodicity: calculateTimeUnitInterval(granularity) };
        }
        if (params === undefined && symbolObj) {
            // Remove comparisons before symbol changes
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            for (const field in this.stxx.chart.series) {
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                this.stxx.removeSeries(field);
            }
        }
        this.newChart(symbolObj, params);
        if (symbolObj) {
            this.updateCurrentActiveSymbol();
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    calculateYaxisWidth = (price: any) => {
        if (!price)
            return;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        const { context } = this.context.stx.chart;
        const priceWidth = context.measureText(price.toFixed(this.pip)).width + 20;
        if (priceWidth > this.yAxiswidth) {
            this.yAxiswidth = priceWidth;
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.chart.yAxis.width = priceWidth;
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.calculateYAxisPositions();
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.draw();
        }
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateYaxisWidth = () => {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (this.stxx && this.stxx.masterData && this.stxx.masterData.length) {
            if (this.currentCloseQuote() && this.currentCloseQuote().Close) {
                this.calculateYaxisWidth(this.currentCloseQuote().Close);
            }
        }
    };
    // Calling newChart with symbolObj as undefined refreshes the chart
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    newChart(symbolObj = this.currentActiveSymbol, params: any) {
        if (!symbolObj)
            return;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.chart.symbolDisplay = symbolObj.name;
        this.loader.show();
        this.mainStore.state.setChartIsReady(false);
        const onChartLoad = (err: any) => {
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
            this.state.restoreDrawings();
            if (this.mainStore.chart.feed) {
                this.mainStore.chart.feed.scaleChart();
            }
        };
        this.yAxiswidth = 0;
        const rangeSpan = this.getRangeSpan();
        const parameters = {
            masterData: null,
            chart: null,
        };
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.extend(parameters, { ...params, ...rangeSpan }, true);
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.loadChart(symbolObj, parameters, onChartLoad);
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
    loadChartWithInitalData(symbol: any, masterData: any) {
        if (!masterData)
            return;
        const layoutData = createObjectFromLocalStorage(`layout-${this.chartId}`);
        if (!layoutData || !layoutData.symbols.length)
            return;
        const layout_symbol = layoutData.symbols[0].symbol;
        if (!(symbol || layout_symbol)) {
            console.error('symbol is not specificed, without it, chart is unable to be loaded!');
            return;
        }
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.loadChart(symbol || layout_symbol, {
            masterData,
            periodicity: {
                period: layoutData.periodicity,
                interval: layoutData.interval,
                timeUnit: layoutData.timeUnit,
            },
        }, () => {
            this.loader.hide();
        });
    }
    remainLabelY = () => {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        const stx = this.context.stx;
        const topPos = 36;
        const labelHeight = 24;
        const bottomPos = 66;
        let y = stx.chart.currentPriceLabelY + labelHeight;
        if (stx.chart.currentPriceLabelY > stx.chart.panel.bottom - bottomPos) {
            y = stx.chart.panel.bottom - bottomPos;
            y = y < stx.chart.currentPriceLabelY - labelHeight ? y : stx.chart.currentPriceLabelY - labelHeight;
        }
        else if (stx.chart.currentPriceLabelY < stx.chart.panel.top) {
            y = topPos;
        }
        return y;
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setYaxisWidth = (width: any) => {
        this.yAxiswidth = width || this.yAxiswidth;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.chart.yAxis.width = width || this.yAxiswidth;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.calculateYAxisPositions();
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        this.stxx.draw();
    };
    getRangeSpan() {
        const { startEpoch, endEpoch } = this.state;
        let range, span;
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        const paddingRatio = this.chartNode.clientWidth / this.RANGE_PADDING_PX;
        const elapsedSeconds = (endEpoch || startEpoch) - (startEpoch || endEpoch);
        const epochPadding = (elapsedSeconds / paddingRatio) | 0;
        if (startEpoch || endEpoch) {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            const dtLeft = startEpoch ? CIQ.strToDateTime(getUTCDate(startEpoch - epochPadding)) : undefined;
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
            const dtRight = endEpoch ? CIQ.strToDateTime(getUTCDate(endEpoch + epochPadding)) : undefined;
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
    setMainSeriesDisplay(name: any) {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (this.stxx && this.stxx.chart) {
            // Set display name of main series (to be shown in crosshair tooltip)
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.chart.seriesRenderers._main_series.seriesParams[0].display = name;
            // TODO, we use to use `field` field to recgnize main seris and show
            // it's crosshair, as in ChartIQ 6.2.2 they are going to remove this field
            // we should find another way of detecting main series price, till then
            // we found this temporary solution.
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.chart.seriesRenderers._main_series.seriesParams[0].field = 'Close';
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateScaledOneOne(state: any) {
        this.isScaledOneOne = state;
    }
    // Makes requests to tick history API that will replace
    // Existing chart tick/ohlc data
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    refreshChart() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
        this.newChart();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    destroy() {
        ChartStore.chartCount -= 1;
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
        if (this.tradingTimes && ChartStore.chartCount === 0) {
            ChartStore.tradingTimes = null;
            // @ts-expect-error ts-migrate(2576) FIXME: Property 'tradingTimes' is a static member of type... Remove this comment to see the full error message
            this.tradingTimes.destructor();
        }
        // Destroying the chart does not unsubscribe the streams;
        // we need to manually unsubscribe them.
        if (this.feed) {
            this.feed.unsubscribeAll();
            this.feed = null;
        }
        if (ChartStore.keystrokeHub && ChartStore.keystrokeHub.context === this.context) {
            ChartStore.keystrokeHub.setActiveContext(null);
        }
        if (this.stxx) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.container.removeEventListener('mouseenter', this.onMouseEnter);
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.container.removeEventListener('mouseleave', this.onMouseLeave);
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.updateChartData = function () { }; // prevent any data from entering the chart
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.isDestroyed = true;
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            this.stxx.destroy();
            this.stxx = null;
        }
        this.currentActiveSymbol = null;
        this.contextPromise = null;
        this.context = null;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    openFullscreen() {
        const isInFullScreen = (document.fullscreenElement && document.fullscreenElement !== null) ||
            ((document as any).webkitFullscreenElement && (document as any).webkitFullscreenElement !== null) ||
            ((document as any).mozFullScreenElement && (document as any).mozFullScreenElement !== null) ||
            // @ts-expect-error ts-migrate(2551) FIXME: Property 'msFullscreenElement' does not exist on t... Remove this comment to see the full error message
            (document.msFullscreenElement && document.msFullscreenElement !== null);
        const docElm = this.rootNode;
        if (!isInFullScreen) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            if (docElm.requestFullscreen) {
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                docElm.requestFullscreen();
            }
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            else if (docElm.mozRequestFullScreen) {
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                docElm.mozRequestFullScreen();
            }
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            else if (docElm.webkitRequestFullScreen) {
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                docElm.webkitRequestFullScreen();
            }
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            else if (docElm.msRequestFullscreen) {
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                docElm.msRequestFullscreen();
            }
        }
        else if (document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        }
        else if ((document as any).mozCancelFullScreen) {
            (document as any).mozCancelFullScreen();
        }
        // @ts-expect-error ts-migrate(2551) FIXME: Property 'msExitFullscreen' does not exist on type... Remove this comment to see the full error message
        else if (document.msExitFullscreen) {
            // @ts-expect-error ts-migrate(2551) FIXME: Property 'msExitFullscreen' does not exist on type... Remove this comment to see the full error message
            document.msExitFullscreen();
        }
    }
}
export default ChartStore;
