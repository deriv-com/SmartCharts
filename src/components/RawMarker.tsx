import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import { getUTCDate } from '../utils';
import Context from './ui/Context';

type TPoint = {
    epoch: number;
    visible: boolean;
    top: number;
    left: number;
    zoom: number;
    max_left: number;
};

type TRawMarkerProps = {
    shouldRedraw: boolean;
    threshold: number;
    draw_callback: (props: { canvas_height: number; points: TPoint[]; prices: number[]; ctx: Context }) => void;
    price_array: number[];
    epoch_array: number[];
};

const RawMarker = (props: TRawMarkerProps) => {
    const { chart: chartStore } = useStores();
    const { contextPromise } = chartStore;

    const ctx_ref = React.useRef<Context | null>(null);
    const stx_ref = React.useRef<Context['stx']>(null);
    const injection_id_ref = React.useRef<number | null>(null);
    const has_unmounted_before_injection_ref = React.useRef(false);
    const last_epoch_array_ref = React.useRef<number[]>();
    const date_array_ref = React.useRef<{ date: Date; epoch: number }[]>();
    const props_ref = React.useRef<TRawMarkerProps>(props);
    props_ref.current = props;
    const { shouldRedraw } = props;

    React.useEffect(() => {
        if (contextPromise) {
            contextPromise.then((ctx: Context) => {
                if (has_unmounted_before_injection_ref.current) {
                    return;
                }

                ctx_ref.current = ctx;
                stx_ref.current = ctx_ref.current.stx;

                injection_id_ref.current = stx_ref.current.append('draw', draw);
                draw();
            });
        }

        return () => {
            if (injection_id_ref.current) {
                // remove the injection on unmount
                stx_ref.current.removeInjection(injection_id_ref.current);
                ctx_ref.current = null;
                stx_ref.current = null;
            } else {
                has_unmounted_before_injection_ref.current = true;
            }
        };
    }, [contextPromise]);

    React.useEffect(() => {
        if (shouldRedraw && contextPromise) {
            contextPromise.then((ctx: Context) => {
                if (has_unmounted_before_injection_ref.current) {
                    return;
                }

                ctx_ref.current = ctx;
                stx_ref.current = ctx_ref.current.stx;

                injection_id_ref.current = stx_ref.current.append('draw', draw);
                draw();
            });
        }
    });

    const draw = () => {
        if (!ctx_ref.current) {
            return;
        }

        const { threshold = 0, epoch_array, draw_callback, price_array = [] } = props_ref.current;

        if (!last_epoch_array_ref.current || last_epoch_array_ref.current.toString() !== epoch_array.toString()) {
            date_array_ref.current = epoch_array.map(epoch => ({
                date: CIQ.strToDateTime(getUTCDate(epoch)) as Date,
                epoch,
            }));
            last_epoch_array_ref.current = epoch_array;
        }

        const stx = stx_ref.current;
        const chart = stx.chart;
        const show = !threshold || stx.layout.candleWidth >= threshold;

        if (show && chart.dataSet && chart.dataSet.length && stx.mainSeriesRenderer) {
            const points: TPoint[] = [];
            date_array_ref.current?.forEach(({ date, epoch }) => {
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
                        const ratio = (((date as unknown) as number) - bar.DT) / (bar_next.DT - bar.DT);
                        price += ratio * delta_y;
                        x += ratio * delta_x;
                    } else if (bar_prev && bar_prev.Close) {
                        const delta_x = x - stx.pixelFromTick(tick_idx - 1, chart);
                        // const delta_x = x - pixelFromTick(stx, tick_idx - 1);
                        const delta_y = price - bar_prev.Close;
                        const ratio = (((date as unknown) as number) - bar.DT) / (bar.DT - bar_prev.DT);
                        x += ratio * delta_x;
                        price += ratio * delta_y;
                    }
                }

                const y = price ? stx.pixelFromPrice(price, chart.panel) : 0;

                const visible = x >= 0 && chart.yAxis.left > x && chart.yAxis.top <= y && chart.yAxis.bottom >= y;
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
            const prices = price_array.map(price => stx.pixelFromPrice(price * 1, chart.panel));
            const canvas = stx.chart.context.canvas;

            draw_callback({
                ctx: stx.chart.context,
                canvas_height: canvas.height,
                points,
                prices,
            });
        }
    };

    return null;
};

export default observer(RawMarker);
