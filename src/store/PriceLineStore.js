import EventEmitter from 'event-emitter-es6';
import { action, computed, observable, when } from 'mobx';
import { connect } from './Connect';

export default class PriceLineStore {
    _relative = false;
    @observable draggable = true;
    @observable isDragging = false;
    @observable visible = true;
    @observable top = 0;
    @observable _price = 0;
    @observable zIndex;
    @observable offScreen = false;
    @observable uncentered = false;

    @computed get pip() { return this.mainStore.chart.currentActiveSymbol.decimal_places; }

    constructor(mainStore) {
        this.mainStore = mainStore;
        this._emitter = new EventEmitter();
        when(() => this.context, this.onContextReady);
    }

    onContextReady = () => {
        this.stx.append('draw', this._draw.bind(this));
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

    get price() {
        return this._price;
    }

    set price(value) {
        if (value !== this._price) {
            this._price = +value.toFixed(this.pip);
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
        const currentPrice = this.stx.currentQuote().Close;

        if (this._relative) {
            this._price -= currentPrice; // absolute to relative
        } else {
            this._price += currentPrice; // relative to absolute
        }
    }

    get context() { return this.mainStore.chart.context; }

    get stx() { return this.context.stx; }

    get chart() { return this.stx.chart; }

    set priceConstrainer(value) {
        this._priceConstrainer = value;
    }

    @computed get priceDisplay() {
        return this.price.toFixed(this.pip);
    }

    get realPrice() {
        return this.relative ? +(this.stx.currentQuote().Close + this.price).toFixed(this.pip) : this.price;
    }

    @action.bound setDragLine(el) {
        this._line = el;
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

    _startDrag() {
        this._modalBegin();
        this.isDragging = true;
        this._initialPosition = this.top;
    }

    _dragLine(e) {
        if (!this._line) { return; }
        const newTop = this._initialPosition + e.displacementY;
        const newCenter = newTop + (this._line.offsetHeight / 2);
        let newPrice = this._priceFromLocation(newCenter);

        if (this._priceConstrainer) { newPrice = this._priceConstrainer(newPrice); }
        if (this.relative) { newPrice -= this.stx.currentQuote().Close; }

        this.price = this._snapPrice(newPrice);
    }

    _endDrag() {
        this._modalEnd();
        this.isDragging = false;
    }

    _locationFromPrice(p) {
        return (
            this.stx.pixelFromPrice(p, this.chart.panel) -
            this.chart.panel.top
        );
    }

    _snapPrice(price) {
        // snap the limit price to the desired interval if one defined
        let minTick = this.chart.yAxis.minimumPriceTick;
        if (!minTick) { minTick = 0.00000001; } // maximum # places
        let numToRoundTo = 1 / minTick;
        price = Math.round(price * numToRoundTo) / numToRoundTo;

        return price;
    }

    _priceFromLocation(y) {
        let price = this.stx.valueFromPixel(
            y + this.chart.panel.top,
            this.chart.panel,
        );

        return this._snapPrice(price);
    }

    _positionAtPrice(price) {
        let top = this._locationFromPrice(price);
        top -= (this._line.offsetHeight / 2);

        // keep line on chart even if price is off viewable area:
        if (top < 0) {
            this.uncentered = true;
            if (top < this._line.offsetHeight / 2 * -1) {
                this.offScreen = true;
            }
            top = 0;
        } else if (top + this._line.offsetHeight > this.chart.panel.height) {
            this.uncentered = true;
            if ((top + this._line.offsetHeight) - this.chart.panel.height > this._line.offsetHeight / 2) {
                this.offScreen = true;
            }
            top = this.chart.panel.height - this._line.offsetHeight;
        } else {
            this.uncentered = false;
            this.offScreen = false;
        }

        this.top = top;
    }

    _draw() {
        if (this.visible && this._line) {
            this._positionAtPrice(this.realPrice);
        }
    }

    onPriceChanged(callback) {
        this._emitter.on(PriceLineStore.EVENT_PRICE_CHANGED, callback);
    }

    connect = connect(() => ({
        priceDisplay: this.priceDisplay,
        visible: this.visible,
        setDragLine: this.setDragLine,
        className: this.className,
        draggable: this.draggable,
        isDragging: this.isDragging,
        init: this.init,
        zIndex: this.zIndex,
        offScreen: this.offScreen,
        uncentered: this.uncentered,
        top: this.top,
    }));
}
