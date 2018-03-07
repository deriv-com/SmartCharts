import React from 'react';
import '../../sass/components/_icons.scss';
import Candle from '../../sass/icons/chart types/ic-candle.svg';
import Crosshair from '../../sass/icons/chart-controls/ic-crosshair-normal.svg';
import Dot from '../../sass/icons/chart types/ic-dot.svg';
import HollowCandle from '../../sass/icons/chart types/ic-hollow-candle.svg';
import Indicator from '../../sass/icons/chart-controls/ic-indicator-normal-light.svg';
import Line from '../../sass/icons/chart types/ic-line.svg';
import OHLC from '../../sass/icons/chart types/ic-ohlc.svg';
import Spline from '../../sass/icons/chart types/ic-spline.svg';
import Warning from '../../sass/icons/notification/ic-warning.svg';
import Close from '../../sass/icons/notification/ic-close.svg';

const Wrapper = WrappedComponent => props => {
    const propsCopy = Object.assign({}, props);
    propsCopy.className = `ic-icon ${propsCopy.className ? propsCopy.className : ''}`;

    return (
        <span {...propsCopy}>
            <WrappedComponent />
        </span>
    );
};

export const CandleIcon = Wrapper(Candle);
export const CrosshairIcon = Wrapper(Crosshair);
export const DotIcon = Wrapper(Dot);
export const HollowCandleIcon = Wrapper(HollowCandle);
export const IndicatorIcon = Wrapper(Indicator);
export const LineIcon = Wrapper(Line);
export const OHLCIcon = Wrapper(OHLC);
export const SplineIcon = Wrapper(Spline);
export const WarningIcon = Wrapper(Warning);
export const CloseIcon = Wrapper(Close);
