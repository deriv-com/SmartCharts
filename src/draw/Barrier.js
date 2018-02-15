import EventEmitter from 'event-emitter-es6';
import PriceLine from './PriceLine';
import { createElement, setHidden } from '../components/ui/utils';

class Barrier {
    static get LINE_COLOR_RED() { return 'red'; }
    static get LINE_COLOR_GREEN() { return 'green'; }

    static get SHADE_NONE_SINGLE() { return 'SHADE_NONE_SINGLE'; }
    static get SHADE_NONE_DOUBLE() { return 'SHADE_NONE_DOUBLE'; }
    static get SHADE_ABOVE() { return 'SHADE_ABOVE'; }
    static get SHADE_BELOW() { return 'SHADE_BELOW'; }
    static get SHADE_BETWEEN() { return 'SHADE_BETWEEN'; }
    static get SHADE_OUTSIDE() { return 'SHADE_OUTSIDE'; }

    static get BARRIER_CHANGED() { return 'BARRIER_CHANGED'; }

    static MARGIN_OFFSET = 13;
    static MIN_DIFFERENCE_BETWEEN_BARRIERS = 0.01;

    static createShadeElement() {
        return createElement('<div class="shade"></div>');
    }

    static createBarrierElement() {
        return createElement('<div class="barrier"></div>');
    }

    /**
     *
     * @param {CIQ.ChartEngine} stx
     * @param {Boolean} relative
     * @param {Boolean} draggable
     * @param {Boolean} visible
     * @param {Enum} shade use one of 6 presets in Barrier.SHADE_*
     * @param {String} shadeColor use CSS rgba
     */
    constructor({
        stx,
        relative = false,
        draggable = true,
        visible = true,
        shade = Barrier.SHADE_NONE_SINGLE,
        shadeColor = 'rgba(140, 193, 118, 0.3)',
    }) {
        this._emitter = new EventEmitter();
        this._barrierElement = Barrier.createBarrierElement();
        this._stx = stx;

        this._barrier1 = new PriceLine({ stx, relative });
        this._barrier2 = new PriceLine({ stx, relative });

        this._setupConstrainBarrierPrices();

        this._barrier1.onPriceChanged(this._onPriceChanged.bind(this));
        this._barrier2.onPriceChanged(this._onPriceChanged.bind(this));

        this._barrierElement.appendChild(this._barrier1.element);
        this._barrierElement.appendChild(this._barrier2.element);

        this._chart = stx.chart;

        const distance = this._chart.yAxis.priceTick;
        this._barrier1.price += distance;
        this._barrier2.price -= distance;

        this._aboveShade = Barrier.createShadeElement();
        this._betweenShade = Barrier.createShadeElement();
        this._belowShade = Barrier.createShadeElement();
        this._barrierElement.appendChild(this._aboveShade);
        this._barrierElement.appendChild(this._betweenShade);
        this._barrierElement.appendChild(this._belowShade);

        const holder = this._chart.panel.holder;
        holder.appendChild(this._barrierElement);

        this.shadeColor = shadeColor;
        this.shadeState = shade;
        stx.append('draw', this._drawShadedArea.bind(this));

        this.draggable = draggable;
        this.visible = visible;
    }

    onBarrierChanged(callback) {
        this._emitter.on(Barrier.BARRIER_CHANGED, callback);
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

    get relative() {
        return this._barrier1.relative;
    }

    set relative(value) {
        this._barrier1.relative = value;
        this._barrier2.relative = value;
    }

    get lineColor() {
        return this._barrier1.lineColor;
    }

    set lineColor(color) {
        this._barrier1.lineColor = color;
        this._barrier2.lineColor = color;
    }

    _setupConstrainBarrierPrices() {
        // barrier 1 cannot go below barrier 2
        this._barrier1.priceConstrainer = (newPrice) => {
            if (this._barrier2.visible) {
                if (newPrice < this._barrier2.realPrice + Barrier.MIN_DIFFERENCE_BETWEEN_BARRIERS) {
                    return this._barrier1.realPrice;
                }
            }

            return newPrice;
        };

        // barrier 2 cannot go above barrier 1
        this._barrier2.priceConstrainer = (newPrice) => {
            if (newPrice > this._barrier1.realPrice - Barrier.MIN_DIFFERENCE_BETWEEN_BARRIERS) {
                return this._barrier2.realPrice;
            }

            return newPrice;
        };
    }

    get visible() {
        return this._visible;
    }

    set visible(visible) {
        if (this._visible === visible) {return;}

        this._visible = visible;

        if (visible) {
            this.shadeState = this.shadeState; // restore barrier state
            this._barrier1.visible = true;
        } else {
            // Also disable visibility of barriers to turn off draw updates
            this._barrier1.visible = false;
            this._barrier2.visible = false;
        }

        setHidden(this._barrierElement, !visible);
    }

    get draggable() {
        return this._barrier1.draggable;
    }

    set draggable(value) {
        this._barrier1.draggable = value;
        this._barrier2.draggable = value;
    }

    get shadeColor() {
        return this._shadeColor;
    }

    set shadeColor(shadeColor) {
        this._shadeColor = shadeColor;
        this._aboveShade.style.backgroundImage = `linear-gradient(to bottom, transparent 30%, ${shadeColor})`;
        this._betweenShade.style.backgroundColor = shadeColor;
        this._belowShade.style.backgroundImage = `linear-gradient(to bottom, ${shadeColor}, transparent 70%)`;
    }

    get shadeState() {
        return this._shadeState;
    }

    set shadeState(shadeState) {
        this._shadeState = shadeState;

        const noShade =
            this._shadeState === Barrier.SHADE_NONE_SINGLE
            || this._shadeState === Barrier.SHADE_NONE_DOUBLE;

        if (noShade) {
            setHidden(this._aboveShade, true);
            setHidden(this._betweenShade, true);
            setHidden(this._belowShade, true);
        } else {
            const aboveShadeEnable =
                this._shadeState === Barrier.SHADE_ABOVE
                || this._shadeState === Barrier.SHADE_OUTSIDE;
            const belowShadeEnable =
                this._shadeState === Barrier.SHADE_BELOW
                || this._shadeState === Barrier.SHADE_OUTSIDE;
            const betweenShadeEnable =
                this._shadeState === Barrier.SHADE_BETWEEN;

            setHidden(this._aboveShade, !aboveShadeEnable);
            setHidden(this._belowShade, !belowShadeEnable);
            setHidden(this._betweenShade, !betweenShadeEnable);

            this._drawShadedArea();
        }

        const showBarrier2 =
            this._shadeState === Barrier.SHADE_OUTSIDE
            || this._shadeState === Barrier.SHADE_BETWEEN
            || this._shadeState === Barrier.SHADE_NONE_DOUBLE;

        const wasBarrier2Visible = this._barrier2.visible;
        this._barrier2.visible = showBarrier2;

        if (showBarrier2 && !wasBarrier2Visible) {
            if (this._barrier2.realPrice >= this._barrier1.realPrice) {
                // fix position if _barrier2 above _barrier1, since _barrier2 position is not updated when not visible
                this._barrier2.price = this._barrier1.price - this._chart.yAxis.priceTick;
            }
        }
    }

    _isBarriersOffScreen() {
        return this._barrier1.element.getAttribute('off-screen')
            && this._barrier2.element.getAttribute('off-screen');
    }

    _drawShadedArea() {
        if (!this.visible) {return;}

        if (this._shadeState === Barrier.SHADE_ABOVE) {
            this._shadeAbove();
        } else if (this._shadeState === Barrier.SHADE_BELOW) {
            this._shadeBelow();
        } else if (this._shadeState === Barrier.SHADE_BETWEEN) {
            this._shadeBetween();
        } else if (this._shadeState === Barrier.SHADE_OUTSIDE) {
            this._shadeOutside();
        }

        if (this._barrier2.visible && this._isBarriersOffScreen()) {
            const order = (this._barrier1.top === 0) ? null : 101;
            this._barrier1.element.style.zIndex = order;
        }
    }

    _onPriceChanged() {
        const high_barrier = this._barrier1.visible ? this._barrier1.price : undefined;
        const low_barrier = this._barrier2.visible ? this._barrier2.price : undefined;

        this._emitter.emit(Barrier.BARRIER_CHANGED, { high_barrier, low_barrier });

        this._drawShadedArea();
    }

    _calcBottomShade(barrierId) {
        return this._chart.panel.height - this[`_barrier${barrierId}`].top - Barrier.MARGIN_OFFSET;
    }

    _calcTopShade(barrierId) {
        return this[`_barrier${barrierId}`].top + Barrier.MARGIN_OFFSET;
    }

    _shadeBetween() {
        const top = this._calcTopShade(1);
        const bottom = this._calcBottomShade(2);
        this._betweenShade.style.top = `${top}px`;
        this._betweenShade.style.bottom = `${bottom}px`;
    }

    _shadeBelow(barrierId = 1) {
        const top = this._calcTopShade(barrierId);
        this._belowShade.style.top = `${top}px`;
        this._belowShade.style.bottom = '0px';
    }

    _shadeAbove(barrierId = 1) {
        const bottom = this._calcBottomShade(barrierId);
        this._aboveShade.style.top = '0px';
        this._aboveShade.style.bottom = `${bottom}px`;
    }

    _shadeOutside() {
        this._shadeAbove(1);
        this._shadeBelow(2);
    }
}

export default Barrier;
