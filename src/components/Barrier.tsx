import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React, { CSSProperties } from 'react';
import BarrierStore from 'src/store/BarrierStore';
import connectStore from 'src/store/ConnectStore';
import { TBarrierUpdateProps } from 'src/types';
import PriceLine from './PriceLine';
import Shade from './Shade';

export type TBarrierBaseProps = {
    store: BarrierStore;
};

const Barrier = ({ store, ...props }: TBarrierBaseProps) => {
    const {
        _high_barrier,
        _low_barrier,
        aboveShadeStore,
        belowShadeStore,
        betweenShadeStore,
        shadeColor = '#39b19d',
        color = '#39b19d',
        foregroundColor = '#ffffff',
        hideOffscreenBarrier,
        hideOffscreenLine,
        hideBarrierLine,
        hidePriceLines,
        lineStyle,
        isInitialized,
        priceLabelWidth,
        isSingleBarrier,
        opacityOnOverlap,
    } = store;

    if (!isInitialized) return null;

    return (
        <div
            className={classNames('barrier', { 'hide-pricelines': hidePriceLines })}
            style={{ '--shade-color': shadeColor } as CSSProperties}
        >
            <PriceLine
                store={_high_barrier}
                width={priceLabelWidth}
                lineStyle={lineStyle}
                color={color}
                foregroundColor={foregroundColor}
                hideOffscreenBarrier={hideOffscreenBarrier}
                hideOffscreenLine={hideOffscreenLine}
                hideBarrierLine={hideBarrierLine}
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
                        hideOffscreenBarrier={hideOffscreenBarrier}
                        hideOffscreenLine={hideOffscreenLine}
                        hideBarrierLine={hideBarrierLine}
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

const BarrierWrapper = connectStore<TBarrierBaseProps, TBarrierUpdateProps>(observer(Barrier), BarrierStore);

export default BarrierWrapper;
