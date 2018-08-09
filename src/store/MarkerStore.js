import { observable, action } from 'mobx';
import { getUTCDate, updatePropIfChanged } from '../utils';

// width here includes the size of the flag
const MARKER_MAX_WIDTH = 150;

export default class MarkerStore {
    yPositioner = 'value';
    xPositioner = 'epoch';
    tick;
    isDistantFuture;
    className;
    children;
    x;
    y;
    @observable display;
    @observable left;
    @observable bottom;

    constructor(mainStore) {
        this.mainStore = mainStore;
        this.stx = this.mainStore.chart.context.stx;
        this.chart = this.stx.chart;
        this.panel = this.chart.panel;
        this.yAxis = this.panel.yAxis;

        this.mainStore.chart.feed.onPagination(this.updateMarkerTick);
        this._listenerId = this.stx.addEventListener('newChart', this.updateMarkerTick);
        this._injectionId = this.stx.prepend('positionMarkers', this.updatePosition);
    }

    destructor() {
        this.stx.removeInjection(this._injectionId);
        this.stx.removeEventListener(this._listenerId);
    }

    updateProps({ children, className, y, yPositioner, x, xPositioner }) {
        this.className = className;
        this.children = children;

        let isUpdateMarkerTickRequired = false;
        let isUpdatePositionRequired = false;
        updatePropIfChanged(this, { x, xPositioner }, () => { isUpdateMarkerTickRequired = true; });
        updatePropIfChanged(this, { y, yPositioner }, () => { isUpdatePositionRequired   = true; });
        if (isUpdateMarkerTickRequired) {
            this.updateMarkerTick(); // also calls updatePosition
        } else if (isUpdatePositionRequired) {
            this.updatePosition();
        }
    }

    // The update function here is more efficient than ChartIQ's default implementation
    // in that it doesn't factor the marker width and height into the calculation.
    // Considering how often this function is called, it made more sense to have the offset
    // done in CSS.
    @action.bound updatePosition() {
        if (this.isDistantFuture) {
            const dummyMarker = this.getDummyMarker();
            this.stx.futureTickIfDisplayed(dummyMarker);
            if (dummyMarker.tick) {
                this.tick = dummyMarker.tick;
                this.isDistantFuture = false;
            }
        }

        // X axis positioning logic
        const { dataSet } = this.chart;
        let quote = null;
        let left;

        if (this.xPositioner !== 'none') {
            if (!this.tick) {
                this.hideMarker();
                return;
            }

            if (this.xPositioner === 'bar' && this.x) {
                if (this.x < this.chart.xaxis.length) {
                    const xaxis = this.chart.xaxis[this.x];
                    if (xaxis) quote = xaxis.data;
                }
                left = this.stx.pixelFromBar(this.x, this.chart);
            } else {
                if (this.tick < dataSet.length) quote = dataSet[this.tick];
                left = this.stx.pixelFromTick(this.tick, this.chart) - this.chart.left;
            }
            if (!quote) quote = dataSet[dataSet.length - 1]; // Future ticks based off the value of the current quote
            const isMarkerExceedRange = left < -MARKER_MAX_WIDTH || left > this.chart.width + MARKER_MAX_WIDTH;
            if (isMarkerExceedRange) {
                this.hideMarker();
                return;
            }
        }

        this.left = left;

        // Y axis positioning logic
        if (this.yPositioner === 'none') {
            this.bottom = undefined;
            this.showMarker();
            return;
        }

        let val;
        const showsHighs = this.stx.chart.highLowBars || this.stx.highLowBars[this.stx.layout.chartType];
        let plotField = this.chart.defaultPlotField;
        if (!plotField || showsHighs) plotField = 'Close';
        if (this.yPositioner.indexOf('candle') > -1) {
            // candle positioning, find the quote
            if (this.left) {
                const bar = this.stx.barFromPixel(this.left, this.chart);
                if (bar >= 0) {
                    quote = this.chart.xaxis[bar].data;
                    if (!quote) quote = dataSet[dataSet.length - 1]; // Future ticks based off the value of the current quote
                }
            }
        }
        const height = this.panel.yAxis.bottom;
        let bottom = 0;

        if (this.yPositioner === 'value' && this.y) {
            bottom = height - this.stx.pixelFromPrice(this.y, this.panel, this.yAxis);
        } else if (this.yPositioner === 'under_candle' && quote) {
            val = quote[plotField];
            if (showsHighs) val = this.stx.getBarBounds(quote).low;
            bottom = height - this.stx.pixelFromPrice(val, this.panel, this.yAxis);
        } else if (this.yPositioner === 'on_candle' && quote) {
            val = quote[plotField];
            if (showsHighs) val = (quote.Low + quote.High) / 2;
            bottom = height - this.stx.pixelFromPrice(val, this.panel, this.yAxis);
        } else if (this.yPositioner === 'top') {
            bottom = height;
        } else if (quote) {
            // above_candle
            val = quote[plotField];
            if (showsHighs) val = this.stx.getBarBounds(quote).high;
            bottom = height - this.stx.pixelFromPrice(val, this.panel, this.yAxis);
        }

        if (bottom < 0 || bottom > height) {
            this.hideMarker();
            return;
        }

        this.bottom = bottom | 0;
        this.showMarker();
    }

    @action.bound updateMarkerTick() {
        const dummyMarker = this.getDummyMarker();

        this.stx.setMarkerTick(dummyMarker);
        this.tick = dummyMarker.tick;
        if (dummyMarker.params.future) {
            this.stx.futureTickIfDisplayed(dummyMarker);
            this.tick = dummyMarker.tick;
            if (this.tick) {
                this.isDistantFuture = false;
            } else {
                this.isDistantFuture = true;
                this.hideMarker();
            }
        }

        if (this.tick) {
            this.updatePosition();
        }
    }

    // ChartIQ's marker functions wants markers. Let's give them markers.
    getDummyMarker() {
        let x = this.x;
        let xPositioner = this.xPositioner;
        if (this.xPositioner === 'epoch') {
            xPositioner = 'date';
            x = new Date(getUTCDate(x));
        }

        return {
            chart: this.chart,
            params: {
                x, xPositioner,
            },
        };
    }

    hideMarker() {
        this.display = 'none';
    }

    showMarker() {
        this.display = undefined;
    }
}
