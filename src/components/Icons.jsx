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
import Search from '../../sass/icons/common/ic-search-light.svg';

import AUD from '../../sass/icons/flags/aud.svg';
import CAD from '../../sass/icons/flags/cad.svg';
import CHF from '../../sass/icons/flags/chf.svg';
import EUR from '../../sass/icons/flags/eur.svg';
import GBP from '../../sass/icons/flags/gbp.svg';
import JPY from '../../sass/icons/flags/jpy.svg';
import MXN from '../../sass/icons/flags/mxn.svg';
import NOK from '../../sass/icons/flags/nok.svg';
import NZD from '../../sass/icons/flags/nzd.svg';
import PLN from '../../sass/icons/flags/pln.svg';
import SEK from '../../sass/icons/flags/sek.svg';
import USD from '../../sass/icons/flags/usd.svg';

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
export const SearchIcon = Wrapper(Search);

export const CategoryIconMap = {
    active: Wrapper(Active),
    commodities: Wrapper(Commodities),
    favorite: Wrapper(Favorite),
    forex: Wrapper(Forex),
    indices: Wrapper(Indices),
    stocks: Wrapper(Stocks),
    volidx: Wrapper(Volidx),
};

function frx(a, b) {
    const A = ItemIconMap[a];
    const B = ItemIconMap[b];
    ItemIconMap[`frx${a}${b}`] = props => <span className="ic-frx"><span {...props}><A/><B/></span></span>;
}

function wld(a) {
    ItemIconMap[`wld${a}`] = ItemIconMap[a];
}

export const ItemIconMap = {
    aud: Wrapper(AUD),
    cad: Wrapper(CAD),
    chf: Wrapper(CHF),
    eur: Wrapper(EUR),
    gbp: Wrapper(GBP),
    jpy: Wrapper(JPY),
    mxn: Wrapper(MXN),
    nok: Wrapper(NOK),
    nzd: Wrapper(NZD),
    pln: Wrapper(PLN),
    sek: Wrapper(SEK),
    usd: Wrapper(USD),
};

window.blabla = ItemIconMap;

/* FOREX */
/* Major Pairs */
frx('aud', 'jpy');
frx('aud', 'usd');
frx('eur', 'aud');
frx('eur', 'chf');
frx('eur', 'jpy');
frx('eur', 'cad');
frx('eur', 'gbp');
frx('eur', 'usd');
frx('gbp', 'aud');
frx('gbp', 'jpy');
frx('gbp', 'usd');
frx('usd', 'cad');
frx('usd', 'chf');
frx('usd', 'jpy');
/* Minor Pairs */
frx('aud', 'cad');
frx('aud', 'chf');
frx('aud', 'nzd');
frx('aud', 'pln');
frx('eur', 'nzd');
frx('gbp', 'cad');
frx('gbp', 'chf');
frx('gbp', 'nok');
frx('gbp', 'nzd');
frx('gbp', 'pln');
frx('nzd', 'jpy');
frx('nzd', 'usd');
frx('usd', 'mxn');
frx('usd', 'nok');
frx('usd', 'pln');
frx('usd', 'sek');

/* Smart FX */
wld('aud');
wld('eur');
wld('gbp');
wld('usd');
