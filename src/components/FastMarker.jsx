import React, { Component } from 'react';
import { connect } from '../store/Connect';
import { getUTCDate } from  '../utils';

// Render given Components under stx-subholder.
// This component is used to position a marker on the chart.
//
// USAGE:
//
//  - setRef({setPosition, div}) will be called on mount.
//  - "div" is the dom element containing the marker with "your-css-class"
//  - "setPosition({epoch, price})" is a function that you will use to update the div position.
//  - calling "setPosition({epoch: null, price: null})" will hide the marker.
//  - use "div.querySelector('...')" to get a dom reference in order to update your content .
//  - "setRef(null)" will be called when the marker unmounts.
//
//  <FastMarker
//      markerRef={setRef}
//      threshold={optional visibility threshold}
//      className="your-css-class"
//  >
//     <your content here/>
//  </FastMarker>
//
//  - the chart can have a zoom level, if `threshold` is provided
//    the marker will only be shown if it's within that zoom threshold.

class FastMarker extends Component {
    price = null;
    date = null;
    elem = null;
    ctx = null;
    stx = null;
    injectionId = null;

    setPosition = ({ epoch, price }) => {
        this.price = +price;
        this.date = CIQ.strToDateTime(getUTCDate(epoch));
        this.updateCSS();
    }

    updateCSS = () => {
        if (!this.elem || !this.ctx) { return; }
        if (!this.date) {
            this.elem.style.visibility = 'hidden';
            return;
        }

        const elem = this.elem;
        const stx = this.stx;
        const chart = stx.chart;

        let top = 0, left = 0, show = true;

        const threshold = +this.props.threshold || 0;
        show = !threshold || stx.layout.candleWidth >= threshold;

        if (show
            && chart.dataSet
            && chart.dataSet.length
            && stx.mainSeriesRenderer
        ) {
            const tick_idx = stx.tickFromDate(this.date, chart);
            let x = stx.pixelFromTick(tick_idx, chart);

            // ChartIQ doesn't support placing markers in the middle of ticks.
            const bar_idx = tick_idx - chart.dataSet.length + chart.scroll;
            const bar = chart.dataSegment[bar_idx];
            // Here we interpolate the pixel distance between two adjacent ticks.
            if (bar && bar.DT < this.date) {
                const bar_next = chart.dataSegment[bar_idx + 1];
                const bar_prev = bar_idx > 0 ? chart.dataSegment[bar_idx - 1] : null;
                if (bar_next && bar_next.Close && bar_next.DT > this.date) {
                    const pixelx_to_next_bar = stx.pixelFromTick(tick_idx + 1, chart) - x;
                    x +=  (this.date - bar.DT) / (bar_next.DT - bar.DT) * pixelx_to_next_bar;
                } else if (bar_prev && bar_prev.Close) {
                    const pixelx_from_prev_bar = x - stx.pixelFromTick(tick_idx - 1, chart);
                    x +=  (this.date - bar.DT) / (bar.DT - bar_prev.DT) * pixelx_from_prev_bar;
                }
            }

            const y = this.price ? stx.pixelFromPrice(this.price, chart.panel) : 0;

            if (chart.yAxis.left > x
                && chart.yAxis.top <= y
                && chart.yAxis.bottom >= y) {
                top = +y;
                left = Math.round(x);
            } else {
                show = false;
            }
        }

        // patch DOM without triggering recalculate layout.
        elem.style.transform = `translate(${left}px, ${top}px)`;
        elem.style.visibility = show ? 'visible' : 'hidden';
    }

    setRef = (ref) => {
        this.elem = ref;

        const data = ref ? {
            div: ref,
            setPosition: this.setPosition,
        } : null;

        if (this.props.markerRef) {
            this.props.markerRef(data);
        }

        if (ref !== null) {
            const { contextPromise } = this.props;

            contextPromise.then((ctx) => {
                this.ctx = ctx;
                this.stx = this.ctx.stx;

                this.injectionId = this.stx.append('draw', this.updateCSS);
                this.updateCSS();
            });
        } else if (this.injectionId) {
            // remove the injection on unmount
            this.stx.removeInjection(this.injectionId);
            this.ctx = null;
            this.stx = null;
        }
    }

    render() {
        const { className, children } = this.props;
        return (
            <div
                className={className}
                ref={this.setRef}
                style={{ position: 'absolute' }}
            >
                {children}
            </div>
        );
    }
}

export default connect(({ chart }) => ({
    contextPromise: chart.contextPromise,
}))(FastMarker);
