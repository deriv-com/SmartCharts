import { observable, action } from 'mobx';

// width here includes the size of the flag
const MARKER_MAX_WIDTH = 150;

export default class MarkerStore {
    yPositioner = 'value';
    xPositioner = 'date';
    tick;
    isDistantFuture;
    x;
    y;
    @observable left;
    @observable bottom;

    constructor(mainStore) {
        this.mainStore = mainStore;
        this.stx = this.mainStore.chart.context.stx;
        this.chart = this.stx.chart;
        this.panel = this.chart.panel;
        this.yAxis = this.panel.yAxis;

        this._listenerId = this.stx.addEventListener('newChart', this.updateMarkerTick);
        this._injectionId = this.stx.prepend('positionMarkers', this.updatePosition);
    }

    destructor() {
        this.stx.removeInjection(this._injectionId);
        this.stx.removeEventListener(this._listenerId);
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

        if (!this.tick) return;

        // X axis positioning logic
        const { dataSet } = this.chart;
        let quote = null;
        let left;

        if (this.xPositioner !== 'none') {
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
        }

        if (left < -MARKER_MAX_WIDTH || left > this.chart.width + MARKER_MAX_WIDTH) {
            return; // Do not update the marker if it is not visible
        }

        this.left = left;

        // Y axis positioning logic
        if (this.yPositioner === 'none') { return; }

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

        this.bottom = bottom | 0;
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
        return {
            chart: this.chart,
            params: {
                x: this.x,
                xPositioner: this.xPositioner,
            },
        };
    }

    hideMarker() {
        this.left = -1000;
    }
}
