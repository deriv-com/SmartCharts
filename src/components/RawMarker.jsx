import React from 'react';
import { connect } from '../store/Connect';
import { getUTCDate } from  '../utils';

// Get a raw callback with underlying canvas2dcontext
// This component is used to render directly into the chart canvas.
//
// Props:
//
//  - epoch_array: array of epoch values to get coordinates for.
//  - price_array: array of price values to get y-coordinates for.
//  - draw_callback: called on every frame with ({ctx, points, prices}).
//  -- points will be an array of [{left, top, epoch}] in pixels.
//  -- ctx is the Context2dDrawingContext


// Unfortunately chartiq.js does a Math.floor() on pixel values,
// Which causes a jerky effect on the markers in auto-scroll,
// However we need the pixel value down to the decimal points.
// This is copy from chartiq.js file WITHOUT rounding down the pixel value.

const patch_pixel_from_chart = (stx) => {
    stx.pixelFromTick = function (tick, _chart) {
        const chart = _chart || stx.chart;
        const dataSegment = chart.dataSegment,
            dataSet = chart.dataSet,
            segmentImage = chart.segmentImage,
            mp = stx.micropixels,
            length = dataSegment ? dataSegment.length : 0;
        const panel = chart.panel,
            scroll = chart.scroll;
        const bar = tick - dataSet.length + scroll;
        let quote = length ? dataSegment[bar] : null;

        if (segmentImage) quote = segmentImage[bar];
        if (quote && quote.leftOffset) {
            // return Math.floor(panel.left + quote.leftOffset + mp)
            return panel.left + quote.leftOffset + mp;
        }
        let rightOffset = 0, dsTicks = 0;
        quote = length ? dataSegment[length - 1] : null;
        if (segmentImage) quote = segmentImage[length - 1];
        if (quote && quote.leftOffset) {
            if (length < tick - dataSet.length + scroll) {
                rightOffset = quote.leftOffset - quote.candleWidth / 2;
                dsTicks = length;
            }
        }
        // return Math.floor(/* ... */)
        return rightOffset + panel.left
            + (tick - dsTicks - dataSet.length + scroll + 0.5)
            * stx.layout.candleWidth + mp;
    };
};

class RawMarker extends React.Component {
    price = null;
    date = null;
    elem = null;
    ctx = null;
    stx = null;
    injectionId = null;

    componentDidMount() {
        const { contextPromise } = this.props;

        contextPromise.then((ctx) => {
            this.ctx = ctx;
            this.stx = this.ctx.stx;

            this.injectionId = this.stx.append('draw', this.draw);
            patch_pixel_from_chart(this.stx);
            this.draw();
        });
    }

    componentWillUnmount() {
        if (this.injectionId) {
            // remove the injection on unmount
            this.stx.removeInjection(this.injectionId);
            this.ctx = null;
            this.stx = null;
        }
    }

    draw = () => {
        if (!this.ctx) { return; }

        const {
            threshold = 0,
            epoch_array,
            draw_callback,
            price_array = [],
        } = this.props;

        if (
            !this.last_epoch_array
            || this.last_epoch_array.toString() !== epoch_array.toString()
        ) {
            this.date_array = epoch_array
                .map(epoch => ({
                    date: CIQ.strToDateTime(getUTCDate(epoch)),
                    epoch,
                }));
            this.last_epoch_array = epoch_array;
        }

        const stx = this.stx;
        const chart = stx.chart;
        const show = !threshold || stx.layout.candleWidth >= threshold;

        if (show
            && chart.dataSet
            && chart.dataSet.length
            && stx.mainSeriesRenderer
        ) {
            const points = [];
            this.date_array.forEach(({ date, epoch }) => {
                const tick_idx = stx.tickFromDate(date, chart);

                // ChartIQ doesn't support placing markers in the middle of ticks.
                const bar = chart.dataSet[tick_idx];
                const bar_next = chart.dataSet[tick_idx + 1];
                const bar_prev = tick_idx > 0 ? chart.dataSet[tick_idx - 1] : null;

                let x = stx.pixelFromTick(tick_idx, chart);
                // let x = pixelFromTick(stx, tick_idx);
                let price = bar ? bar.Close : null;

                // const price = (bar || bar_prev || bar_next || {}).Close;
                // Here we interpolate the pixel distance between two adjacent ticks.
                if (bar && bar.DT < date) {
                    if (bar_next && bar_next.Close && bar_next.DT > date) {
                        const delta_x = stx.pixelFromTick(tick_idx + 1, chart) - x;
                        // const delta_x = pixelFromTick(stx, tick_idx + 1) - x;
                        const delta_y = bar_next.Close - price;
                        const ratio = (date - bar.DT) / (bar_next.DT - bar.DT);
                        price += ratio * delta_y;
                        x += ratio * delta_x;
                    } else if (bar_prev && bar_prev.Close) {
                        const delta_x = x - stx.pixelFromTick(tick_idx - 1, chart);
                        // const delta_x = x - pixelFromTick(stx, tick_idx - 1);
                        const delta_y = price - bar_prev.Close;
                        const ratio = (date - bar.DT) / (bar.DT - bar_prev.DT);
                        x +=  ratio * delta_x;
                        price += ratio * delta_y;
                    }
                }

                const y = price ? stx.pixelFromPrice(price, chart.panel) : 0;

                const visible =  (
                    x >= 0
                    && chart.yAxis.left > x
                    && chart.yAxis.top <= y
                    && chart.yAxis.bottom >= y
                );
                const yAxis = chart.yAxis;
                const top = Math.min(Math.max(+y, yAxis.top), yAxis.bottom);
                const left = Math.min(Math.max(x, 0), yAxis.left);
                const zoom = stx.layout.candleWidth;

                points.push({
                    epoch,
                    visible,
                    top,
                    left,
                    zoom,
                    max_left: yAxis.left,
                });
            });
            const prices = price_array
                .map(price => stx.pixelFromPrice(price * 1, chart.panel));
            draw_callback({
                ctx: stx.chart.context,
                points,
                prices,
            });
        }
    }


    render() { return null; }
}

export default connect(({ chart }) => ({
    contextPromise: chart.contextPromise,
}))(RawMarker);
