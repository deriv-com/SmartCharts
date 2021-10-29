import React from 'react';
import classNames from 'classnames';
import Shade from './Shade';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';
import PriceLine from './PriceLine';

const Barrier = React.memo(
    ({
        shadeColor = '#39b19d',
        color = '#39b19d',
        foregroundColor = '#ffffff',
        _high_barrier,
        _low_barrier,
        hidePriceLines,
        lineStyle,
        isInitialized,
        priceLabelWidth,
        isSingleBarrier,
        aboveShadeStore,
        belowShadeStore,
        betweenShadeStore,
        ...props
    }: any) =>
        isInitialized && (
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
                            {...props}
                        />
                        <Shade store={aboveShadeStore} />
                        <Shade store={belowShadeStore} />
                        <Shade store={betweenShadeStore} />
                    </>
                )}
            </div>
        )
);

export default connect(
    (store: any) => ({
        _high_barrier: store._high_barrier,
        _low_barrier: store._low_barrier,
        aboveShadeStore: store.aboveShadeStore,
        belowShadeStore: store.belowShadeStore,
        betweenShadeStore: store.betweenShadeStore,
        shadeColor: store.shadeColor,
        color: store.color,
        foregroundColor: store.foregroundColor,
        hideBarrierLine: store.hideBarrierLine,
        hideOffscreenBarrier: store.hideOffscreenBarrier,
        hideOffscreenLine: store.hideOffscreenLine,
        hidePriceLines: store.hidePriceLines,
        lineStyle: store.lineStyle,
        isInitialized: store.isInitialized,
        destructor: store.destructor,
        priceLabelWidth: store.priceLabelWidth,
        title: store.title,
        isSingleBarrier: store.isSingleBarrier,
        opacityOnOverlap: store.opacityOnOverlap,
    }),
    BarrierStore
)(Barrier);
