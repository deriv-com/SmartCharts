import EventEmitter from 'event-emitter-es6';
import { action, computed, observable, when } from 'mobx';
import { connect } from './Connect';

const LINE_OFFSET_HEIGHT = 4;
const LINE_OFFSET_HEIGHT_HALF = LINE_OFFSET_HEIGHT >> 1;

export default class PriceLineStore {
    _relative = false;
    @observable draggable = true;
    @observable isDragging = false;
    @observable visible = true;
    // @observable top = 0;
    @observable _price = 0;
    // @observable zIndex;
    offScreen = false;
    // @observable uncentered = false;


    set zIndex(value) {
        if (this._line) {
            this._line.style.zIndex = value;
        }
    }

    @computed get pip() { return this.mainStore.chart.currentActiveSymbol.decimal_places; }

    constructor(mainStore) {
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
        const exitIfNotisDraggable = (e, callback) => {
            if (this.visible && this.draggable) { callback.call(this, e); }
        };
        CIQ.safeDrag(
            this._line,
            e => exitIfNotisDraggable(e, this._startDrag),
            e => exitIfNotisDraggable(e, this._dragLine),
            e => exitIfNotisDraggable(e, this._endDrag),
        );
    };

    static get EVENT_PRICE_CHANGED() { return 'EVENT_PRICE_CHANGED'; }
    static get EVENT_DRAG_RELEASED() { return 'EVENT_DRAG_RELEASED'; }

    @computed get priceDisplay() {
        let display = this._price.toFixed(this.pip);
        if (this.relative && this._price > 0) { display = `+${display}`; }
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
        if (this._relative === value) { return; }

        this._relative = value;
        // convert between relative and absolute
        const currentQuote = this.stx.currentQuote();
        let currentPrice =  currentQuote ? currentQuote.Close : 0;
        if (this._relative) { currentPrice = -currentPrice; }
        this.price = this._price + currentPrice;
    }

    get context() { return this.mainStore.chart.context; }

    get stx() { return this.context.stx; }

    get chart() { return this.stx.chart; }

    set priceConstrainer(value) {
        this._priceConstrainer = value;
    }

    get realPrice() {
        return this.relative ? this.stx.currentQuote().Close + this._price : this._price;
    }

    @action.bound setDragLine(el) {
        this._line = el;
        if (this._line) { this._draw(); }
    }

    _modalBegin() {
        if (this.stx.grabbingScreen) { return; }
        this.stx.editingAnnotation = true;
        this.stx.modalBegin();
    }

    _modalEnd() {
        this.stx.modalEnd();
        this.stx.editingAnnotation = false;
    }

    @action.bound _startDrag() {
        this._modalBegin();
        this.isDragging = true;
        this._initialPosition = this.top;
        this._startDragPrice = this._price;
    }

    @action.bound _dragLine(e) {
        if (!this._line) { return; }
        const newTop = this._initialPosition + e.displacementY;
        const newCenter = newTop + LINE_OFFSET_HEIGHT_HALF;
        let newPrice = this._priceFromLocation(newCenter);

        if (this._priceConstrainer) { newPrice = this._priceConstrainer(newPrice); }
        if (this.relative) { newPrice -= this.stx.currentQuote().Close; }

        this.price = newPrice;
    }

    @action.bound _endDrag() {
        this._modalEnd();
        this.isDragging = false;

        if (this._startDragPrice.toFixed(this.pip) !== this._price.toFixed(this.pip)) {
            this._emitter.emit(PriceLineStore.EVENT_DRAG_RELEASED, this._price);
        }
    }

    _locationFromPrice(p) {
        return (
            this.stx.pixelFromPrice(p, this.chart.panel)
            - this.chart.panel.top
        );
    }

    _priceFromLocation(y) {
        const price = this.stx.valueFromPixel(
            y + this.chart.panel.top,
            this.chart.panel,
        );

        return price;
    }

    _calculateTop = () => {
        if (this.stx.currentQuote() === null) { return; }

        let top = this._locationFromPrice(this.realPrice);

        // keep line on chart even if price is off viewable area:
        if (top < 0) {
            // this.uncentered = true;
            if (top < -LINE_OFFSET_HEIGHT_HALF) {
                this.offScreen = true;
            }
            top = 0;
        } else if (top + LINE_OFFSET_HEIGHT > this.chart.panel.height) {
            // this.uncentered = true;
            if ((top + LINE_OFFSET_HEIGHT) - this.chart.panel.height > LINE_OFFSET_HEIGHT_HALF) {
                this.offScreen = true;
            }
            top = this.chart.panel.height - LINE_OFFSET_HEIGHT;
        } else {
            // this.uncentered = false;
            this.offScreen = false;
        }


        if (top + 30 > this.chart.panel.height) {
            top = this.chart.panel.height - 30;
        } else if (top < 10) {
            top = 10;
        }

        return Math.round(top) | 0;
    }

    // Mantually update the dop to improve performance.
    // We don't pay for react reconciler and mobx observable tracking in animation frames.
    set top(v) {
        this.__top = v;
        this._line.style.transform = `translateY(${this.top}px)`;
    }
    get top() { return this.__top; }

    _draw = () =>  {
        if (this.visible && this._line) {
            this.top = this._calculateTop();
        }
    }

    onPriceChanged(callback) {
        this._emitter.on(PriceLineStore.EVENT_PRICE_CHANGED, callback);
    }

    onDragReleased(callback) {
        this._emitter.on(PriceLineStore.EVENT_DRAG_RELEASED, callback);
    }

    connect = connect(() => ({
        priceDisplay: this.priceDisplay,
        visible: this.visible,
        setDragLine: this.setDragLine,
        className: this.className,
        draggable: this.draggable,
        isDragging: this.isDragging,
        init: this.init,
        // zIndex: this.zIndex,
    }));
}
