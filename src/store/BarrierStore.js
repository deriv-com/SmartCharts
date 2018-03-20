import { observable, action, computed, when } from 'mobx';
import { connect } from './Connect';
import PriceLineStore from './PriceLineStore';
import PriceLine from '../components/PriceLine.jsx';
import EventEmitter from 'event-emitter-es6';
import ShadeStore from './ShadeStore';
import Shade from '../components/Shade.jsx';

export default class BarrierStore {
    static get BARRIER_COLOR_RED() { return 'red'; }
    static get BARRIER_COLOR_GREEN() { return 'green'; }

    static get SHADE_NONE_SINGLE() { return 'SHADE_NONE_SINGLE'; }
    static get SHADE_NONE_DOUBLE() { return 'SHADE_NONE_DOUBLE'; }
    static get SHADE_ABOVE() { return 'SHADE_ABOVE'; }
    static get SHADE_BELOW() { return 'SHADE_BELOW'; }
    static get SHADE_BETWEEN() { return 'SHADE_BETWEEN'; }
    static get SHADE_OUTSIDE() { return 'SHADE_OUTSIDE'; }

    static get BARRIER_CHANGED() { return 'BARRIER_CHANGED'; }

    static MARGIN_OFFSET = 13;
    static MIN_DIFFERENCE_BETWEEN_BARRIERS = 0.01;

    @observable _visible = false;
    @observable barrierColor = BarrierStore.BARRIER_COLOR_RED;
    @observable isBetweenShadeVisible = false;
    @observable isTopShadeVisible = false;
    @observable isBottomShadeVisible = false;
    _shadeState = BarrierStore.SHADE_NONE_SINGLE;

    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);

        this._aboveShade = new ShadeStore('top-shade');
        this._betweenShade = new ShadeStore('between-shade');
        this._belowShade = new ShadeStore('bottom-shade');
        this._emitter = new EventEmitter();

        window.barrier = this;
    }

    get high_barrier() {
        return this._barrier1.price;
    }

    set high_barrier(price) {
        this._barrier1.price = price;
    }

    get low_barrier() {
        return this._barrier2.price;
    }

    set low_barrier(price) {
        this._barrier2.price = price;
    }

    _setupConstrainBarrierPrices() {
        // barrier 1 cannot go below barrier 2
        this._barrier1.priceConstrainer = (newPrice) => {
            if (this._barrier2.visible) {
                if (newPrice < this._barrier2.realPrice) {
                    return this._barrier1.realPrice;
                }
            }

            return newPrice;
        };

        // barrier 2 cannot go above barrier 1
        this._barrier2.priceConstrainer = (newPrice) => {
            if (newPrice > this._barrier1.realPrice) {
                return this._barrier2.realPrice;
            }

            return newPrice;
        };
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get chart() { return this.stx.chart; }

    onContextReady = () => {
        this._barrier1 = new PriceLineStore(this.mainStore);
        this._barrier2 = new PriceLineStore(this.mainStore);
        this._barrier1.onPriceChanged(this._onPriceChanged.bind(this));
        this._barrier2.onPriceChanged(this._onPriceChanged.bind(this));
        this.stx.append('draw', this._drawShadedArea.bind(this));

        this._setupConstrainBarrierPrices();

        this.stx.addEventListener('newChart', () => {
            const price = this.relative ? 0 : this.stx.currentQuote().Close;
            const distance = this.chart.yAxis.priceTick;
            this._barrier1.price = price + distance;
            this._barrier2.price = price - distance;
        });
    };

    get visible() {
        return this._visible;
    }

    set visible(visible) {
        if (this._visible === visible) {return;}

        if (visible) {
            this.shadeState = this.shadeState; // restore barrier state
            this._barrier1.visible = true;
        } else {
            // Also disable visibility of barriers to turn off draw updates
            this._barrier1.visible = false;
            this._barrier2.visible = false;
        }

        this._visible = visible;
    }

    _onPriceChanged() {
        const high_barrier = this._barrier1.visible ? this._barrier1.price : undefined;
        const low_barrier = this._barrier2.visible ? this._barrier2.price : undefined;

        this._emitter.emit(BarrierStore.BARRIER_CHANGED, { high_barrier, low_barrier });

        this._drawShadedArea();
    }

    onBarrierChanged(callback) {
        this._emitter.on(BarrierStore.BARRIER_CHANGED, callback);
    }

    get shadeState() {
        return this._shadeState;
    }

    set shadeState(shadeState) {
        this._shadeState = shadeState;

        const noShade =
            this._shadeState === BarrierStore.SHADE_NONE_SINGLE
            || this._shadeState === BarrierStore.SHADE_NONE_DOUBLE;

        if (noShade) {
            this._aboveShade.visible = false;
            this._betweenShade.visible = false;
            this._belowShade.visible = false;
        } else {
            const aboveShadeEnable =
                this._shadeState === BarrierStore.SHADE_ABOVE
                || this._shadeState === BarrierStore.SHADE_OUTSIDE;
            const belowShadeEnable =
                this._shadeState === BarrierStore.SHADE_BELOW
                || this._shadeState === BarrierStore.SHADE_OUTSIDE;
            const betweenShadeEnable =
                this._shadeState === BarrierStore.SHADE_BETWEEN;

            this._aboveShade.visible = aboveShadeEnable;
            this._betweenShade.visible = betweenShadeEnable;
            this._belowShade.visible = belowShadeEnable;

            this._drawShadedArea();
        }

        const showBarrier2 =
            this._shadeState === BarrierStore.SHADE_OUTSIDE
            || this._shadeState === BarrierStore.SHADE_BETWEEN
            || this._shadeState === BarrierStore.SHADE_NONE_DOUBLE;

        const wasBarrier2Visible = this._barrier2.visible;
        this._barrier2.visible = showBarrier2;

        if (showBarrier2 && !wasBarrier2Visible) {
            if (this._barrier2.realPrice >= this._barrier1.realPrice) {
                // fix position if _barrier2 above _barrier1, since _barrier2 position is not updated when not visible
                this._barrier2.price = this._barrier1.price - this.chart.yAxis.priceTick;
            }
        }
    }

    get relative() {
        return this._barrier1.relative;
    }

    set relative(value) {
        this._barrier1.relative = value;
        this._barrier2.relative = value;
    }

    get draggable() {
        return this._barrier1.draggable;
    }

    set draggable(value) {
        this._barrier1.draggable = value;
        this._barrier2.draggable = value;
    }

    _drawShadedArea() {
        if (!this._visible) {return;}

        if (this._shadeState === BarrierStore.SHADE_ABOVE) {
            this._shadeAbove();
        } else if (this._shadeState === BarrierStore.SHADE_BELOW) {
            this._shadeBelow();
        } else if (this._shadeState === BarrierStore.SHADE_BETWEEN) {
            this._shadeBetween();
        } else if (this._shadeState === BarrierStore.SHADE_OUTSIDE) {
            this._shadeOutside();
        }

        if (this._barrier2.visible && this._isBarriersOffScreen()) {
            const order = (this._barrier1.top === 0) ? null : 101;
            this._barrier1.zIndex = order;
        }
    }

    _isBarriersOffScreen() {
        return this._barrier1.offScreen && this._barrier2.offScreen;
    }

    _calcBottomShade(barrierId) {
        return this.chart.panel.height - this[`_barrier${barrierId}`].top - BarrierStore.MARGIN_OFFSET;
    }

    _calcTopShade(barrierId) {
        return this[`_barrier${barrierId}`].top + BarrierStore.MARGIN_OFFSET;
    }

    _shadeBetween() {
        const top = this._calcTopShade(1);
        const bottom = this._calcBottomShade(2);
        this._betweenShade.top = top;
        this._betweenShade.bottom = bottom;
    }

    _shadeBelow(barrierId = 1) {
        const top = this._calcTopShade(barrierId);
        this._belowShade.top = top;
        this._belowShade.bottom = 0;
    }

    _shadeAbove(barrierId = 1) {
        const bottom = this._calcBottomShade(barrierId);
        this._aboveShade.top = 0;
        this._aboveShade.bottom = bottom;
    }

    _shadeOutside() {
        this._shadeAbove(1);
        this._shadeBelow(2);
    }

    connect = connect(() => ({
        HighPriceLine: this._barrier1.connect(PriceLine),
        LowPriceLine: this._barrier2.connect(PriceLine),
        TopShade: this._aboveShade.connect(Shade),
        BetweenShade: this._betweenShade.connect(Shade),
        BottomShade: this._belowShade.connect(Shade),
        visible: this._visible,
        barrierColor: this.barrierColor
    }));
}
