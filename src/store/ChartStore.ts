/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-this-alias */
import { action, computed, observable, reaction } from 'mobx';
import moment from 'moment';
import MainStore from '.';
import DownIcon from '../../sass/icons/chart/ic-down.svg';
import MaximizeIcon from '../../sass/icons/chart/ic-maximize.svg';
import ResizeIcon from '../../sass/icons/chart/resize-icon.svg';
import DeleteIcon from '../../sass/icons/delete/ic-delete.svg';
import EditIcon from '../../sass/icons/edit/ic-edit.svg';
import HomeIcon from '../../sass/icons/navigation-widgets/ic-home.svg';
import { ActiveSymbols, BinaryAPI, TradingTimes } from '../binaryapi';
import { TProcessedSymbolItem, TSubCategoryDataItem } from '../binaryapi/ActiveSymbols';
import inject from '../chartiq_injections';
import animateChart from '../components/ui/Animation';
import Context from '../components/ui/Context';
import KeystrokeHub from '../components/ui/KeystrokeHub';
import { STATE } from '../Constant';
import { Feed } from '../feed';
import plotSpline from '../SplinePlotter';
import { IPendingPromise, TChanges, TChartProps, TGranularity, TNetworkConfig, TQuote, TRatio } from '../types';
import {
    calculateTimeUnitInterval,
    cloneCategories,
    createObjectFromLocalStorage,
    getUTCDate,
    prepareIndicatorName,
    renderSVGString,
} from '../utils';
import PendingPromise from '../utils/PendingPromise';
import BarrierStore from './BarrierStore';
import ChartState from './ChartState';

type TDefaults = {
    granularity: TGranularity;
    chartType: string;
};

type TRange = {
    dtLeft?: Date;
    dtRight?: Date;
    padding?: number;
    chart?: typeof CIQ.ChartEngine.Chart;
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
    chart?: typeof CIQ.ChartEngine.Chart;
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
    chart?: typeof CIQ.ChartEngine.Chart;
};
type TDisplayStickyParams = {
    message?: string;
    backgroundColor?: string;
    forceShow?: boolean;
    noDelete?: boolean;
    noEdit?: boolean;
    type?: string;
    positioner?: (ref: Element) => void;
    panel?: typeof CIQ.ChartEngine.Panel;
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
    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
    }
    feedCall: { tradingTimes?: boolean; activeSymbols?: boolean } = {};
    RANGE_PADDING_PX = 125;
    contextPromise: IPendingPromise<Context, void> | null = PendingPromise<Context, void>();
    rootNode: (HTMLElement & { CIQ: typeof CIQ }) | null = null;
    stxx: typeof CIQ.ChartEngine | null = null;
    api: BinaryAPI | null = null;
    defaults: TDefaults = {
        granularity: 0,
        chartType: 'mountain',
    };
    granularity: TGranularity;
    enableRouting?: boolean | null = null;
    chartNode?: HTMLElement | null = null;
    chartControlsNode?: HTMLElement | null = null;
    holderStyle?: React.CSSProperties;
    state?: ChartState;
    onMessage = null;
    defaultMinimumBars = 5;
    _barriers: BarrierStore[] = [];
    @observable
    containerWidth: number | null = null;
    @observable
    context: Context | null = null;
    @observable
    currentActiveSymbol?: TProcessedSymbolItem | null;
    @observable
    isChartAvailable = true;
    @observable
    chartHeight?: number;
    @observable
    chartContainerHeight?: number;
    @observable
    isMobile?: boolean = false;
    @observable
    isScaledOneOne = false;
    @observable
    cursorInChart = false;
    @observable
    shouldRenderDialogs = false;
    @observable
    yAxiswidth = 0;
    @observable
    serverTime?: string;
    @observable
    networkStatus?: TNetworkConfig;

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
    @computed
    get pip() {
        return this.currentActiveSymbol?.decimal_places;
    }
    get rootElement() {
        return this.chartId ? document.getElementById(this.chartId) : null;
    }
    currentCloseQuote = (): TQuote | null => {
        if (!this.stxx) {
            return null;
        }
        let currentQuote = this.stxx.currentQuote();
        if (currentQuote && !currentQuote.Close) {
            const dataSegmentClose = [...this.stxx.chart.dataSegment].filter(item => item && item.Close);
            if (dataSegmentClose && dataSegmentClose.length) {
                currentQuote = dataSegmentClose[dataSegmentClose.length - 1];
            } else {
                const dataSetClose = [...this.stxx.chart.dataSet].filter(item => item && item.Close);
                if (dataSetClose && dataSetClose.length) {
                    currentQuote = dataSetClose[dataSetClose.length - 1];
                }
            }
        }
        return currentQuote;
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
        if (!this.stxx) {
            return;
        }

        if (this.stxx.slider) {
            this.stxx.slider.display(this.stxx.layout.rangeSlider);
        }

        this.stxx.resizeChart();
    };
    @action.bound addDeleteElement = () => {
        const deleteElement = this.stxx.chart.panel.holder.parentElement.querySelector('.mouseDeleteText');
        deleteElement.textContent = t.translate('Right click to delete');
    };
    @action.bound addManageElement = () => {
        const manageElement = this.stxx.chart.panel.holder.parentElement.querySelector('.mouseManageText');
        manageElement.textContent = t.translate('Right click to manage');
    };
    @action.bound resizeScreen() {
        if (!this.context) {
            return;
        }

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
        if (window.CIQ) {
            this._initChart(rootNode, props);
        } else {
            import(/* webpackChunkName: "chartiq" */ 'chartiq' as string).then(
                action(({ CIQ, SplinePlotter }) => {
                    CIQ.ChartEngine.htmlControls.baselineHandle = `<div class="stx-baseline-handle" style="display: none;">${renderSVGString(
                        ResizeIcon
                    )}</div>`;
                    CIQ.ChartEngine.htmlControls.iconsTemplate = `<div class="stx-panel-control"><div class="stx-panel-title"></div><div class="stx-btn-panel stx-show"><span class="stx-ico-up">${renderSVGString(
                        DownIcon
                    )}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-down">${renderSVGString(
                        DownIcon
                    )}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-focus">${renderSVGString(
                        MaximizeIcon
                    )}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-edit">${renderSVGString(
                        EditIcon
                    )}</span></div><div class="stx-btn-panel stx-show"><span class="stx-ico-close">${renderSVGString(
                        DeleteIcon
                    )}</span></div></div>`;
                    CIQ.ChartEngine.htmlControls.mSticky = `<div class="stx_sticky"> <span class="mStickyInterior"></span> <span class="mStickyRightClick"><span class="overlayEdit stx-btn" style="display:none"><span class="ic-edit">${renderSVGString(
                        EditIcon
                    )}</span><span class="ic-delete">${renderSVGString(
                        DeleteIcon
                    )}</span></span> <span class="overlayTrashCan stx-btn" style="display:none"><span class="ic-edit">${renderSVGString(
                        EditIcon
                    )}</span><span class="ic-delete">${renderSVGString(
                        DeleteIcon
                    )}</span></span> <span class="mouseDeleteInstructions"><span class="mouseDeleteText">Right click to delete</span><span class="mouseManageText">Right click to manage</span></span></span></div>`;
                    CIQ.ChartEngine.htmlControls.home = `<div class="stx_jump_today" style="display:none">${renderSVGString(
                        HomeIcon
                    )}</div>`;
                    window.CIQ = CIQ;
                    SplinePlotter.plotSpline = plotSpline;
                    this._initChart(rootNode, props);
                })
            );
        }
    };
    @action.bound
    _initChart(rootNode: HTMLElement | null, props: React.PropsWithChildren<TChartProps>) {
        const _self = this;
        // Add custom injections to the CIQ
        inject({
            drawToolsStore: this.mainStore.drawTools,
        });
        CIQ.extend(CIQ.Studies.studyLibrary.Detrended, {
            calculateFN(stx: typeof CIQ.ChartEngine, sd: typeof CIQ.Studies.StudyDescriptor) {
                const quotes = sd.chart.scrubbed;
                if (quotes.length < sd.days + 1) {
                    sd.error = true;
                    return;
                }
                let field = sd.inputs.Field;
                if (!field || field === 'field') field = 'Close';
                const offset = Math.floor(sd.days / 2 + 1);
                CIQ.Studies.MA(sd.inputs['Moving Average Type'], sd.days, field, -offset, 'MA', stx, sd);
                let days = Math.max(sd.days - offset - 1, sd.startFrom - offset);
                if (days < 0) days = 0;
                for (let i = days; i < quotes.length - offset; i++) {
                    let val = quotes[i][field];
                    if (val && typeof val === 'object') val = val[sd.subField];
                    const maVal = quotes[i][`MA ${sd.name}`];
                    if ((val || val === 0) && (maVal || maVal === 0)) quotes[i][`Result ${sd.name}`] = val - maVal;
                }
            },
        });
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
                        el.classList.add(control);
                    }
                }
            }
            const chartControls = this.controls.chartControls,
                home = this.controls.home;
            if (chartControls) {
                const zoomIn = this.container.querySelector('.stx-zoom-in', chartControls);
                const zoomOut = this.container.querySelector('.stx-zoom-out', chartControls);
                CIQ.safeClickTouch(
                    zoomIn,
                    (function (self) {
                        return function (e: Event) {
                            self.zoomIn(e);
                            e.stopPropagation();
                        };
                    })(this)
                );
                CIQ.safeClickTouch(
                    zoomOut,
                    (function (self) {
                        return function (e: Event) {
                            self.zoomOut(e);
                            e.stopPropagation();
                        };
                    })(this)
                );
                if (!CIQ.touchDevice) {
                    this.makeModal(zoomIn);
                    this.makeModal(zoomOut);
                }
            }
            if (home) {
                CIQ.safeClickTouch(
                    home,
                    (function (self) {
                        return function (e: Event) {
                            e.stopPropagation();
                            self.home({ animate: true });
                        };
                    })(this)
                );
                if (!CIQ.touchDevice) {
                    this.makeModal(home);
                }
            }
        };
        CIQ.ChartEngine.prototype.home = function (params: THomeParams) {
            this.swipe.amplitude = 0;
            const layout = this.layout;
            if (typeof params !== 'object') {
                // backward compatibility
                params = {
                    maintainWhitespace: params,
                };
            }
            function resetPanelZooms(stx: Context['stx']) {
                for (const p in stx.panels) {
                    const yAxes = stx.panels[p].yaxisLHS.concat(stx.panels[p].yaxisRHS);
                    for (let a = 0; a < yAxes.length; a++) stx.calculateYAxisMargins(yAxes[a]);
                }
            }
            function scrollToCallback(
                self: typeof CIQ.ChartEngine,
                chart: typeof CIQ.ChartEngine.Chart,
                exactScroll: number
            ) {
                return function () {
                    resetPanelZooms(self);
                    chart.scroll = exactScroll;
                    self.draw();
                };
            }
            if (typeof params.maintainWhitespace === 'undefined') params.maintainWhitespace = true; // maintain the whitespace unless set to false
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
                if (params.maintainWhitespace && this.preferences.whitespace >= 0) {
                    whitespace = this.preferences.whitespace;
                }
                if (params.whitespace || params.whitespace === 0) whitespace = params.whitespace;
                const leftMargin = this.getLabelOffsetInPixels(chart, layout.chartType);
                if (leftMargin > whitespace) whitespace = leftMargin;
                let exactScroll = Math.min(barsDisplayedOnScreen, chart.dataSet.length); // the scroll must be the number of bars you want to see.
                if (this.chart.allowScrollPast) exactScroll = barsDisplayedOnScreen; // If whitespace allowed on left of screen
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
                    exactScroll = Math.floor(exactScroll * 0.8); // eslint-disable-line
                } else if (this.isHistoricalMode()) {
                    exactScroll = Math.floor(exactScroll * 0.9); // eslint-disable-line
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
        CIQ.ChartEngine.prototype.getNearestCloseQuote = function () {
            return _self.currentCloseQuote();
        };
        this.rootNode = rootNode as (HTMLElement & { CIQ: typeof CIQ }) | null;

        this.chartNode = this.rootNode?.querySelector('.ciq-chart-area');

        this.chartControlsNode = this.rootNode?.querySelector('.cq-chart-controls');
        CIQ.Plotter.prototype.getYAxisWidth = () => this.yAxiswidth;
        // monkey patching to handle radius and height for `current price label`
        CIQ.ChartEngine.prototype.createYAxisLabel = function (
            panel: typeof CIQ.ChartEngine.Panel,
            txt: string,
            y: number,
            backgroundColor: string,
            color: string,
            ctx?: CanvasRenderingContext2D,
            yAxis?: typeof CIQ.ChartEngine.YAxis
        ) {
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
            } catch (e) {
                width = yax.width;
            } // Firefox doesn't like this in hidden iframe
            // some y-axis label has style of `roundRectArrow` and some has `rect`, we reduce
            // 14px which is about the `roundRectArrow` style arrow to make the label all fit
            width -= 14;
            if (this.chart.yAxis.width < width) {
                this.chart.yAxis.width = width;
                this.calculateYAxisPositions();
            } else {
                width = this.chart.yAxis.width;
            }
            let x = this.width - this.chart.yAxis.width;
            let left = (width - textWidth) / 2;
            if (yax.width < 0) x += yax.width - width;
            const position = yax.position === null ? panel.chart.yAxis.position : yax.position;
            if (position === 'left') {
                width *= -1;
                if (yax.width < 0) x -= yax.width + width;
                radius = -3;
                context.textAlign = 'right';
            }
            if (y + height / 2 > yax.bottom) y = yax.bottom - height / 2;
            if (y - height / 2 < yax.top) y = yax.top + height / 2;
            if (typeof CIQ[this.yaxisLabelStyle] === 'undefined') {
                this.yaxisLabelStyle = 'roundRectArrow'; // in case of user error, set a default.
            }
            let yaxisLabelStyle = this.yaxisLabelStyle;
            if (yax.yaxisLabelStyle) yaxisLabelStyle = yax.yaxisLabelStyle;
            // as crosshair and countdown style is `rect`, so due to previous rule we should
            // increase there x position to fit the y-axis
            x += 1;
            if (this.labelType === 'currentSpot') {
                x += 13;
                left -= 8;
                radius = 0;
            } else if (this.labelType === 'crosshair') {
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
            CIQ[yaxisLabelStyle](params);
        };
        CIQ.ChartEngine.prototype.displaySticky = function (params: TDisplayStickyParams) {
            const m = this.controls.mSticky;
            if (!m) return;
            const mi = m.querySelector('.mStickyInterior');
            if (!mi) return;
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
            let message = params.message,
                backgroundColor = params.backgroundColor;
            const type = params.type,
                noEdit = params.noEdit,
                forceShow = params.forceShow,
                noDelete = params.noDelete;
            if (!forceShow && !message) {
                mi.innerHTML = '';
                m.style.display = 'none';
                if (overlayTrashCan) overlayTrashCan.style.display = 'none';
                if (overlayEdit) overlayEdit.style.display = 'none';
                if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = 'none';
                if (longPressText) longPressText.style.display = 'none';
            } else {
                if (!message) message = '';
                if (backgroundColor === 'auto') backgroundColor = this.defaultColor;
                if (forceShow && !message) {
                    mi.style.backgroundColor = '';
                    mi.style.color = '';
                    mi.style.display = 'none';
                } else if (backgroundColor) {
                    mi.style.backgroundColor = backgroundColor;
                    mi.style.color = CIQ.chooseForegroundColor(backgroundColor);
                    mi.style.display = 'inline-block';
                } else {
                    mi.style.backgroundColor = '';
                    mi.style.color = '';
                    mi.style.display = 'inline-block';
                }
                // This line ony changed
                const nameObj = prepareIndicatorName(message);
                mi.innerHTML = nameObj.bars ? `${nameObj.name} (${nameObj.bars})` : nameObj.name;
                const rtClick = m.querySelector('.mStickyRightClick');
                rtClick.className = 'mStickyRightClick'; // reset
                if (type) rtClick.classList.add(`rightclick_${type}`);
                rtClick.style.display = '';
                m.style.display = 'inline-block';
                if (noDelete || this.bypassRightClick === true || this.bypassRightClick[type as string]) {
                    rtClick.style.display = 'none';
                } else if (this.highlightViaTap || this.touches.length) {
                    if (overlayTrashCan) overlayTrashCan.style.display = 'inline-block';
                    if (overlayEdit && !noEdit) overlayEdit.style.display = 'inline-block';
                    if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = 'none';
                    if (longPressText) longPressText.style.display = 'none';
                    CIQ[`${message === '' ? '' : 'un'}appendClassName`](m, 'hide');
                } else {
                    if (noEdit) mouseDeleteInstructions.classList.add('no_edit');
                    if (mouseDeleteInstructions) mouseDeleteInstructions.style.display = 'block';
                    if (longPressText) {
                        longPressText.style.display = 'none';
                        const drag = this.preferences.dragging;
                        if (drag && params.panel && !params.panel.noDrag) {
                            if ((drag === true || drag.study) && type === 'study') {
                                longPressText.style.display = 'block';
                            } else if ((drag === true || drag.series) && type === 'series') {
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
        CIQ.colorsEqual = function (color1: string, color2: string) {
            if (!color2 || !color1 || typeof color1 !== 'string' || typeof color2 !== 'string') {
                return false;
            } // Modified by SmartChart team
            if (color1 === color2) return true;
            if (!color1 && !color2) return true;
            if (!color1 || !color2) return false;
            if (color1 === 'transparent') color1 = 'rgba(0,0,0,0)';
            if (color2 === 'transparent') color2 = 'rgba(0,0,0,0)';
            const alpha = /^rgba\(.*,(.+)\)/;
            let rgba1: RegExpMatchArray | number | null = color1.match(alpha);
            let rgba2: RegExpMatchArray | number | null = color2.match(alpha);
            rgba1 = rgba1 ? parseFloat(rgba1[1]) : 1;
            rgba2 = rgba2 ? parseFloat(rgba2[1]) : 1;
            if (rgba1 !== rgba2) return false;
            const first = CIQ.colorToHex(color1);
            const second = CIQ.colorToHex(color2);
            return first.toLowerCase() === second.toLowerCase();
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
            getMarketsOrder,
            initialData,
            chartData,
            feedCall,
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
        const engineParams: typeof CIQ.ChartEngine = {
            maxMasterDataSize: 0, // cap size so tick_history requests do not become too large
            maxDataSetSize: 0,
            markerDelay: null, // disable 25ms delay for placement of markers
            container: this.rootNode?.querySelector('.chartContainer'),
            controls: { chartControls: null }, // hide the default zoom buttons
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
            engineParams.chart.tension = (chartLayout as typeof CIQ.ChartEngine.Chart).tension = 0.5;
        }
        const rangeSpan = this.getRangeSpan();
        if (rangeSpan) {
            chartLayout = { ...chartLayout, ...rangeSpan };
        }
        engineParams.layout = chartLayout;
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
        stxx.animations.zoom.run = (
            fc: (t: number, b?: number, c?: number, d?: number) => void,
            startValues?: Record<string, number> | number,
            endValues?: Record<string, number> | number
        ) => {
            if (wheelInMotion) return;
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
        stxx.prepend('touchmove', function (this: typeof CIQ.ChartEngine) {
            if (this.grabStartValues && this.grabStartValues.t2 && this.grabStartValues.t1) return false; // continue
            return true; // exit
        });
        stxx.isAutoScale = settings && settings.isAutoScale !== false;
        ChartStore.chartCount += 1;

        this.addDeleteElement();
        this.addManageElement();
        if (this.state.isAnimationEnabled) animateChart(stxx, { stayPut: true });

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
        stxx.addEventListener('studyOverlayEdit', this.studiesStore.editStudy);
        stxx.addEventListener('studyPanelEdit', this.studiesStore.editStudy);
        this.stateStore.stateChange(STATE.INITIAL);
        this.loader.setState('market-symbol');
        this.activeSymbols?.retrieveActiveSymbols().then(() => {
            this.loader.setState('trading-time');
            this.tradingTimes?.initialize().then(
                action(() => {
                    // In the odd event that chart is destroyed by the time
                    // the request finishes, just calmly return...
                    if (stxx.isDestroyed) {
                        return;
                    }
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
                    stxx.container.addEventListener('mouseenter', this.onMouseEnter);
                    stxx.container.addEventListener('mouseleave', this.onMouseLeave);

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
        if ('ResizeObserver' in window) {
            this.resizeObserver = new ResizeObserver(this.resizeScreen);
            if (this.rootNode) this.resizeObserver.observe(this.rootNode);
        } else {
            import(/* webpackChunkName: "resize-observer-polyfill" */ 'resize-observer-polyfill').then(
                ({ default: ResizeObserver }) => {
                    window.ResizeObserver = ResizeObserver;

                    if (this.stxx.isDestroyed || !this.rootNode) {
                        return;
                    }
                    this.resizeObserver = new ResizeObserver(this.resizeScreen);
                    this.resizeObserver.observe(this.rootNode);
                }
            );
        }
    };
    onMarketOpenClosedChange = (changes: TChanges) => {
        const symbolObjects = this.stxx.getSymbols().map((item: TStxSymbolItem) => item.symbolObject);

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

    chartClosedOpenThemeChange(isChartClosed: boolean) {
        this.mainStore.state.setChartClosed(isChartClosed);
        this.mainStore.state.setChartTheme(this.mainStore.chartSetting.theme, isChartClosed);
    }
    @computed
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
    @action.bound
    onServerTimeChange() {
        if (this.tradingTimes?._serverTime) {
            this.serverTime = moment(this.tradingTimes._serverTime.getEpoch() * 1000).format(
                'DD MMM YYYY HH:mm:ss [GMT]'
            );
        }
    }
    @action.bound
    onMouseEnter() {
        this.cursorInChart = true;
        /*
         * Disable key press events for chart until we can get it not to
         * interfere with key presses outside the chart:
         */
    }
    @action.bound
    onMouseLeave() {
        this.cursorInChart = false;
        /*
         * Disable key press events for chart until we can get it not to
         * interfere with key presses outside the chart:
         */
    }
    @action.bound
    updateCurrentActiveSymbol() {
        const { symbolObject } = this.stxx.chart;
        this.currentActiveSymbol = symbolObject;

        this.stxx.chart.yAxis.decimalPlaces = symbolObject.decimal_places;
        this.setMainSeriesDisplay(symbolObject.name);
    }
    @action.bound
    setChartAvailability(status: boolean) {
        this.isChartAvailable = status;
    }
    @action.bound
    changeSymbol(
        symbolObj: TProcessedSymbolItem | string | undefined,
        granularity?: TGranularity,
        isLanguageChanged = false
    ) {
        if (!this.stxx) return;
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
        let params;
        if (granularity !== undefined) {
            this.granularity = granularity;
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
    @action.bound
    calculateYaxisWidth = (price: number) => {
        if (!price) return;

        const { context } = this.context?.stx.chart;
        const priceWidth = context.measureText(price.toFixed(this.pip)).width + 20;
        if (priceWidth > this.yAxiswidth) {
            this.yAxiswidth = priceWidth;

            this.stxx.chart.yAxis.width = priceWidth;

            this.stxx.calculateYAxisPositions();

            this.stxx.draw();
        }
    };
    @action.bound
    updateYaxisWidth = () => {
        if (this.stxx && this.stxx.masterData && this.stxx.masterData.length) {
            if (this.currentCloseQuote() && this.currentCloseQuote()?.Close) {
                this.calculateYaxisWidth(this.currentCloseQuote()?.Close as number);
            }
        }
    };
    // Calling newChart with symbolObj as undefined refreshes the chart
    @action.bound
    newChart(symbolObj = this.currentActiveSymbol, params?: TNewChartParams) {
        if (!symbolObj) return;

        this.stxx.chart.symbolDisplay = symbolObj.name;
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
                this.mainStore.chart.feed.scaleChart();
            }
        };
        this.yAxiswidth = 0;
        const rangeSpan = this.getRangeSpan();
        const parameters = {
            masterData: null,
            chart: null,
        };
        CIQ.extend(parameters, { ...params, ...rangeSpan }, true);

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
    loadChartWithInitalData(symbol: string | undefined, masterData: TQuote[] | undefined) {
        if (!masterData) return;
        const layoutData = createObjectFromLocalStorage(`layout-${this.chartId}`);
        if (!layoutData || !layoutData.symbols.length) return;
        const layout_symbol = layoutData.symbols[0].symbol;
        if (!(symbol || layout_symbol)) {
            console.error('symbol is not specificed, without it, chart is unable to be loaded!');
            return;
        }

        this.stxx.loadChart(
            symbol || layout_symbol,
            {
                masterData,
                periodicity: {
                    period: layoutData.periodicity,
                    interval: layoutData.interval,
                    timeUnit: layoutData.timeUnit,
                },
            },
            () => {
                this.loader.hide();
            }
        );
    }
    remainLabelY = (): number => {
        const stx = this.context?.stx;
        const topPos = 36;
        const labelHeight = 24;
        const bottomPos = 66;
        let y = stx.chart.currentPriceLabelY + labelHeight;
        if (stx.chart.currentPriceLabelY > stx.chart.panel.bottom - bottomPos) {
            y = stx.chart.panel.bottom - bottomPos;
            y = y < stx.chart.currentPriceLabelY - labelHeight ? y : stx.chart.currentPriceLabelY - labelHeight;
        } else if (stx.chart.currentPriceLabelY < stx.chart.panel.top) {
            y = topPos;
        }
        return y;
    };
    @action.bound
    setYaxisWidth = (width?: number) => {
        this.yAxiswidth = width || this.yAxiswidth;

        this.stxx.chart.yAxis.width = width || this.yAxiswidth;

        this.stxx.calculateYAxisPositions();

        this.stxx.draw();
    };
    getRangeSpan(): { range: TRange; span?: TSpan } | void {
        const { startEpoch, endEpoch } = this.state as ChartState;
        let range, span;

        if (!this.chartNode) return;

        const paddingRatio = this.chartNode.clientWidth / this.RANGE_PADDING_PX;
        const elapsedSeconds = (endEpoch || (startEpoch as number)) - (startEpoch || (endEpoch as number));
        const epochPadding = (elapsedSeconds / paddingRatio) | 0;
        if (startEpoch || endEpoch) {
            const dtLeft = startEpoch ? CIQ.strToDateTime(getUTCDate(startEpoch - epochPadding)) : undefined;
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
    setMainSeriesDisplay(name: string) {
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
    @action.bound
    updateScaledOneOne(state: boolean) {
        this.isScaledOneOne = state;
    }
    // Makes requests to tick history API that will replace
    // Existing chart tick/ohlc data
    @action.bound
    refreshChart() {
        this.newChart();
    }
    @action.bound
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
        if (ChartStore.keystrokeHub && ChartStore.keystrokeHub.context === this.context) {
            ChartStore.keystrokeHub.setActiveContext(null);
        }
        if (this.stxx) {
            this.stxx.container.removeEventListener('mouseenter', this.onMouseEnter);

            this.stxx.container.removeEventListener('mouseleave', this.onMouseLeave);

            // eslint-disable-next-line @typescript-eslint/no-empty-function
            this.stxx.updateChartData = function () {}; // prevent any data from entering the chart

            this.stxx.isDestroyed = true;

            this.stxx.destroy();
            this.stxx = null;
        }
        this.mainStore.drawTools.destructor();
        this.currentActiveSymbol = null;
        this.contextPromise = null;
        this.context = null;
    }

    @action.bound openFullscreen() {
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

        if (fncToCall) {
            (el as HTMLElement)[fncToCall as 'requestFullscreen']();
        }
    }
}
export default ChartStore;
