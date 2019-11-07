import React from 'react';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';

const Barrier = React.memo(({
    shadeColor = '#39b19d',
    color = '#39b19d',
    foregroundColor = '#ffffff',
    HighPriceLine,
    LowPriceLine,
    AboveShade,
    BetweenShade,
    BelowShade,
    hidePriceLines,
    hidePriceLabel,
    lineStyle,
    isInitialized,
    priceLabelWidth,
    hideOffscreenLines,
    barrierTitle,
}) => (isInitialized && (
    <div
        className={`barrier ${hidePriceLines ? 'hide-pricelines' : ''}`}
        style={{ '--shade-color': shadeColor }}
    >
        <HighPriceLine width={priceLabelWidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} hideOffscreenLines={hideOffscreenLines} barrierTitle={barrierTitle} hidePriceLabel={hidePriceLabel} />
        <LowPriceLine  width={priceLabelWidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} hideOffscreenLines={hideOffscreenLines} barrierTitle={barrierTitle} hidePriceLabel={hidePriceLabel} />
        <AboveShade />
        <BetweenShade />
        <BelowShade />
    </div>
)));


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
        priceLabelWidth: store.priceLabelWidth,
        hideOffscreenLines: store.hideOffscreenLines,
        barrierTitle: store.barrierTitle,
        hidePriceLabel: store.hidePriceLabel,
    }),
    BarrierStore,
)(Barrier);
