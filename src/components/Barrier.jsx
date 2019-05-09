import React from 'react';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';

const Barrier = ({
    shadeColor = '#39b19d',
    color = '#39b19d',
    foregroundColor = '#ffffff',
    HighPriceLine,
    LowPriceLine,
    AboveShade,
    BetweenShade,
    BelowShade,
    hidePriceLines,
    lineStyle,
    isInitialized,
    yAxisWidth,
}) => (isInitialized && (
    <div
        className={`barrier ${hidePriceLines ? 'hide-pricelines' : ''}`}
        style={{ '--shade-color': shadeColor }}
    >
        <HighPriceLine width={yAxisWidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} />
        <LowPriceLine  width={yAxisWidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} />
        <AboveShade />
        <BetweenShade />
        <BelowShade />
    </div>
));


export default connect(
    store => ({
        HighPriceLine: store.HighPriceLine,
        LowPriceLine: store.LowPriceLine,
        AboveShade: store.AboveShade,
        BetweenShade: store.BetweenShade,
        BelowShade: store.BelowShade,
        shadeColor: store.shadeColor,
        color: store.color,
        foregroundColor: store.foregroundColor,
        hidePriceLines: store.hidePriceLines,
        lineStyle: store.lineStyle,
        isInitialized: store.isInitialized,
        destructor: store.destructor,
        yAxisWidth: store.yAxisWidth,
    }),
    BarrierStore,
)(Barrier);
