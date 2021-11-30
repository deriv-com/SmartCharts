import { action, computed, observable } from 'mobx';
import Context from 'src/components/ui/Context';
import { TCIQAddEventListener, TCIQAppend } from 'src/types';
import MainStore from '.';
import { getUTCDate, updatePropIfChanged } from '../utils';
import ChartStore from './ChartStore';
// width here includes the size of the flag
const MARKER_MAX_WIDTH = 150;
export default class MarkerStore {
    _injectionId: TCIQAppend<() => void> | null;
    _listenerId: TCIQAddEventListener<() => void> | null;
    chart: typeof CIQ.ChartEngine.Chart;
    chartStore: ChartStore;
    mainStore: MainStore;
    panel: typeof CIQ.ChartEngine.Panel;
    stx: Context['stx'];
    yAxis: typeof CIQ.ChartEngine.YAxis;
    yPositioner = 'value';
    xPositioner = 'epoch';
    tick: number | null = null;
    isDistantFuture?: boolean;
    className?: string;
    children: React.ReactNode;
    x?: number | Date;
    y?: number;
    @observable
    display?: string;
    @observable
    left?: string | number;
    @observable
    bottom?: number;
    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
        this.chartStore = mainStore.chart;
        this.stx = this.mainStore.chart.context?.stx;
        this.chart = this.stx.chart;
        this.panel = this.chart.panel;
        this.yAxis = this.panel.yAxis;
        this.mainStore.chart.feed?.onPagination(this.updateMarkerTick);
        this._listenerId = this.stx.addEventListener('newChart', this.updateMarkerTick);
        this._injectionId = this.stx.prepend('positionMarkers', this.updateMarkerTick);
    }
    @computed
    get shouldDrawMarkers() {
        // if this.y === null, we know line markers is passed, so check if chart has
        // been scrolled to the leftmost of the screen
        // else return true in order to show chart-loader when loading historical data
        return this.y === null ? this.stx.chart.isScrollLocationChanged : true;
    }
    @action.bound
    destructor() {
        if (this._injectionId) {
            this.stx.removeInjection(this._injectionId);
        }
        if (this._listenerId) {
            this.stx.removeEventListener(this._listenerId);
        }
        if (this.mainStore.chart.feed) {
            this.mainStore.chart.feed.offPagination(this.updateMarkerTick);
        }
        this._injectionId = null;
        this._listenerId = null;
    }
    @action.bound
    updateProps({ children, className, y, yPositioner, x, xPositioner }: MarkerStore) {
        this.className = className;
        this.children = children;
        let isUpdateMarkerTickRequired = false;
        let isUpdatePositionRequired = false;
        updatePropIfChanged(this, { x, xPositioner }, () => {
            isUpdateMarkerTickRequired = true;
        });
        updatePropIfChanged(this, { y, yPositioner }, () => {
            isUpdatePositionRequired = true;
        });
        // TODO this condition isn't needed any more if the current algorithm works.
        if (isUpdateMarkerTickRequired) {
            this.updateMarkerTick(); // also calls updatePosition
        } else if (isUpdatePositionRequired) {
            // this.updatePosition();
            this.updateMarkerTick();
        }
    }
    // The update function here is more efficient than ChartIQ's default implementation
    // in that it doesn't factor the marker width and height into the calculation.
    // Considering how often this function is called, it made more sense to have the offset
    // done in CSS.
    @action.bound
    updatePosition() {
        // Don't position the markers when the chart hasn't been scrolled to the leftmost of the screen
        if (!this.shouldDrawMarkers) return;
        // When the chart has not been initialized or there isn't any data in masterData it shouldn't position the markers.
        if (!this.stx || !this.stx.masterData || this.stx.masterData.length <= 0) {
            return;
        }
        if (this.isDistantFuture && this.chart.xaxis && this.chart.xaxis.length > 0) {
            const dummyMarker = this.getDummyMarker();
            this.stx.futureTickIfDisplayed(dummyMarker);
            if (dummyMarker.tick) {
                this.tick = dummyMarker.tick;
                this.isDistantFuture = false;
            }
        }
        // X axis positioning logic
        // const { dataSet } = this.chart;
        let quote = null;
        let left;
        if (this.xPositioner !== 'none') {
            const dummyMarker = this.getDummyMarker();
            if (this.yPositioner !== 'none' && this.tick === null) {
                this.hideMarker();
                return;
            }
            // TODO: Temporary solution until ChartIQ can support displaying markers in dates with no tick data
            if (
                dummyMarker.params.xPositioner === 'date' &&
                !this.isDistantFuture &&
                this.tick &&
                this.stx.masterData[this.tick] &&
                this.stx.masterData[this.tick].DT.valueOf() !== dummyMarker.params.x.valueOf()
            ) {
                // if the marker is not distance future but it is greater than the last item in the masterData, it will be hidden.
                if (
                    this.yPositioner !== 'none' &&
                    this.stx.masterData[this.stx.masterData.length - 1].DT.valueOf() < dummyMarker.params.x.valueOf()
                ) {
                    this.hideMarker();
                    return;
                }
                /**
                 * Adding an invisible bar if the bar
                 * does not exist on the masterData
                 */
                this.stx.updateChartData(
                    {
                        DT: dummyMarker.params.x,
                        Close: null,
                    },
                    null,
                    { fillGaps: true }
                );
                this.stx.createDataSet();
                // this.tick += 1;
                this.stx.setMarkerTick(dummyMarker);
                this.tick = dummyMarker.tick;
                if (this.yPositioner !== 'value' && this.yPositioner !== 'on_candle' && this.yPositioner !== 'top') {
                    this.yPositioner = 'none';
                }
            }
            if (this.xPositioner === 'bar' && this.x) {
                if (this.x < this.chart.xaxis.length) {
                    const xaxis = this.chart.xaxis[this.x as number];
                    if (xaxis) quote = xaxis.data;
                }
                left = this.stx.pixelFromBar(this.x, this.chart);
            } else {
                if (this.tick && this.tick < this.stx.chart.dataSet.length) quote = this.stx.chart.dataSet[this.tick];
                left = this.stx.pixelFromTick(this.tick, this.chart) - this.chart.left;
            }
            if (!quote) quote = this.stx.chart.dataSet[this.stx.chart.dataSet.length - 1]; // Future ticks based off the value of the current quote
            const isMarkerExceedRange = left < -MARKER_MAX_WIDTH || left > this.chart.width + MARKER_MAX_WIDTH;
            if (isMarkerExceedRange) {
                this.hideMarker();
                return;
            }
        }
        this.left = left || null;
        if (!this.left) {
            this.hideMarker();
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
                    if (!quote) quote = this.stx.chart.dataSet[this.stx.chart.dataSet.length - 1]; // Future ticks based off the value of the current quote
                }
            }
        }
        // Y axis positioning logic
        if (this.yPositioner.toLowerCase() === 'none') {
            // set the bottom value if there's a bottomWidget, else set it to undefined
            this.bottom = this.stx.chart.yAxis.initialMarginBottom === 200 ? 125 : 20;
            this.showMarker();
            return;
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
    @action.bound
    updateMarkerTick() {
        const dummyMarker = this.getDummyMarker();
        this.stx.setMarkerTick(dummyMarker);
        this.tick = dummyMarker.tick;
        if (dummyMarker.params.future) {
            this.isDistantFuture = true;
            if (this.chart.xaxis && this.chart.xaxis.length) {
                this.stx.futureTickIfDisplayed(dummyMarker);
                this.tick = dummyMarker.tick;
                if (this.tick !== null) {
                    this.isDistantFuture = false;
                }
            } else {
                this.hideMarker();
                return;
            }
        }
        if (this.tick !== null) {
            this.updatePosition();
        } else {
            /**
             * Adding an invisible bar if the bar
             * does not exist on the masterData
             */
            this.stx.updateChartData(
                {
                    DT: dummyMarker.params.x,
                    Close: null,
                },
                null,
                { fillGaps: true }
            );
            this.stx.createDataSet();
            this.stx.setMarkerTick(dummyMarker);
            this.tick = dummyMarker.tick;
            if (this.tick !== null) {
                if (this.yPositioner !== 'value' && this.yPositioner !== 'on_candle' && this.yPositioner !== 'top') {
                    this.yPositioner = 'none';
                }
                this.updatePosition();
            } else {
                this.hideMarker();
            }
        }
    }
    // ChartIQ's marker functions wants markers. Let's give them markers.
    getDummyMarker(): typeof CIQ.Marker {
        let x = this.x;
        let xPositioner = this.xPositioner;
        if (this.xPositioner === 'epoch') {
            xPositioner = 'date';
            x = CIQ.strToDateTime(getUTCDate(x as number));
        }
        return {
            chart: this.chart,
            params: {
                x,
                xPositioner,
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
