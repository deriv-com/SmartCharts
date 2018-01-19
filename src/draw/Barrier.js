import PriceLine from './PriceLine';
import { createElement, setHidden } from '../components/ui/utils';

class Barrier {
    static get SHADE_NONE_SINGLE() { return 'SHADE_NONE_SINGLE'; }
    static get SHADE_NONE_DOUBLE() { return 'SHADE_NONE_DOUBLE'; }
    static get SHADE_ABOVE() { return 'SHADE_ABOVE'; }
    static get SHADE_BELOW() { return 'SHADE_BELOW'; }
    static get SHADE_BETWEEN() { return 'SHADE_BETWEEN'; }
    static get SHADE_OUTSIDE() { return 'SHADE_OUTSIDE'; }
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
        shade = Barrier.SHADE_NONE_SINGLE,
    }) {
        this._barrier = Barrier.createBarrierElement();
        this._stx = stx;

        this._barrier1 = new PriceLine({ stx, relative });
        this._barrier2 = new PriceLine({ stx, relative });

        this._setupConstrainBarrierPrices();

        this._barrier1.onPriceChanged(this._drawShadedArea.bind(this));
        this._barrier2.onPriceChanged(this._drawShadedArea.bind(this));

        this._barrier.appendChild(this._barrier1.element);
        this._barrier.appendChild(this._barrier2.element);

        this._chart = stx.chart;

        const distance = this._chart.yAxis.priceTick;
        this._barrier1.price += distance;
        this._barrier2.price -= distance;

        this._shade1 = Barrier.createShadeElement();
        this._shade2 = Barrier.createShadeElement();
        this._barrier.appendChild(this._shade1);
        this._barrier.appendChild(this._shade2);

        const holder = this._chart.panel.holder;
        holder.appendChild(this._barrier);

        this.shadeColor = 'rgba(140, 193, 118, 0.3)';
        this.shadeState = shade;
        stx.append('draw', this._drawShadedArea.bind(this));

        this.draggable = draggable;
        this.visible = visible;
    }

    get relative() {
        return this._barrier1.relative;
    }

    set relative(value) {
        this._barrier1.relative = value;
        this._barrier2.relative = value;
    }

    _setupConstrainBarrierPrices() {
        // barrier 1 cannot go below barrier 2
        this._barrier1.constrainPrice = (newPrice) => {
            if (this._barrier2.visible) {
                if (newPrice < this._barrier2.realPrice + Barrier.MIN_DIFFERENCE_BETWEEN_BARRIERS) {
                    return this._barrier1.realPrice;
                }
            }

            return newPrice;
        };

        // barrier 2 cannot go above barrier 1
        this._barrier2.constrainPrice = (newPrice) => {
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
        if (this._visible === visible) return;

        this._visible = visible;

        if (visible) {
            this.shadeState = this.shadeState; // restore barrier state
            this._barrier1.visible = true;
        } else {
            // Also disable visibility of barriers to turn off draw updates
            this._barrier1.visible = false;
            this._barrier2.visible = false;
        }

        setHidden(this._barrier, !visible);
    }

    get shadeState() {
        return this._shadeState;
    }

    get shadeColor() {
        return this._shadeColor;
    }

    get draggable() {
        return this._barrier1.draggable;
    }

    set draggable(value) {
        this._barrier1.draggable = value;
        this._barrier2.draggable = value;
    }

    set shadeColor(shadeColor) {
        this._shadeColor = shadeColor;
        this._shade1.style.backgroundColor = shadeColor;
        this._shade2.style.backgroundColor = shadeColor;
    }

    set shadeState(shadeState) {
        this._shadeState = shadeState;

        const noShade =
            this._shadeState === Barrier.SHADE_NONE_SINGLE
            || this._shadeState === Barrier.SHADE_NONE_DOUBLE;

        if (noShade) {
            setHidden(this._shade1, true);
            setHidden(this._shade2, true);
        } else {
            const shade2Enable =
                this._shadeState === Barrier.SHADE_OUTSIDE;

            setHidden(this._shade1, false);
            setHidden(this._shade2, !shade2Enable);

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
        if (!this.visible) return;

        if (this._shadeState === Barrier.SHADE_ABOVE) {
            this._shadeAbove(1);
        } else if (this._shadeState === Barrier.SHADE_BELOW) {
            this._shadeBelow(1);
        } else if (this._shadeState === Barrier.SHADE_BETWEEN) {
            this._shadeBetween();
        } else if (this._shadeState === Barrier.SHADE_OUTSIDE) {
            this._shadeAbove(1);
            this._shadeBelow(2);
        }

        if (this._barrier2.visible && this._isBarriersOffScreen()) {
            const order = (this._barrier1.top === 0) ? null : 101;
            this._barrier1.element.style.zIndex = order;
        }
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
