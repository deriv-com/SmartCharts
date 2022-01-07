import EventEmitter from 'event-emitter-es6';
import { action, computed, observable, when } from 'mobx';
import Context from 'src/components/ui/Context';
import { TCIQAppend, TCustomEvent } from 'src/types';
import MainStore from '.';
import { ARROW_HEIGHT, DIRECTIONS } from '../utils';

const LINE_OFFSET_HEIGHT = 4;
const LINE_OFFSET_HEIGHT_HALF = LINE_OFFSET_HEIGHT >> 1;

export default class PriceLineStore {
    __top = 0;
    _emitter: EventEmitter;
    _initialPosition?: number;
    _injectionId?: TCIQAppend<() => void>;
    _line?: HTMLElement;
    _priceConstrainer: number | ((val: number) => number) = 0;
    _startDragPrice = 0;
    className?: string;
    hideBarrierLine?: boolean;
    hideOffscreenLine?: boolean;
    mainStore: MainStore;
    opacityOnOverlap = 0;
    showOffscreenArrows = false;
    _relative = false;
    @observable draggable = true;
    @observable isDragging = false;
    @observable visible = true;
    // @observable top = 0;
    @observable _price = 0;
    // @observable zIndex;
    @observable offScreen = false;
    // @observable uncentered = false;
    @observable title?: string;
    @observable isOverlapping = false;
    @observable offScreenDirection: keyof typeof DIRECTIONS | null = null;

    set zIndex(value: string | number | null) {
        if (this._line && value) {
            this._line.style.zIndex = value.toString();
        }
    }

    @computed get pip() {
        return this.mainStore.chart.currentActiveSymbol?.decimal_places as number;
    }

    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this._emitter = new EventEmitter({ emitDelay: 0 });
        when(() => !!this.context, this.onContextReady);
    }

    destructor() {
        this.stx.removeInjection(this._injectionId);
    }

    onContextReady = () => {
        this._injectionId = this.stx.append('draw', this._draw);
    };

    init = () => {
        const exitIfNotisDraggable = (e: TCustomEvent, callback: (event: TCustomEvent) => void) => {
            if (this.visible && this.draggable) {
                callback.call(this, e);
            }
        };
        CIQ.safeDrag(
            this._line,
            (e: TCustomEvent) => exitIfNotisDraggable(e, this._startDrag),
            (e: TCustomEvent) => exitIfNotisDraggable(e, this._dragLine),
            (e: TCustomEvent) => exitIfNotisDraggable(e, this._endDrag)
        );
    };

    static get EVENT_PRICE_CHANGED() {
        return 'EVENT_PRICE_CHANGED';
    }
    static get EVENT_DRAG_RELEASED() {
        return 'EVENT_DRAG_RELEASED';
    }

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

    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    get stx(): Context['stx'] {
        return this.context?.stx;
    }

    get chart(): typeof CIQ.ChartEngine.Chart {
        return this.stx.chart;
    }

    set priceConstrainer(value: number | ((val: number) => number)) {
        this._priceConstrainer = value;
    }

    get realPrice(): number {
        return this.relative ? (this.mainStore.chart.currentCloseQuote()?.Close as number) + this._price : this._price;
    }

    get yAxiswidth() {
        return this.mainStore.chart.yAxiswidth;
    }

    @action.bound setDragLine(el: HTMLDivElement) {
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

    @action.bound _startDrag() {
        this._modalBegin();
        this.isDragging = true;
        this._initialPosition = this.top;
        this._startDragPrice = this._price;
    }

    @action.bound _dragLine(e: TCustomEvent) {
        if (!this._line) {
            return;
        }
        const newTop = this._initialPosition && this._initialPosition + e.displacementY;
        const newCenter = newTop && newTop + LINE_OFFSET_HEIGHT_HALF;
        let newPrice = newCenter && this._priceFromLocation(newCenter);

        if (typeof this._priceConstrainer === 'function') {
            newPrice = this._priceConstrainer(newPrice);
        }
        if (this.relative) {
            newPrice -= this.mainStore.chart.currentCloseQuote()?.Close as number;
        }

        this.price = newPrice;
    }

    @action.bound _endDrag() {
        this._modalEnd();
        this.isDragging = false;

        if (this._startDragPrice.toFixed(this.pip) !== this._price.toFixed(this.pip)) {
            this._emitter.emit(PriceLineStore.EVENT_DRAG_RELEASED, this._price);
        }
    }

    _locationFromPrice(p: number) {
        return this.stx.pixelFromPrice(p, this.chart.panel) - this.chart.panel.top;
    }

    _priceFromLocation(y: number) {
        const price = this.stx.valueFromPixel(y + this.chart.panel.top, this.chart.panel);

        return price;
    }

    @action.bound _calculateTop = () => {
        if (this.stx.currentQuote() === null) {
            return;
        }

        let top = this._locationFromPrice(this.realPrice);

        // keep line on chart even if price is off viewable area:
        if (top < 0) {
            // this.uncentered = true;
            if (top < -LINE_OFFSET_HEIGHT_HALF) {
                this.offScreenDirection = DIRECTIONS.UP as 'UP';
            }
            top = 0;
        } else if (top + LINE_OFFSET_HEIGHT > this.chart.panel.height) {
            // this.uncentered = true;
            if (top + LINE_OFFSET_HEIGHT - this.chart.panel.height > LINE_OFFSET_HEIGHT_HALF) {
                this.offScreenDirection = DIRECTIONS.DOWN as 'DOWN';
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

    // Mantually update the top to improve performance.
    // We don't pay for react reconciler and mobx observable tracking in animation frames.
    set top(v) {
        this.__top = v;
        if (this._line) {
            this._line.style.transform = `translateY(${this.top - 13}px)`;
        }
    }
    get top() {
        return this.__top;
    }

    _draw = () => {
        if (this.visible && this._line) {
            this.top = this._calculateTop() as number;
        }
    };

    onPriceChanged(callback: EventListener) {
        this._emitter.on(PriceLineStore.EVENT_PRICE_CHANGED, callback);
    }

    onDragReleased(callback: EventListener) {
        this._emitter.on(PriceLineStore.EVENT_DRAG_RELEASED, callback);
    }

    overlapCheck(top: number) {
        const { _barriers } = this.mainStore.chart;

        const filtered_barriers = _barriers.filter(a => a._high_barrier.price !== 0);
        const current_barrier_idx = filtered_barriers.findIndex(b => b._high_barrier === this);

        for (let i = 0; i < filtered_barriers.length; i++) {
            if (i === current_barrier_idx) {
                continue;
            }

            const barrier = filtered_barriers[i];
            const diffTop = barrier._high_barrier.top && Math.abs(barrier._high_barrier.top - top);

            if (diffTop && diffTop < 25) {
                return true;
            }
        }

        return false;
    }
}
