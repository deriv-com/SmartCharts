import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import '../../sass/components/_crosshair.scss';

const Crosshair = () => {
    const { crosshair, chartAdapter } = useStores();

    const { state: crosshairState } = crosshair;
    const crosshairWrapperRef = React.useRef<HTMLDivElement>(null);
    const crosshairRef = React.useRef<HTMLDivElement>(null);
    const crossHairXRef = React.useRef<HTMLDivElement>(null);
    const crossHairYRef = React.useRef<HTMLDivElement>(null);
    const floatDateRef = React.useRef<HTMLDivElement>(null);
    const floatPriceRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        crosshair.onMount({ crosshairRef, crossHairXRef, crossHairYRef, floatDateRef, floatPriceRef });
        return () => crosshair.onUnmount();
    }, []);

    if (!chartAdapter.isChartLoaded) return null;

    return (
        <div ref={crosshairWrapperRef} className='cq-crosshair-wrapper'>
            <div ref={crosshairRef} className='cq-crosshair'>
                <div className='cq-crosshair-tooltip'>
                    {crosshairState === 2 && (
                        <div className='cq-crosshair-content'>
                            {/* this is handled manually in CrosshairStore.ts
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
