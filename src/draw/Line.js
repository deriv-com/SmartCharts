import CIQ from 'chartiq'; // eslint-disable-line
import html from './Line.html';
import { createElement } from '../components/ui/utils';

class Line {
    static get SHADE_NONE() { return 'SHADE_NONE'; }
    static get SHADE_ABOVE() { return 'SHADE_ABOVE'; }
    static get SHADE_BELOW() { return 'SHADE_BELOW'; }

    static get COLOR_GREEN() { return 'green'; }
    static get COLOR_RED() { return 'red'; }

    static get DOM() {
        if (!Line._DOM) {
            Line._DOM = createElement(html);
        }
        return Line._DOM;
    }

    _modalBegin() {
        if (this._stx.grabbingScreen) return;
        this._stx.editingAnnotation = true;
        this._stx.modalBegin();
    }
    _modalEnd() {
        this._stx.modalEnd();
        this._stx.editingAnnotation = false;
    }

    _startDrag(e, node) {
        this._initialPosition = CIQ.stripPX(node.style.top);
        this._stx.modalBegin();
        CIQ.appendClassName(node, 'dragging');
    }
    _endDrag(e, node) {
        this._stx.modalEnd();
        CIQ.unappendClassName(node, 'dragging');
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
            this._stx.pixelFromPriceTransform(p, this._chart.panel) -
            this._chart.panel.top
        );
    }
    _priceFromLocation(y) {
        let price = this._stx.valueFromPixelUntransform(
            y + this._chart.panel.top,
            this._chart.panel,
        );

        return this._snapPrice(price);
    }

    /**
     * Positions nodes at the given price.
     * @param  {number} price       The price (relative to the y-axis)
     * @param  {array} nodes       An array of nodes to move to the desired location
     * @param  {string} [where]       If either "top" or "bottom", then the node will not be allowed to overlap the noOverlap nodes
     * @param  {array} [noOverlap]   An array of nodes which cannot be overlapped
     * @param  {boolean} [keepOnChart] If true then the nodes will not be allowed to move off the chart
     */
    _positionAtPrice(price, nodes, where, noOverlap, keepOnChart) {
        if (!where) where = 'center';
        let px = this._locationFromPrice(price),
            node;
        for (let i = 0; i < nodes.length; i++) {
            node = nodes[i];
            let top = null;
            let j,
                oNode;
            if (where === 'center') {
                top = (px - (node.offsetHeight / 2));
            } else if (where === 'top') {
                if (noOverlap) {
                    for (j = 0; j < noOverlap.length; j++) {
                        oNode = noOverlap[j];
                        let bottom = CIQ.stripPX(oNode.style.top) + oNode.offsetHeight;
                        if (bottom > px) px = bottom;
                    }
                }
                top = Math.round(px) + 1;
            } else if (where === 'bottom') {
                if (noOverlap) {
                    for (j = 0; j < noOverlap.length; j++) {
                        oNode = noOverlap[j];
                        top = CIQ.stripPX(oNode.style.top);
                        if (px > top) px = top;
                    }
                }
                top = Math.round(px - node.offsetHeight);
            }
            node.removeAttribute('uncentered');
            node.removeAttribute('off-screen');
            if (keepOnChart) {
                if (top < 0) {
                    node.setAttribute('uncentered', true);
                    if (top < node.offsetHeight / 2 * -1) {
                        node.setAttribute('off-screen', true);
                    }
                    top = 0;
                } else if (top + node.offsetHeight > this._chart.panel.height) {
                    node.setAttribute('uncentered', true);
                    if ((top + node.offsetHeight) - this._chart.panel.height > node.offsetHeight / 2) {
                        node.setAttribute('off-screen', true);
                    }
                    top = this._chart.panel.height - node.offsetHeight;
                }
            }
            if (top !== null) node.style.top = `${top}px`;
        }
    }

    _dragLine(e) {
        let newTop = this._initialPosition + e.displacementY;
        let newCenter = newTop + (this._line.offsetHeight / 2);
        let newPrice = this._priceFromLocation(newCenter);

        // let currentPrice = this.stx.currentQuote().Close;
        if (newPrice < 0) newPrice = 0;

        this.price = this._snapPrice(newPrice);
        this._draw();
    }

    constructor({
        stx,
        shadeState = Line.SHADE_NONE,
        shadeColor = Line.COLOR_GREEN,
        lineColor = Line.COLOR_GREEN,
        visible = true,
        pipSize = 2,
        price,
    }) {
        this._stx = stx;
        this._chart = stx.chart;
        this._price = price;
        this._pipSize = pipSize;

        this._line = $$$('.drag-price-line', Line.DOM).cloneNode(true);  // eslint-disable-line
        this._linePrice = $$$('.tfc-price', this._line); // eslint-disable-line
        this._shade = $$$('.tfc-shade', Line.DOM).cloneNode(true); // eslint-disable-line

        this.shadeState = shadeState;
        this.shadeColor = shadeColor;
        this.lineColor = lineColor;

        const holder = this._chart.panel.holder;
        holder.appendChild(this._line);
        // holder.appendChild(this._linePrice);
        holder.appendChild(this._shade);

        CIQ.safeMouseOver(this._line, this._modalBegin.bind(this));
        CIQ.safeMouseOut(this._line, this._modalEnd.bind(this));
        CIQ.safeMouseOver(this._linePrice, this._modalBegin.bind(this));
        CIQ.safeMouseOut(this._linePrice, this._modalEnd.bind(this));

        CIQ.safeDrag(
            this._line,
            e => this._startDrag(e, this._line),
            e => this._dragLine(e),
            e => this._endDrag(e, this._line),
        );

        this.visible = visible;
        this._draw();
        this._drawHook = this._draw.bind(this);
        this._stx.append('draw', this._drawHook);
    }
    _draw() {
        if (this.visible) {
            this._positionAtPrice(this.price, [this._line], 'center', null, true);
            this._linePrice.textContent = this.price.toFixed(this._pipSize);
            if (this._shadeState === Line.SHADE_ABOVE) {
                this._shade.style.top = '0px';
                this._shade.style.bottom = `${
                    this._chart.panel.height - this._locationFromPrice(this.price)
                }px`;
            } else if (this._shadeState === Line.SHADE_BELOW) {
                this._shade.style.bottom = '0px';
                this._shade.style.top = `${this._locationFromPrice(this.price)}px`;
            }
        }
    }

    get price() {
        if (this._price === undefined || this._price === null) {
            this._price = this._stx.currentQuote().Close;
        }
        return this._price;
    }
    set price(value) {
        this._price = value;
        this._draw();
    }
    get lineColor() {
        return this._lineColor;
    }
    set lineColor(lineColor) {
        this._lineColor = lineColor;
        CIQ.unappendClassName(this._line, Line.COLOR_RED);
        CIQ.unappendClassName(this._line, Line.COLOR_GREEN);
        CIQ.appendClassName(this._line, this._lineColor);
        this._draw();
    }
    get shadeState() {
        return this._shadeState;
    }
    set shadeState(shadeState) {
        this._shadeState = shadeState;
        if (this._shadeState === Line.SHADE_NONE) {
            this._shade.style.display = 'none';
            CIQ.unappendClassName(this._shade, 'shade-above');
            CIQ.unappendClassName(this._shade, 'shade-below');
            CIQ.appendClassName(this._shade, 'tfc-neutral');
        } else {
            this._shade.style.display = '';
            CIQ.unappendClassName(this._shade, 'tfc-neutral');

            if (this._shadeState === Line.SHADE_ABOVE) {
                CIQ.swapClassName(this._shade, 'shade-above', 'shade-below');
            } else { // SHADE_BELOW
                CIQ.swapClassName(this._shade, 'shade-below', 'shade-above');
            }
        }
        this._draw();
    }
    get shadeColor() {
        return this._shadeColor;
    }
    set shadeColor(shadeColor) {
        this._shadeColor = shadeColor;
        if (this._shadeColor === Line.COLOR_GREEN) {
            CIQ.swapClassName(this._shade, Line.COLOR_GREEN, Line.COLOR_RED);
        } else {
            CIQ.swapClassName(this._shade, Line.COLOR_RED, Line.COLOR_GREEN);
        }
        this._draw();
    }
    get visible() {
        return !!this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible) {
            this._line.style.display = '';
            this._linePrice.style.display = '';
            if (this.shadeState !== Line.SHADE_NONE) {
                this._shade.style.display = '';
            }
        } else {
            this._line.style.display = 'none';
            this._linePrice.style.display = 'none';
            this._shade.style.display = 'none';
        }
        this._draw();
    }
}


export default Line;
