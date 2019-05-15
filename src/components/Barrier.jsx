import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from '../store/Connect';
import BarrierStore from '../store/BarrierStore';

const Barrier = ({
    shadeColor,
    color,
    foregroundColor,
    HighPriceLine,
    LowPriceLine,
    AboveShade,
    BetweenShade,
    BelowShade,
    hidePriceLines,
    lineStyle,
    isInitialized,
    priceLabelWidth,
}) => (isInitialized && (
    <div
        className={`barrier ${hidePriceLines ? 'hide-pricelines' : ''}`}
        style={{ '--shade-color': shadeColor }}
    >
        <HighPriceLine width={priceLabelWidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} />
        <LowPriceLine  width={priceLabelWidth} lineStyle={lineStyle} color={color} foregroundColor={foregroundColor} />
        <AboveShade />
        <BetweenShade />
        <BelowShade />
    </div>
));

Barrier.propTypes = {
    shadeColor          : PropTypes.string,
    color               : PropTypes.string,
    foregroundColor     : PropTypes.string,
    HighPriceLine       : PropTypes.node.isRequired,
    LowPriceLine        : PropTypes.node.isRequired,
    AboveShade          : PropTypes.node.isRequired,
    BetweenShade        : PropTypes.node.isRequired,
    BelowShade          : PropTypes.node.isRequired,
    hidePriceLines      : PropTypes.bool,
    lineStyle           : PropTypes.string,
    isInitialized       : PropTypes.bool,
};

Barrier.defaultProps = {
    shadeColor          : '#39b19d',
    color               : '#39b19d',
    foregroundColor     : '#ffffff',
    hidePriceLines      : false,
    lineStyle           : 'solid',
    isInitialized       : false,
};

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
    }),
    BarrierStore,
)(Barrier);
