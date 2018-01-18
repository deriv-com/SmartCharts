import PriceLine from './PriceLine';
import { createElement, setHidden } from '../components/ui/utils';

class Barrier {
    static get BARRIER_SINGLE() { return 'BARRIER_SINGLE'; }
    static get BARRIER_DOUBLE() { return 'BARRIER_DOUBLE'; }
    static get BARRIER_ABOVE() { return 'BARRIER_ABOVE'; }
    static get BARRIER_BELOW() { return 'BARRIER_BELOW'; }
    static get BARRIER_BETWEEN() { return 'BARRIER_BETWEEN'; }
    static get BARRIER_OUTSIDE() { return 'BARRIER_OUTSIDE'; }
    static MARGIN_OFFSET = 13;
    static MIN_DIFFERENCE_BETWEEN_BARRIERS = 0.01;

    static createShadeElement() {
        return createElement('<div class="shade"></div>');
    }

    static createBarrierElement() {
        return createElement('<div class="barrier"></div>');
    }

    constructor({
        stx,
        relative = false,
        draggable = true,
        visible = true,
        barrier = Barrier.BARRIER_SINGLE,
    }) {
        this._barrier = Barrier.createBarrierElement();
        this._stx = stx;

        this.barrier1 = new PriceLine({ stx });
        this.barrier2 = new PriceLine({ stx });

        this._setupConstrainBarrierPrices();

        this.barrier1.onPriceChanged(this._drawShadedArea.bind(this));
        this.barrier2.onPriceChanged(this._drawShadedArea.bind(this));

        this._barrier.appendChild(this.barrier1.element);
        this._barrier.appendChild(this.barrier2.element);

        this.barrier1.price = this.barrier1.price + 1;
        this.barrier2.price = this.barrier2.price - 1;
        this._chart = stx.chart;

        this._shade1 = Barrier.createShadeElement();
        this._shade2 = Barrier.createShadeElement();
        this._barrier.appendChild(this._shade1);
        this._barrier.appendChild(this._shade2);

        const holder = this._chart.panel.holder;
        holder.appendChild(this._barrier);

        this.shadeColor = 'rgba(140, 193, 118, 0.3)';
        this.barrierState = barrier;
        stx.append('draw', this._drawShadedArea.bind(this));

        this.draggable = draggable;
        this.visible = visible;
    }

    _setupConstrainBarrierPrices() {
        // barrier 1 cannot go below barrier 2
        this.barrier1.constrainPrice = (newPrice) => {
            if (this.barrier2.visible) {
                if (newPrice < this.barrier2.price + Barrier.MIN_DIFFERENCE_BETWEEN_BARRIERS) {
                    return this.barrier1.price;
                }
            }

            return newPrice;
        };

        // barrier 2 cannot go above barrier 1
        this.barrier2.constrainPrice = (newPrice) => {
            if (newPrice > this.barrier1.price - Barrier.MIN_DIFFERENCE_BETWEEN_BARRIERS) {
                return this.barrier2.price;
            }

            return newPrice;
        };
    }

    get visible() {
        return this._visible;
    }

    set visible(visible) {
        if (this._visible === visible) return;

        this._visible = visible;

        if (visible) {
            this.barrierState = this.barrierState; // restore barrier state
            this.barrier1.visible = true;
        } else {
            // Also disable visibility of barriers to turn off draw updates
            this.barrier1.visible = false;
            this.barrier2.visible = false;
        }

        setHidden(this._barrier, !visible);
    }

    get barrierState() {
        return this._barrierState;
    }

    get shadeColor() {
        return this._shadeColor;
    }

    get draggable() {
        return this.barrier1.draggable;
    }

    set draggable(value) {
        this.barrier1.draggable = value;
        this.barrier2.draggable = value;
    }

    set shadeColor(shadeColor) {
        this._shadeColor = shadeColor;
        this._shade1.style.backgroundColor = shadeColor;
        this._shade2.style.backgroundColor = shadeColor;
    }

    set barrierState(barrierState) {
        this._barrierState = barrierState;

        const noShade =
            this._barrierState === Barrier.BARRIER_SINGLE
            || this._barrierState === Barrier.BARRIER_DOUBLE;

        if (noShade) {
            setHidden(this._shade1, true);
            setHidden(this._shade2, true);
        } else {
            const shade2Enable =
                this._barrierState === Barrier.BARRIER_OUTSIDE;

            setHidden(this._shade1, false);
            setHidden(this._shade2, !shade2Enable);

            this._drawShadedArea();
        }

        const showBarrier2 =
            this._barrierState === Barrier.BARRIER_OUTSIDE
            || this._barrierState === Barrier.BARRIER_BETWEEN
            || this._barrierState === Barrier.BARRIER_DOUBLE;

        this.barrier2.visible = showBarrier2;
    }

    _isBarriersOffScreen() {
        return this.barrier1.element.getAttribute('off-screen')
            && this.barrier2.element.getAttribute('off-screen');
    }

    _drawShadedArea() {
        if (!this.visible) return;

        if (this._barrierState === Barrier.BARRIER_ABOVE) {
            this._shadeAbove(1);
        } else if (this._barrierState === Barrier.BARRIER_BELOW) {
            this._shadeBelow(1);
        } else if (this._barrierState === Barrier.BARRIER_BETWEEN) {
            this._shadeBetween();
        } else if (this._barrierState === Barrier.BARRIER_OUTSIDE) {
            this._shadeAbove(1);
            this._shadeBelow(2);
        }

        if (this.barrier2.visible && this._isBarriersOffScreen()) {
            const order = (this.barrier1.top === 0) ? null : 101;
            this.barrier1.element.style.zIndex = order;
        }
    }

    _calcBottomShade(barrierId) {
        return this._chart.panel.height - this[`barrier${barrierId}`].top - Barrier.MARGIN_OFFSET;
    }

    _calcTopShade(barrierId) {
        return this[`barrier${barrierId}`].top + Barrier.MARGIN_OFFSET;
    }

    _shadeBetween() {
        const top = this._calcTopShade(1);
        const bottom = this._calcBottomShade(2);
        this._shade1.style.top = `${top}px`;
        this._shade1.style.bottom = `${bottom}px`;
    }

    _shadeBelow(barrierId) {
        const top = this._calcTopShade(barrierId);
        const shadeName = `_shade${barrierId}`;
        this[shadeName].style.top = `${top}px`;
        this[shadeName].style.bottom = '0px';
    }

    _shadeAbove(barrierId) {
        const bottom = this._calcBottomShade(barrierId);
        const shadeName = `_shade${barrierId}`;
        this[shadeName].style.top = '0px';
        this[shadeName].style.bottom = `${bottom}px`;
    }
}

export default Barrier;
