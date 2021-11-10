import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import BarrierStore from 'src/store/BarrierStore';
import connectStore from 'src/store/ConnectStore';
import Shade from './Shade';
import PriceLine from './PriceLine';

type TBarrierProps = {
    store: BarrierStore;
};

const Barrier: React.FC<TBarrierProps> = ({ store, ...props }) => {
    const {
        _high_barrier,
        _low_barrier,
        aboveShadeStore,
        belowShadeStore,
        betweenShadeStore,
        shadeColor = '#39b19d',
        color = '#39b19d',
        foregroundColor = '#ffffff',
        hideBarrierLine,
        hideOffscreenBarrier,
        hideOffscreenLine,
        hidePriceLines,
        lineStyle,
        isInitialized,
        priceLabelWidth,
        title,
        isSingleBarrier,
        opacityOnOverlap,
    } = store;

    if (!isInitialized) return null;

    return (
        <div
            className={classNames('barrier', { 'hide-pricelines': hidePriceLines })}
            style={{ '--shade-color': shadeColor } as any}
        >
            <PriceLine
                store={_high_barrier}
                width={priceLabelWidth}
                lineStyle={lineStyle}
                color={color}
                foregroundColor={foregroundColor}
                hideBarrierLine={hideBarrierLine}
                hideOffscreenBarrier={hideOffscreenBarrier}
                hideOffscreenLine={hideOffscreenLine}
                title={title}
                opacityOnOverlap={opacityOnOverlap}
                {...props}
            />
            {!isSingleBarrier && (
                <>
                    <PriceLine
                        store={_low_barrier}
                        width={priceLabelWidth}
                        lineStyle={lineStyle}
                        color={color}
                        foregroundColor={foregroundColor}
                        hideBarrierLine={hideBarrierLine}
                        hideOffscreenBarrier={hideOffscreenBarrier}
                        hideOffscreenLine={hideOffscreenLine}
                        title={title}
                        opacityOnOverlap={opacityOnOverlap}
                        {...props}
                    />
                    <Shade store={aboveShadeStore} />
                    <Shade store={belowShadeStore} />
                    <Shade store={betweenShadeStore} />
                </>
            )}
        </div>
    );
};

const BarrierWrapper = connectStore(observer(Barrier), BarrierStore);

export default BarrierWrapper;
