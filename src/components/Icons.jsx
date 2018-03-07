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
import Active from '../../sass/icons/active symbols/categories/ic-active-normal-light.svg';
import Commodities from '../../sass/icons/active symbols/categories/ic-commodities-normal-light.svg';
import Favorite from '../../sass/icons/active symbols/categories/ic-favorite-normal-light.svg';
import Forex from '../../sass/icons/active symbols/categories/ic-forex-normal-light.svg';
import Indices from '../../sass/icons/active symbols/categories/ic-indices-normal-light.svg';
import Stocks from '../../sass/icons/active symbols/categories/ic-stocks-normal-light.svg';
import Volidx from '../../sass/icons/active symbols/categories/ic-volidx-normal-light.svg';

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

export const CategoryDisplayIconMap = {
    active: Wrapper(Active),
    commodities: Wrapper(Commodities),
    favorite: Wrapper(Favorite),
    forex: Wrapper(Forex),
    indices: Wrapper(Indices),
    stocks: Wrapper(Stocks),
    volidx: Wrapper(Volidx),
};

