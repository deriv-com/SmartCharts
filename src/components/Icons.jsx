import React from 'react';
import '../../sass/components/_icons.scss';
//Svg files
import Crosshair from '../../sass/icons/chart-controls/ic-crosshair-normal.svg';
//Chart types
import Line from '../../sass/icons/chart types/ic-line.svg';
import Dot from '../../sass/icons/chart types/ic-dot.svg';
import Candle from '../../sass/icons/chart types/ic-candle.svg';
import OHLC from '../../sass/icons/chart types/ic-ohlc.svg';
import HollowCandle from '../../sass/icons/chart types/ic-hollow-candle.svg';
import Spline from '../../sass/icons/chart types/ic-spline.svg';

const Wrapper = WrappedComponent => props => {
    const propsCopy = Object.assign({}, props);
    propsCopy.className = `ic-icon ${propsCopy.className ? propsCopy.className : ''}`;

    return (
        <span {...propsCopy}>
            <WrappedComponent />
        </span>
    );
};

export const CrosshairIcon = Wrapper(Crosshair);
export const LineIcon = Wrapper(Line);
export const DotIcon = Wrapper(Dot);
export const CandleIcon = Wrapper(Candle);
export const OHLCIcon = Wrapper(OHLC);
export const HollowCandleIcon = Wrapper(HollowCandle);
export const SplineIcon = Wrapper(Spline);
