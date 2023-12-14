import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import { TRefData } from 'src/types';
import { strToDateTime } from 'src/utils/date';
import { getUTCDate } from '../utils';

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
    overlap_y_axis?: boolean;
    children?: React.ReactNode;
};

const FastMarker = (props: TFastMarkerProps) => {
    const { chart: chartStore, chartAdapter } = useStores();
    const price_ref = React.useRef<number | null>(null);
    const date_ref = React.useRef<Date | null>(null);
    const epoch_ref = React.useRef<number | null>(null);
    const elem_ref = React.useRef<HTMLDivElement | null>(null);

    const props_ref = React.useRef(props);
    props_ref.current = props;

    React.useEffect(() => {
        chartAdapter.painter.registerCallback(updateCSS);

        return () => {
            chartAdapter.painter.unregisterCallback(updateCSS);
        };
    }, []);

    React.useEffect(() => {
        updateCSS();
    }, [
        chartAdapter.epochBounds,
        chartAdapter.quoteBounds,
        chartAdapter.isFeedLoaded,
        chartAdapter.isChartLoaded,
        chartStore.lastQuote,
    ]);

    const setPosition = ({ epoch, price }: Record<string, number | null | undefined>) => {
        price_ref.current = Number(price) || null;
        date_ref.current = strToDateTime(getUTCDate(epoch as number)) as Date;
        epoch_ref.current = epoch ? epoch * 1000 : null;

        updateCSS();
    };

    const updateCSS = () => {
        if (!chartAdapter.isFeedLoaded || !chartAdapter.isChartLoaded) {
            return;
        }

        if (!elem_ref.current) {
            return;
        }
        if (!date_ref.current) {
            elem_ref.current.style.visibility = 'hidden';
            return;
        }

        const offsetTop = props_ref.current.offsetTop || 0;
        const offsetLeft = props_ref.current.offsetLeft || 0;
        const elem = elem_ref.current;

        let top = 0,
            left = 0,
            show = true;

        if (epoch_ref.current) {
            const x: number = chartAdapter.getXFromEpoch(epoch_ref.current);
            const y: number = price_ref.current ? chartAdapter.getYFromQuote(price_ref.current) : 0;

            if (x > 0 && (price_ref.current == null || y > 0)) {
                top = +y;
                left = +x;
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
            updateCSS();
        }
    };

    const { children, className } = props;

    if (!chartAdapter.isChartLoaded) return null;

    const { chartNode, yAxisWidth } = chartStore;

    const { overlap_y_axis = true } = props;

    const maxWidth = chartNode && !overlap_y_axis ? chartNode.offsetWidth - yAxisWidth - 10 : '100%';

    return (
        <div className='fast-marker' style={{ maxWidth: maxWidth }}>
            <div className={className} ref={setRef} style={{ position: 'absolute',zIndex:2 }}>
                {children}
            </div>
        </div>
    );
};

export default observer(FastMarker);
