import { observable, action, computed } from 'mobx';
import PriceLineStore from './PriceLineStore';
import ShadeStore from './ShadeStore';
import PendingPromise from '../utils/PendingPromise';
import PriceLine from '../components/PriceLine.jsx';
import Shade from '../components/Shade.jsx';
import { isValidProp } from '../utils';

export default class BarrierStore {
    static get SHADE_NONE_SINGLE() { return 'SHADE_NONE_SINGLE'; }
    static get SHADE_NONE_DOUBLE() { return 'SHADE_NONE_DOUBLE'; }
    static get SHADE_ABOVE() { return 'SHADE_ABOVE'; }
    static get SHADE_BELOW() { return 'SHADE_BELOW'; }
    static get SHADE_BETWEEN() { return 'SHADE_BETWEEN'; }
    static get SHADE_OUTSIDE() { return 'SHADE_OUTSIDE'; }

    static get BARRIER_CHANGED() { return 'BARRIER_CHANGED'; }

    @observable shadeColor;
    @observable color;
    @observable foregroundColor;
    @observable isBetweenShadeVisible = false;
    @observable isTopShadeVisible = false;
    @observable isBottomShadeVisible = false;
    @observable hidePriceLines = false;
    @observable lineStyle = undefined;
    @observable isInitialized = false;
    @observable initializePromise = new PendingPromise();
    @observable hideBarrierLine = false;
    @observable hideOffscreenLine = false;
    @observable hideOffscreenBarrier = false;
    @observable isSingleBarrier = false;

    _shadeState;

    @computed get pip() { return this.mainStore.chart.currentActiveSymbol.decimal_places; }
    @computed get yAxisWidth() { return this.mainStore.chart.yAxiswidth; }
    @computed get priceLabelWidth() { return this.yAxisWidth + 1; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        this._high_barrier = new PriceLineStore(this.mainStore);
        this._low_barrier = new PriceLineStore(this.mainStore);

        this._high_barrier.onPriceChanged(this._drawShadedArea);
        this._low_barrier.onPriceChanged(this._drawShadedArea);

        this._high_barrier.onDragReleased(this._fireOnBarrierChange);
        this._low_barrier.onDragReleased(this._fireOnBarrierChange);

        this._injectionId = this.stx.append('draw', this._drawShadedArea);

        this._setupConstrainBarrierPrices();

        this._listenerId = this.stx.addEventListener('newChart', this.init);

        this.aboveShadeStore = new ShadeStore('top-shade');
        this.betweenShadeStore = new ShadeStore('between-shade');
        this.belowShadeStore = new ShadeStore('bottom-shade');
        this.AboveShade = this.aboveShadeStore.connect(Shade);
        this.BetweenShade = this.betweenShadeStore.connect(Shade);
        this.BelowShade = this.belowShadeStore.connect(Shade);

        this.shadeState = BarrierStore.SHADE_NONE_SINGLE;

        if (this.context && this.stx.currentQuote()) { this.init(); }

        this.HighPriceLine = this._high_barrier.connect(PriceLine);
        this.LowPriceLine = this._low_barrier.connect(PriceLine);

        this.mainStore.chart._barriers.push(this);
    }

    @action.bound init() {
        this.isInitialized = true;
        this.initializePromise.resolve();

        // Enable this to test barriers; high low values are mandatory
        // for library user to provide
        // this.setDefaultBarrier();
    }

    setDefaultBarrier() {
        const price = this.relative ? 0 : this.stx.currentQuote().Close;
        const distance = this.chart.yAxis.priceTick;
        this._high_barrier.price = price + distance;
        this._low_barrier.price = price - distance;
        this._high_barrier._updateTop();
        this._low_barrier._updateTop();
        this._drawShadedArea();
    }

    @action.bound updateProps({
        color, foregroundColor, shadeColor, shade, high, low, relative, draggable, onChange, hideBarrierLine, hideOffscreenBarrier, hideOffscreenLine, hidePriceLines, lineStyle, title, showOffscreenArrows, isSingleBarrier, opacityOnOverlap,
    }) {
        this.initializePromise.then(action(() => {
            if (color) { this.color = color; }
            if (foregroundColor) { this.foregroundColor = foregroundColor; }
            if (shadeColor) { this.shadeColor = shadeColor; }
            if (shade) { this.shadeState = `SHADE_${shade}`.toUpperCase(); }
            if (relative !== undefined) { this.relative = relative; }
            if (draggable !== undefined) { this.draggable = draggable; }
            if (isValidProp(high)) { this.high_barrier = high; }
            if (isValidProp(low)) { this.low_barrier = low; }
            if (onChange) { this.onBarrierChange = onChange; }
            if (title) { this.title = title; }
            this.lineStyle = lineStyle;
            this.hideBarrierLine = !!hideBarrierLine;
            this.hidePriceLines = !!hidePriceLines;
            this.hideOffscreenLine = !!hideOffscreenLine;
            this.hideOffscreenBarrier = !!hideOffscreenBarrier;
            this.isSingleBarrier = !!isSingleBarrier;
        }));
        if (opacityOnOverlap) { this.opacityOnOverlap = opacityOnOverlap; }
        if (showOffscreenArrows) { this.showOffscreenArrows = showOffscreenArrows; }
    }

    @action.bound destructor() {
        this.stx.removeInjection(this._injectionId);
        this.stx.removeEventListener(this._listenerId);
        this._high_barrier.destructor();
        this._low_barrier.destructor();

        const i = this.mainStore.chart._barriers.findIndex(b => b === this);
        if (i !== -1) {
            this.mainStore.chart._barriers.splice(i, 1);
        }
    }

    get high_barrier() { return this._high_barrier.price; }
    get low_barrier() { return this._low_barrier.price; }
    set high_barrier(price) { this._high_barrier.price = price; }
    set low_barrier(price) { this._low_barrier.price = price; }

    _setupConstrainBarrierPrices() {
        // barrier 1 cannot go below barrier 2
        this._high_barrier.priceConstrainer = (newPrice) => {
            const nextPrice = (this._low_barrier.visible && (newPrice < this._low_barrier.realPrice))
                ? this._high_barrier.realPrice : newPrice;
            this.mainStore.chart.calculateYaxisWidth(nextPrice);

            return nextPrice;
        };

        // barrier 2 cannot go above barrier 1
        this._low_barrier.priceConstrainer = (newPrice) => {
            const nextPrice = (newPrice > this._high_barrier.realPrice) ? this._low_barrier.realPrice : newPrice;

            this.mainStore.chart.calculateYaxisWidth(nextPrice);
            return nextPrice;
        };
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get chart() { return this.stx.chart; }

    _onBarrierChange = null;

    set onBarrierChange(callback) {
        if (this._onBarrierChange !== callback) {
            this._onBarrierChange = callback;
        }
    }

    _fireOnBarrierChange = () => {
        const high = this._high_barrier.visible ? +this._high_barrier.price.toFixed(this.pip) : undefined;
        const low  = this._low_barrier.visible  ? +this._low_barrier.price.toFixed(this.pip)  : undefined;

        if (this._onBarrierChange) { this._onBarrierChange({ high, low }); }
    };

    get shadeState() {
        return this._shadeState;
    }

    set shadeState(shadeState) {
        if (this._shadeState === shadeState) { return; }
        this._shadeState = shadeState;

        const noShade = this._shadeState === BarrierStore.SHADE_NONE_SINGLE
            || this._shadeState === BarrierStore.SHADE_NONE_DOUBLE;

        if (noShade) {
            this.aboveShadeStore.visible = false;
            this.betweenShadeStore.visible = false;
            this.belowShadeStore.visible = false;
        } else {
            const aboveShadeEnable = this._shadeState === BarrierStore.SHADE_ABOVE
                || this._shadeState === BarrierStore.SHADE_OUTSIDE;
            const belowShadeEnable = this._shadeState === BarrierStore.SHADE_BELOW
                || this._shadeState === BarrierStore.SHADE_OUTSIDE;
            const betweenShadeEnable = this._shadeState === BarrierStore.SHADE_BETWEEN;

            this.aboveShadeStore.visible = aboveShadeEnable;
            this.betweenShadeStore.visible = betweenShadeEnable;
            this.belowShadeStore.visible = belowShadeEnable;

            this._drawShadedArea();
        }

        const showLowBarrier = this._shadeState === BarrierStore.SHADE_OUTSIDE
            || this._shadeState === BarrierStore.SHADE_BETWEEN
            || this._shadeState === BarrierStore.SHADE_NONE_DOUBLE;

        const wasLowBarrierVisible = this._low_barrier.visible;
        this._low_barrier.visible = showLowBarrier;

        if (this.isInitialized && showLowBarrier && !wasLowBarrierVisible) {
            if (this._low_barrier.realPrice >= this._high_barrier.realPrice) {
                // fix position if _low_barrier above _high_barrier, since _low_barrier position is not updated when not visible
                this._low_barrier.price = this._high_barrier.price - this.chart.yAxis.priceTick;
            }
        }
    }

    get relative() {
        return this._high_barrier.relative;
    }

    set relative(value) {
        this._high_barrier.relative = value;
        this._low_barrier.relative = value;
    }

    get draggable() {
        return this._high_barrier.draggable;
    }

    set draggable(value) {
        this._high_barrier.draggable = value;
        this._low_barrier.draggable = value;
    }

    get showOffscreenArrows() {
        return this._high_barrier.showOffscreenArrows;
    }

    set showOffscreenArrows(value) {
        this._high_barrier.showOffscreenArrows = value;
    }

    get opacityOnOverlap() {
        return this._high_barrier.opacityOnOverlap;
    }

    set opacityOnOverlap(value) {
        this._high_barrier.opacityOnOverlap = value;
    }

    _drawShadedArea = () => {
        if (!this.isInitialized) { return; }

        if (this._shadeState === BarrierStore.SHADE_ABOVE) {
            this._shadeAbove();
        } else if (this._shadeState === BarrierStore.SHADE_BELOW) {
            this._shadeBelow();
        } else if (this._shadeState === BarrierStore.SHADE_BETWEEN) {
            this._shadeBetween();
        } else if (this._shadeState === BarrierStore.SHADE_OUTSIDE) {
            this._shadeOutside();
        }

        if (this._low_barrier.visible && this._isBarriersOffScreen()) {
            const order = (this._high_barrier.top === 0) ? null : 101;
            this._high_barrier.zIndex = order;
        }
    }

    _isBarriersOffScreen() {
        return this._high_barrier.offScreen && this._low_barrier.offScreen;
    }

    _shadeBetween() {
        this.betweenShadeStore.setPosition({
            top : this._high_barrier.top,
            bottom : this._low_barrier.top,
            right : this.yAxisWidth,
        });
    }

    _shadeBelow(barrier = this._high_barrier) {
        this.belowShadeStore.setPosition({
            top: barrier.top,
            bottom: 0,
            right: this.yAxisWidth,
        });
    }

    _shadeAbove(barrier = this._high_barrier) {
        this.aboveShadeStore.setPosition({
            top: 0,
            bottom: barrier.top,
            right: this.yAxisWidth,
        });
    }

    _shadeOutside() {
        this._shadeAbove(this._high_barrier);
        this._shadeBelow(this._low_barrier);
    }
}
