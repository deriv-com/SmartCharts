import React from 'react';
import classNames from 'classnames';
import Shade from './Shade';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';

const Barrier = React.memo(
    ({
        shadeColor = '#39b19d',
        color = '#39b19d',
        foregroundColor = '#ffffff',
        HighPriceLine,
        LowPriceLine,
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
                <HighPriceLine
                    width={priceLabelWidth}
                    lineStyle={lineStyle}
                    color={color}
                    foregroundColor={foregroundColor}
                    {...props}
                />
                {!isSingleBarrier && (
                    <>
                        <LowPriceLine
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
        HighPriceLine: store.HighPriceLine,
        LowPriceLine: store.LowPriceLine,
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
