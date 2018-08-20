import React from 'react';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';

const Barrier = ({
    shadeColor = '#4caf50',
    color = '#000',
    HighPriceLine,
    LowPriceLine,
    AboveShade,
    BetweenShade,
    BelowShade,
    hidePriceLines,
    lineStyle,
    isInitialized,
}) => (isInitialized && (
    <div
        className={`barrier ${hidePriceLines ? 'hide-pricelines' : ''}`}
        style={{ '--shade-color': shadeColor }}
    >
        <HighPriceLine lineStyle={lineStyle} color={color} />
        <LowPriceLine  lineStyle={lineStyle} color={color} />
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
        hidePriceLines: store.hidePriceLines,
        lineStyle: store.lineStyle,
        isInitialized: store.isInitialized,
        destructor: store.destructor,
    }),
    BarrierStore,
)(Barrier);
