import React from 'react';
import { connect } from '../store/Connect';
import { getUTCDate } from  '../utils';

// Get a raw callback with underlying canvas2dcontext
// This component is used to render directly into the chart canvas.
//
// Props:
//
//  - epoch_array: array of epoch values to get coordinates for.
//  - draw_callback: called on every frame with ({ctx, points}).
//  -- points will be an array of [{left, top, epoch}] in pixels.
//  -- ctx is the Context2dDrawingContext

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
            window.stx = this.stx;

            this.injectionId = this.stx.append('draw', this.draw);
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

        const { threshold = 0, epoch_array, draw_callback } = this.props;

        if (!this.date_array || this.date_array.length !== epoch_array.length) {
            this.date_array = epoch_array
                .map(epoch => ({
                    date: CIQ.strToDateTime(getUTCDate(epoch)),
                    epoch,
                }));
        }

        const stx = this.stx;
        const chart = stx.chart;

        let top = 0, left = 0, show = true;

        show = !threshold || stx.layout.candleWidth >= threshold;


        if (show
            && chart.dataSet
            && chart.dataSet.length
            && stx.mainSeriesRenderer
        ) {
            const result = [];
            this.date_array.forEach(({ date, epoch }) => {
                const tick_idx = stx.tickFromDate(date, chart);

                // if (tick_idx > -1
                //     && stx.chart.dataSet[tick_idx]
                //     && stx.chart.dataSet[tick_idx].Close !== this.price) {
                //     delete stx.chart.tickCache[this.date.getTime()];
                //     tick_idx = stx.tickFromDate(this.date, chart);
                // }


                // ChartIQ doesn't support placing markers in the middle of ticks.
                const bar = chart.dataSet[tick_idx];
                const bar_next = chart.dataSet[tick_idx + 1];
                const bar_prev = tick_idx > 0 ? chart.dataSet[tick_idx - 1] : null;

                let x = stx.pixelFromTick(tick_idx, chart);
                let price = bar ? bar.Close : null;

                // const price = (bar || bar_prev || bar_next || {}).Close;
                // Here we interpolate the pixel distance between two adjacent ticks.
                if (bar && bar.DT < date) {
                    if (bar_next && bar_next.Close && bar_next.DT > date) {
                        const delta_x = stx.pixelFromTick(tick_idx + 1, chart) - x;
                        const delta_y = bar_next.Close - price;
                        const ratio = (date - bar.DT) / (bar_next.DT - bar.DT);
                        price += ratio * delta_y;
                        x += ratio * delta_x;
                    } else if (bar_prev && bar_prev.Close) {
                        const delta_x = x - stx.pixelFromTick(tick_idx - 1, chart);
                        const delta_y = price - bar_prev.Close;
                        const ratio = (date - bar.DT) / (bar.DT - bar_prev.DT);
                        x +=  ratio * delta_x;
                        price += ratio * delta_y;
                    }
                }

                const y = price ? stx.pixelFromPrice(price, chart.panel) : 0;

                let visible = true;
                if (chart.yAxis.left > x
                    && chart.yAxis.top <= y
                    && chart.yAxis.bottom >= y) {
                    top = +y;
                    left = Math.round(x);
                } else {
                    visible = false;
                }

                result.push({
                    epoch,
                    visible,
                    top,
                    left,
                });
            });
            draw_callback({
                ctx: stx.chart.context,
                points: result,
            });
        }
    }


    render() { return null; }
}

export default connect(({ chart }) => ({
    contextPromise: chart.contextPromise,
}))(RawMarker);
