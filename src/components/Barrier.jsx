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
    yAxiswidth,
}) => (isInitialized && (
    <div
        className={`barrier ${hidePriceLines ? 'hide-pricelines' : ''}`}
        style={{ '--shade-color': shadeColor }}
    >
        <HighPriceLine width={yAxiswidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} />
        <LowPriceLine  width={yAxiswidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} />
        <AboveShade right={yAxiswidth} />
        <BetweenShade right={yAxiswidth} />
        <BelowShade right={yAxiswidth} />
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
    }),
    BarrierStore,
)(Barrier);
