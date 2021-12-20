import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import { TRefData } from 'src/types';
import { getUTCDate } from '../utils';
import Context from './ui/Context';

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

type TFastMarkerProps = {
    markerRef?: (ref: TRefData | null) => void;
    threshold?: number;
    className: string;
    offsetTop?: number;
    offsetLeft?: number;
    x?: number;
    xPositioner?: string;
    yPositioner?: string;
    children?: React.ReactNode;
};

const FastMarker = (props: TFastMarkerProps) => {
    const { chart: chartStore } = useStores();
    const { contextPromise } = chartStore;
    const price_ref = React.useRef<number | null>(null);
    const date_ref = React.useRef<Date | null>(null);
    const elem_ref = React.useRef<HTMLDivElement | null>(null);
    const ctx_ref = React.useRef<Context | null>(null);
    const stx_ref = React.useRef<Context['stx']>(null);
    const injection_id_ref = React.useRef();
    const props_ref = React.useRef(props);
    props_ref.current = props;

    const setPosition = ({ epoch, price }: Record<string, number | null | undefined>) => {
        price_ref.current = Number(price) || null;
        date_ref.current = CIQ.strToDateTime(getUTCDate(epoch as number)) as Date;
        updateCSS();
    };

    const updateCSS = () => {
        if (!elem_ref.current || !ctx_ref.current || !stx_ref.current) {
            return;
        }
        if (!date_ref.current) {
            elem_ref.current.style.visibility = 'hidden';
            return;
        }

        const offsetTop = props_ref.current.offsetTop || 0;
        const offsetLeft = props_ref.current.offsetLeft || 0;
        const elem = elem_ref.current;
        const stx = stx_ref.current;
        const chart = stx.chart;

        let top = 0,
            left = 0,
            show = true;

        const threshold = Number(props_ref.current.threshold) || 0;
        show = !threshold || stx.layout.candleWidth >= threshold;

        if (show && chart.dataSet && chart.dataSet.length && stx.mainSeriesRenderer) {
            let tickIdx = stx.tickFromDate(date_ref.current, chart);

            if (tickIdx > -1 && stx.chart.dataSet[tickIdx] && stx.chart.dataSet[tickIdx].Close !== price_ref.current) {
                delete stx.chart.tickCache[date_ref.current.getTime()];
                tickIdx = stx.tickFromDate(date_ref.current, chart);
            }

            let x = stx.pixelFromTick(tickIdx, chart);

            // ChartIQ doesn't support placing markers in the middle of ticks.
            const bar = chart.dataSet[tickIdx];
            // Here we interpolate the pixel distance between two adjacent ticks.
            if (bar && bar.DT < date_ref.current) {
                const barNext = chart.dataSet[tickIdx + 1];
                const barPrev = tickIdx > 0 ? chart.dataSet[tickIdx - 1] : null;
                if (barNext && barNext.Close && barNext.DT > date_ref.current) {
                    const pixelToNextBar = stx.pixelFromTick(tickIdx + 1, chart) - x;
                    x +=
                        ((((date_ref.current as unknown) as number) - bar.DT) / (barNext.DT - bar.DT)) * pixelToNextBar;
                } else if (barPrev && barPrev.Close) {
                    const pixelFromPrevBar = x - stx.pixelFromTick(tickIdx - 1, chart);
                    x +=
                        ((((date_ref.current as unknown) as number) - bar.DT) / (bar.DT - barPrev.DT)) *
                        pixelFromPrevBar;
                }
            }

            const y = price_ref.current ? stx.pixelFromPrice(price_ref.current, chart.panel) : 0;

            if (chart.yAxis.left > x && chart.yAxis.top <= y && chart.yAxis.bottom >= y) {
                top = +y;
                left = Math.round(x);
            } else {
                show = false;
            }
        }

        // patch DOM without triggering recalculate layout.
        elem.style.transform = `translate(${left + offsetLeft}px, ${top + offsetTop}px)`;
        elem.style.visibility = show ? 'visible' : 'hidden';
    };

    const setRef = (ref: HTMLDivElement | null) => {
        elem_ref.current = ref;
        const { markerRef } = props_ref.current;

        const data = ref
            ? {
                  div: ref,
                  setPosition,
              }
            : null;

        if (markerRef) {
            markerRef(data);
        }

        if (ref !== null) {
            if (contextPromise) {
                contextPromise.then((ctx: Context) => {
                    ctx_ref.current = ctx;
                    stx_ref.current = ctx_ref.current.stx;

                    injection_id_ref.current = stx_ref.current.append('draw', updateCSS);
                    updateCSS();
                });
            }
        } else if (injection_id_ref.current && stx_ref.current) {
            // remove the injection on unmount
            stx_ref.current.removeInjection(injection_id_ref.current);
            ctx_ref.current = null;
            stx_ref.current = null;
        }
    };

    const { children, className } = props;

    return (
        <div className={className} ref={setRef} style={{ position: 'absolute' }}>
            {children}
        </div>
    );
};

export default observer(FastMarker);
