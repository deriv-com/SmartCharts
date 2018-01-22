/* global $$$ */
import CIQ from 'chartiq';
import html from './Line.html';
import { createElement, setHidden } from '../components/ui/utils';

class Line {
    static createLine() {
        return createElement(html);
    }

    constructor({
        stx,
        visible = true,
        pipSize = 2,
        draggable = true,
    }) {
        this._stx = stx;
        this._chart = stx.chart;
        this._pipSize = pipSize;

        this._line = Line.createLine();
        this._drag = $$$('.drag-line', this._line);

        this.visible = visible;

        const exitIfNotDraggable = (e, callback) => {
            if (this.visible && this.draggable) callback.call(this, e);
        };

        CIQ.safeDrag(
            this._line,
            e => exitIfNotDraggable(e, this._startDrag),
            e => exitIfNotDraggable(e, this._dragLine),
            e => exitIfNotDraggable(e, this._endDrag),
        );

        this.draggable = draggable;
    }

    get element() {
        return this._line;
    }

    get draggable() {
        return this._draggable;
    }

    set draggable(value) {
        this._draggable = value;
        if (this._draggable) {
            CIQ.appendClassName(this._line, 'draggable');
        } else {
            CIQ.unappendClassName(this._line, 'draggable');
        }
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

    get visible() {
        return !!this._visible;
    }

    set visible(value) {
        this._visible = value;
        setHidden(this._line, !this._visible);
    }
}


export default Line;
