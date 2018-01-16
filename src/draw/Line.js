import { CIQ, $$$ } from '../../js/chartiq';
import html from './Line.html';
import { createElement } from '../components/ui/utils';

class Line {
    static get DOM() {
        if (!Line._DOM) {
            Line._DOM = createElement(html);
        }
        return Line._DOM;
    }

    constructor({
        stx,
        lineColor = Line.COLOR_GREEN,
        visible = true,
        pipSize = 2,
        price,
    }) {
        this._stx = stx;
        this._chart = stx.chart;
        this._price = price;
        this._pipSize = pipSize;

        this._line = $$$('.drag-price-line', Line.DOM).cloneNode(true);
        this._drag = $$$('.drag-line', this._line);
        this._linePrice = $$$('.tfc-price', this._line);
        this._shade = $$$('.tfc-shade', Line.DOM).cloneNode(true);

        this.lineColor = lineColor;

        const holder = this._chart.panel.holder;
        holder.appendChild(this._line);
        holder.appendChild(this._shade);


        this.visible = visible;
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

    _startDrag(e) {
        this._modalBegin();
        CIQ.appendClassName(this._line, 'dragging');
    }

    _dragLine(e) {
    }

    _endDrag(e) {
        this._modalEnd();
        CIQ.unappendClassName(this._line, 'dragging');
    }

    get lineColor() {
        return this._lineColor;
    }

    set lineColor(lineColor) {
        this._lineColor = lineColor;
        this._drag.style.color = lineColor;
    }

    get visible() {
        return !!this._visible;
    }

    set visible(value) {
        this._visible = value;
        if (this._visible) {
            this._line.removeAttribute('hidden');
        } else {
            this._line.setAttribute('hidden', true);
        }
    }
}


export default Line;
