import EventEmitter from 'event-emitter-es6';
import CIQ from 'chartiq';
import { createElement } from '../components/ui/utils';
import html from './PriceLine.html';
import Line from './Line';

class PriceLine extends Line {
    static get COLOR_GREEN() { return 'green'; }
    static get COLOR_RED() { return 'red'; }
    static get EVENT_PRICE_CHANGED() { return 'EVENT_PRICE_CHANGED'; }

    constructor({
        stx,
        lineColor = PriceLine.COLOR_GREEN,
        relative = false,
        visible = true,
        pipSize = 2,
        price,
        draggable = true,
    }) {
        super({
            stx, visible, pipSize, draggable,
        });
        const element = createElement(html);
        this._line.appendChild(element);
        this._priceText = $$$('.price', element);
        this._emitter = new EventEmitter();
        CIQ.appendClassName(this._line, 'horizontal');

        this._stx.append('draw', this._draw.bind(this));

        this._price = price || (relative ? 0 : this._stx.currentQuote().Close);

        this.lineColor = lineColor;
        this._relative = relative;
    }

    get relative() {
        return this._relative;
    }

    set relative(value) {
        if (this._relative === value) return;

        this._relative = value;
        const currentPrice = this._stx.currentQuote().Close;

        if (this._relative) {
            this._price -= currentPrice; // absolute to relative
        } else {
            this._price += currentPrice; // relative to absolute
        }
    }

    set priceConstrainer(value) {
        this._priceConstrainer = value;
    }

    _startDrag(e) {
        super._startDrag(e);
        this._initialPosition = CIQ.stripPX(this._line.style.top);
    }

    _dragLine(e) {
        const newTop = this._initialPosition + e.displacementY;
        const newCenter = newTop + (this._line.offsetHeight / 2);
        let newPrice = this._priceFromLocation(newCenter);

        if (this._priceConstrainer) newPrice = this._priceConstrainer(newPrice);
        if (this.relative) newPrice -= this._stx.currentQuote().Close;

        this.price = this._snapPrice(newPrice);
    }

    _snapPrice(price) {
        // snap the limit price to the desired interval if one defined
        let minTick = this._stx.chart.yAxis.minimumPriceTick;
        if (!minTick) minTick = 0.00000001; // maximum # places
        let numToRoundTo = 1 / minTick;
        price = Math.round(price * numToRoundTo) / numToRoundTo;

        return price;
    }

    _locationFromPrice(p) {
        return (
            this._stx.pixelFromPrice(p, this._chart.panel) -
            this._chart.panel.top
        );
    }

    _priceFromLocation(y) {
        let price = this._stx.valueFromPixel(
            y + this._chart.panel.top,
            this._chart.panel,
        );

        return this._snapPrice(price);
    }

    _positionAtPrice(price) {
        let top = this._locationFromPrice(price);
        top -= (this._line.offsetHeight / 2);

        // keep line on chart even if price is off viewable area:
        if (top < 0) {
            this._line.setAttribute('uncentered', true);
            if (top < this._line.offsetHeight / 2 * -1) {
                this._line.setAttribute('off-screen', true);
            }
            top = 0;
        } else if (top + this._line.offsetHeight > this._chart.panel.height) {
            this._line.setAttribute('uncentered', true);
            if ((top + this._line.offsetHeight) - this._chart.panel.height > this._line.offsetHeight / 2) {
                this._line.setAttribute('off-screen', true);
            }
            top = this._chart.panel.height - this._line.offsetHeight;
        } else {
            this._line.removeAttribute('uncentered');
            this._line.removeAttribute('off-screen');
        }

        this._line.style.top = `${top}px`;
    }

    get realPrice() {
        return this.relative ? (this._stx.currentQuote().Close + this.price) : this.price;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        if (value !== this._price) {
            this._price = value;
            this._draw();
            this._emitter.emit(PriceLine.EVENT_PRICE_CHANGED, this._price);
        }
    }

    onPriceChanged(callback) {
        this._emitter.on(PriceLine.EVENT_PRICE_CHANGED, callback);
    }

    _draw() {
        if (this.visible) {
            this._positionAtPrice(this.realPrice);
            this._priceText.textContent = this.realPrice.toFixed(this._pipSize);
        }
    }

    get top() {
        return CIQ.stripPX(this._line.style.top);
    }

    get lineColor() {
        return this._lineColor;
    }

    set lineColor(lineColor) {
        this._lineColor = lineColor;
        CIQ.unappendClassName(this._line, PriceLine.COLOR_RED);
        CIQ.unappendClassName(this._line, PriceLine.COLOR_GREEN);
        CIQ.appendClassName(this._line, this._lineColor);
    }
}

export default PriceLine;
