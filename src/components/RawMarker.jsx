import React from 'react';
import { connect } from '../store/Connect';
import { getUTCDate } from  '../utils';

class RawMarker extends React.Component {
    price = null;
    date = null;
    elem = null;
    ctx = null;
    stx = null;
    injectionId = null;
    hasUnmountedBeforeInjection = false;

    componentDidMount() {
        const { contextPromise } = this.props;

        contextPromise.then((ctx) => {
            if (this.hasUnmountedBeforeInjection) { return; }

            this.ctx = ctx;
            this.stx = this.ctx.stx;

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
        } else {
            this.hasUnmountedBeforeInjection = true;
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
