// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'even... Remove this comment to see the full error message
import EventEmitter from 'event-emitter-es6';
import { action, computed, observable, when } from 'mobx';
import { connect } from './Connect';
import { ARROW_HEIGHT, DIRECTIONS } from '../utils';

const LINE_OFFSET_HEIGHT = 4;
const LINE_OFFSET_HEIGHT_HALF = LINE_OFFSET_HEIGHT >> 1;

export default class PriceLineStore {
    __top: any;
    _emitter: any;
    _initialPosition: any;
    _injectionId: any;
    _line: any;
    _priceConstrainer: any;
    _startDragPrice: any;
    className: any;
    hideBarrierLine: any;
    hideOffscreenLine: any;
    mainStore: any;
    opacityOnOverlap: any;
    showOffscreenArrows: any;
    _relative = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable draggable = true;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isDragging = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable visible = true;
    // @observable top = 0;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable _price = 0;
    // @observable zIndex;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable offScreen = false;
    // @observable uncentered = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable title;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isOverlapping;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable offScreenDirection;

    set zIndex(value: any) {
        if (this._line) {
            this._line.style.zIndex = value;
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get pip() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }

    constructor(mainStore: any) {
        this.mainStore = mainStore;
        this._emitter = new EventEmitter({ emitDelay: 0 });
        when(() => this.context, this.onContextReady);
    }

    destructor() {
        this.stx.removeInjection(this._injectionId);
    }

    onContextReady = () => {
        this._injectionId = this.stx.append('draw', this._draw);
    };

    init = () => {
        const exitIfNotisDraggable = (e: any, callback: any) => {
            if (this.visible && this.draggable) {
                callback.call(this, e);
            }
        };
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
        CIQ.safeDrag(
            this._line,
            (e: any) => exitIfNotisDraggable(e, this._startDrag),
            (e: any) => exitIfNotisDraggable(e, this._dragLine),
            (e: any) => exitIfNotisDraggable(e, this._endDrag)
        );
    };

    static get EVENT_PRICE_CHANGED() {
        return 'EVENT_PRICE_CHANGED';
    }
    static get EVENT_DRAG_RELEASED() {
        return 'EVENT_DRAG_RELEASED';
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get priceDisplay() {
        let display = this._price.toFixed(this.pip);
        if (this.relative && this._price > 0) {
            display = `+${display}`;
        }
        return display;
    }

    get price() {
        return this._price;
    }

    set price(value) {
        if (value !== this._price) {
            this._price = value;
            this._draw();
            this._emitter.emit(PriceLineStore.EVENT_PRICE_CHANGED, this._price);
        }
    }

    get relative() {
        return this._relative;
    }

    set relative(value) {
        if (this._relative === value) {
            return;
        }

        this._relative = value;
        // convert between relative and absolute
        const currentQuote = this.mainStore.chart.currentCloseQuote();
        let currentPrice = currentQuote ? currentQuote.Close : 0;
        if (this._relative) {
            currentPrice = -currentPrice;
        }
        this.price = this._price + currentPrice;
    }

    get context() {
        return this.mainStore.chart.context;
    }

    get stx() {
        return this.context.stx;
    }

    get chart() {
        return this.stx.chart;
    }

    set priceConstrainer(value: any) {
        this._priceConstrainer = value;
    }

    get realPrice() {
        return this.relative ? this.mainStore.chart.currentCloseQuote().Close + this._price : this._price;
    }

    get yAxiswidth() {
        return this.mainStore.chart.yAxiswidth;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setDragLine(el: any) {
        this._line = el;
        if (this._line) {
            this._draw();
        }
    }

    _modalBegin() {
        if (this.stx.grabbingScreen) {
            return;
        }
        this.stx.editingAnnotation = true;
        this.stx.modalBegin();
    }

    _modalEnd() {
        this.stx.modalEnd();
        this.stx.editingAnnotation = false;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound _startDrag() {
        this._modalBegin();
        this.isDragging = true;
        this._initialPosition = this.top;
        this._startDragPrice = this._price;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound _dragLine(e: any) {
        if (!this._line) {
            return;
        }
        const newTop = this._initialPosition + e.displacementY;
        const newCenter = newTop + LINE_OFFSET_HEIGHT_HALF;
        let newPrice = this._priceFromLocation(newCenter);

        if (this._priceConstrainer) {
            newPrice = this._priceConstrainer(newPrice);
        }
        if (this.relative) {
            newPrice -= this.mainStore.chart.currentCloseQuote().Close;
        }

        this.price = newPrice;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound _endDrag() {
        this._modalEnd();
        this.isDragging = false;

        if (this._startDragPrice.toFixed(this.pip) !== this._price.toFixed(this.pip)) {
            this._emitter.emit(PriceLineStore.EVENT_DRAG_RELEASED, this._price);
        }
    }

    _locationFromPrice(p: any) {
        return this.stx.pixelFromPrice(p, this.chart.panel) - this.chart.panel.top;
    }

    _priceFromLocation(y: any) {
        const price = this.stx.valueFromPixel(y + this.chart.panel.top, this.chart.panel);

        return price;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound _calculateTop = () => {
        if (this.stx.currentQuote() === null) {
            return;
        }

        let top = this._locationFromPrice(this.realPrice);

        // keep line on chart even if price is off viewable area:
        if (top < 0) {
            // this.uncentered = true;
            if (top < -LINE_OFFSET_HEIGHT_HALF) {
                this.offScreenDirection = DIRECTIONS.UP;
            }
            top = 0;
        } else if (top + LINE_OFFSET_HEIGHT > this.chart.panel.height) {
            // this.uncentered = true;
            if (top + LINE_OFFSET_HEIGHT - this.chart.panel.height > LINE_OFFSET_HEIGHT_HALF) {
                this.offScreenDirection = DIRECTIONS.DOWN;
            }
            top = this.chart.panel.height - LINE_OFFSET_HEIGHT;
        } else {
            // this.uncentered = false;
            this.offScreenDirection = null;
        }
        this.offScreen = !!this.offScreenDirection;

        if (top + 30 > this.chart.panel.height) {
            top = this.chart.panel.height - 30;
        } else if (top < 10) {
            top = 10;
        }

        if (this.offScreenDirection && this.showOffscreenArrows) {
            top += this.offScreenDirection === DIRECTIONS.UP ? +ARROW_HEIGHT : -ARROW_HEIGHT;
        }

        if (this.opacityOnOverlap) {
            this.isOverlapping = this.overlapCheck(top);
        }

        return Math.round(top) | 0;
    };

    // Mantually update the dop to improve performance.
    // We don't pay for react reconciler and mobx observable tracking in animation frames.
    set top(v) {
        this.__top = v;
        this._line.style.transform = `translateY(${this.top - 13}px)`;
    }
    get top() {
        return this.__top;
    }

    _draw = () => {
        if (this.visible && this._line) {
            this.top = this._calculateTop();
        }
    };

    onPriceChanged(callback: any) {
        this._emitter.on(PriceLineStore.EVENT_PRICE_CHANGED, callback);
    }

    onDragReleased(callback: any) {
        this._emitter.on(PriceLineStore.EVENT_DRAG_RELEASED, callback);
    }

    overlapCheck(top: any) {
        const { _barriers } = this.mainStore.chart;

        const filtered_barriers = _barriers.filter((a: any) => a._high_barrier.price !== 0);
        const current_barrier_idx = filtered_barriers.findIndex((b: any) => b._high_barrier === this);

        for (let i = 0; i < filtered_barriers.length; i++) {
            if (i === current_barrier_idx) {
                continue;
            }

            const barrier = filtered_barriers[i];
            const diffTop = Math.abs(barrier._high_barrier.top - top);

            if (diffTop < 25) {
                return true;
            }
        }

        return false;
    }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
    connect = connect(() => ({
        priceDisplay: this.priceDisplay,
        visible: this.visible,
        setDragLine: this.setDragLine,
        className: this.className,
        draggable: this.draggable,
        isDragging: this.isDragging,
        init: this.init,
        title: this.title,
        yAxiswidth: this.yAxiswidth,
        offScreen: this.offScreen,
        hideBarrierLine: this.hideBarrierLine,
        hideOffscreenLine: this.hideOffscreenLine,
        offScreenDirection: this.offScreenDirection,
        isOverlapping: this.isOverlapping,
        // zIndex: this.zIndex,
    }));
}
