import { action, computed, observable, when } from 'mobx';
import { connect } from './Connect';
import EventEmitter from 'event-emitter-es6';

export default class PriceLineStore {
    _relative = false;
    @observable isDraggable = true;
    @observable isDragging = false;
    @observable visible = false;
    @observable pip = 4;
    @observable top = 0;
    @observable _price = 0;

    constructor(mainStore) {
        this.mainStore = mainStore;
        this._emitter = new EventEmitter();
        when(() => this.context, this.onContextReady);
        window.pls = this;
    }

    onContextReady = () => {
        this.stx.append('draw', this._draw.bind(this));
        this.pip = this.mainStore.chart.currentActiveSymbol.decimal_places;
        setTimeout(() => {
            // TODO: get the quote only when it is available instead of using a timeout
            this._price = this.relative ? 0 : this.stx.currentQuote().Close;
            this.visible = true;
            this._draw();
        }, 2000);
    };

    init = () => {
        const exitIfNotisDraggable = (e, callback) => {
            if (this.visible && this.isDraggable) {callback.call(this, e);}
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
        if (this._relative === value) {return;}

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
        return this.relative ? (this.stx.currentQuote().Close + this.price) : this.price;
    }

    @action.bound setDragLine(el) {
        this._line = el;
    }

    _modalBegin() {
        if (this.stx.grabbingScreen) {return;}
        this.stx.editingAnnotation = true;
        this.stx.modalBegin();
    }

    _modalEnd() {
        this.stx.modalEnd();
        this.stx.editingAnnotation = false;
    }

    _startDrag(e) {
        this._modalBegin();
        this.isDragging = true;
        this._initialPosition = CIQ.stripPX(this._line.style.top);
    }

    _dragLine(e) {
        const newTop = this._initialPosition + e.displacementY;
        const newCenter = newTop + (this._line.offsetHeight / 2);
        let newPrice = this._priceFromLocation(newCenter);

        if (this._priceConstrainer) {newPrice = this._priceConstrainer(newPrice);}
        if (this.relative) {newPrice -= this.stx.currentQuote().Close;}

        this.price = this._snapPrice(newPrice);
    }

    _endDrag(e) {
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
        if (!minTick) {minTick = 0.00000001;} // maximum # places
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
            this._line.setAttribute('uncentered', true);
            if (top < this._line.offsetHeight / 2 * -1) {
                this._line.setAttribute('off-screen', true);
            }
            top = 0;
        } else if (top + this._line.offsetHeight > this.chart.panel.height) {
            this._line.setAttribute('uncentered', true);
            if ((top + this._line.offsetHeight) - this.chart.panel.height > this._line.offsetHeight / 2) {
                this._line.setAttribute('off-screen', true);
            }
            top = this.chart.panel.height - this._line.offsetHeight;
        } else {
            this._line.removeAttribute('uncentered');
            this._line.removeAttribute('off-screen');
        }

        this._line.style.top = `${top}px`;
    }

    _draw() {
        if (this.visible) {
            this._positionAtPrice(this.realPrice);
        }
    }

    @action.bound positionAtPrice(price) {
        let top = this._locationFromPrice(price);
        top -= (this._line.offsetHeight / 2);

        // keep line on chart even if price is off viewable area:
        if (top < 0) {
            this._line.setAttribute('uncentered', true);
            if (top < this._line.offsetHeight / 2 * -1) {
                this._line.setAttribute('off-screen', true);
            }
            top = 0;
        } else if (top + this._line.offsetHeight > this.chart.panel.height) {
            this._line.setAttribute('uncentered', true);
            if ((top + this._line.offsetHeight) - this.chart.panel.height > this._line.offsetHeight / 2) {
                this._line.setAttribute('off-screen', true);
            }
            top = this.chart.panel.height - this._line.offsetHeight;
        } else {
            this._line.removeAttribute('uncentered');
            this._line.removeAttribute('off-screen');
        }

        this._line.style.top = `${top}px`;
    }

    onPriceChanged(callback) {
        this._emitter.on(PriceLineStore.EVENT_PRICE_CHANGED, callback);
    }

    connect = connect(() => ({
        priceDisplay: this.priceDisplay,
        visible: this.visible,
        setDragLine: this.setDragLine,
        className: this.className,
        isDraggable: this.isDraggable,
        isDragging: this.isDragging,
        init: this.init,
    }));
}
