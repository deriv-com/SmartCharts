import { observer } from 'mobx-react-lite';
import moment from 'moment';
import React from 'react';
import { useStores } from 'src/store';
import '../../sass/components/_crosshair.scss';

const Crosshair = () => {
    const { crosshair, chartAdapter, share } = useStores();

    const { state: crosshairState, getDateTimeFormat, renderCrosshairTooltip } = crosshair;
    const crosshairWrapperRef = React.useRef<HTMLDivElement>(null);
    const crosshairRef = React.useRef<HTMLDivElement>(null);
    const crossHairXRef = React.useRef<HTMLDivElement>(null);
    const crossHairYRef = React.useRef<HTMLDivElement>(null);
    const floatDateRef = React.useRef<HTMLDivElement>(null);
    const floatPriceRef = React.useRef<HTMLDivElement>(null);

    const setPositions = React.useCallback((ev: MouseEvent) => {
        if (crossHairXRef.current) crossHairXRef.current.style.transform = `translate(${ev.offsetX}px, 0px)`;
        if (crossHairYRef.current) crossHairYRef.current.style.transform = `translate(0px, ${ev.offsetY}px)`;
        if (floatDateRef.current) {
            const width = floatDateRef.current.clientWidth;
            const epoch = chartAdapter.getEpochFromX(ev.offsetX);
            floatDateRef.current.innerText = moment.utc(epoch).format(getDateTimeFormat());
            floatDateRef.current.style.transform = `translate(${ev.offsetX - width / 2}px, 0px)`;
        }
        if (floatPriceRef.current) {
            const height = floatPriceRef.current.clientHeight;
            const price = chartAdapter.getQuoteFromY(ev.offsetY);

            if (price >= 0) {
                floatPriceRef.current.innerText = `${price.toFixed(share.decimalPlaces || 2)}`;
            }
            floatPriceRef.current.style.transform = `translate(0px, ${ev.offsetY - height / 2}px)`;
        }
    }, []);

    const onMouseMove = React.useCallback(
        (ev: Event) => {
            if (!chartAdapter.isChartLoaded) return;

            renderCrosshairTooltip(ev);
            setPositions(ev as MouseEvent);
        },
        [setPositions]
    );

    React.useEffect(() => {
        crosshair.onMount(onMouseMove);
        return () => crosshair.onUnmount(onMouseMove);
    }, []);

    if (!chartAdapter.isChartLoaded) return null;

    return (
        <div ref={crosshairWrapperRef} className='cq-crosshair-wrapper'>
            <div ref={crosshairRef} className='cq-crosshair'>
                <div className='cq-crosshair-tooltip'>
                    {crosshairState === 2 && (
                        <div className='cq-crosshair-content'>
                            {/* this is handled manually in CrosshairStore.js
                to improve performance, as mbox/react is 5ms slower */}
                        </div>
                    )}
                </div>
                {(crosshairState == 1 || crosshairState == 2) && (
                    <React.Fragment>
                        <div ref={crossHairXRef} className='cq-crosshair-line cq-crosshair-x'></div>
                        <div ref={crossHairYRef} className='cq-crosshair-line cq-crosshair-y'></div>
                    </React.Fragment>
                )}
                {crosshairState == 1 && (
                    <React.Fragment>
                        <div ref={floatDateRef} className='cq-float-date'></div>
                        <div ref={floatPriceRef} className='cq-float-price'></div>
                    </React.Fragment>
                )}
            </div>
        </div>
    );
};

export default observer(Crosshair);
