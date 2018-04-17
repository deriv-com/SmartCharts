import React from 'react';
import '../../sass/components/_icons.scss';
import Add from '../../sass/icons/chart settings/zoom-in/ic-zoomin-light.svg';
import AddThin from '../../sass/icons/add/ic-add.svg';
import Candle from '../../sass/icons/chart settings/chart types/candle/ic-candle-normal.svg';
import Close from '../../sass/icons/close/ic-close.svg';
import Comparison from '../../sass/icons/chart settings/comparison/ic-comparison-normal.svg';
import Crosshair from '../../sass/icons/chart settings/crosshair/ic-crosshair.svg';
import Delete from '../../sass/icons/delete/ic-delete.svg';
import Clear from '../../sass/icons/clear/ic-clear.svg';
import Dot from '../../sass/icons/chart settings/chart types/dot/ic-dot-normal.svg';
import Download from '../../sass/icons/download/ic-download.svg';
import Draw from '../../sass/icons/chart settings/drawing tools/ic-drawingtools-normal.svg';
import HollowCandle from '../../sass/icons/chart settings/chart types/hollow candle/ic-hollowcandle-normal.svg';
import Indicator from '../../sass/icons/chart settings/indicators/ic-indicator-normal.svg';
import Line from '../../sass/icons/chart settings/chart types/line/ic-line-normal.svg';
import BaseLine from '../../sass/icons/chart settings/chart types/baseline/ic-baseline-normal.svg';
import List from '../../sass/icons/template-list/ic-templatelist.svg';
import Measure from '../../sass/icons/measure/ic-measure.svg';
import Minus from '../../sass/icons/chart settings/zoom-out/ic-zoomout-light.svg';
import OHLC from '../../sass/icons/chart settings/chart types/ohlc/ic-ohlc-normal.svg';
import Spline from '../../sass/icons/chart settings/chart types/spline/ic-spline-normal.svg';
import Star from '../../sass/icons/favorite/ic-favorite-normal.svg';
import Template from '../../sass/icons/chart settings/chart template/ic-charttemplate-normal.svg';
import Tick from '../../sass/icons/tick/ic-tick.svg';
import Active from '../../sass/icons/sidebar/active/ic-active-normal.svg';
import Commodities from '../../sass/icons/sidebar/commodities/ic-commodities-normal.svg';
import FavoriteCategory from '../../sass/icons/sidebar/favorite/ic-favorite-normal.svg';
import Forex from '../../sass/icons/sidebar/forex/ic-forex-normal.svg';
import Indices from '../../sass/icons/sidebar/indices/ic-indices-normal.svg';
import Stocks from '../../sass/icons/sidebar/otc/ic-otc-normal.svg';
import Volidx from '../../sass/icons/sidebar/volatility/ic-volatility-normal.svg';
import Search from '../../sass/icons/search/ic-search-normal.svg';
import Edit from '../../sass/icons/edit/ic-edit.svg';
import IndicatorCategory from '../../sass/icons/sidebar/indicator/ic-indicator-normal.svg';
import Arrow from '../../sass/icons/dropdown/ic-dropdown.svg';
import Copy from '../../sass/icons/share/ic-copy.svg';
import Share from '../../sass/icons/share/ic-share.svg';
import ChevronRight from '../../sass/icons/chart settings/setting/ic-chevron-right.svg';
import PositionLeft from '../../sass/icons/chart settings/setting/ic-position-left.svg';
import PositionBottom from '../../sass/icons/chart settings/setting/ic-position-bottom.svg';
import ThemeDark from '../../sass/icons/chart settings/setting/ic-theme-dark.svg';
import ThemeLight from '../../sass/icons/chart settings/setting/ic-theme-light.svg';
import Back from '../../sass/icons/back/ic-back.svg';



import Warning from '../../sass/icons/alert message/warning.svg';
import Error from '../../sass/icons/alert message/error.svg';
import Success from '../../sass/icons/alert message/success.svg';
import Info from '../../sass/icons/alert message/info.svg';

import SymbolPlaceholder from '../../sass/icons/placeholder/ic-placeholder.svg';
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

import Belgium from '../../sass/icons/flags/belgium.svg';
import HongKong from '../../sass/icons/flags/hong kong.svg';
import Singapore from '../../sass/icons/flags/singapore.svg';
import Bombay from '../../sass/icons/flags/bombay.svg';
import Jakarta from '../../sass/icons/flags/jakarta.svg';
import German from '../../sass/icons/flags/german.svg';
import Dubai from '../../sass/icons/flags/dubai.svg';
import Ireland from '../../sass/icons/flags/ireland.svg';
import French from '../../sass/icons/flags/french.svg';
import Dutch from '../../sass/icons/flags/dutch.svg';
import Spanish from '../../sass/icons/flags/spanish.svg';
import SouthAfrica from '../../sass/icons/flags/south africa.svg';
import WallStreet from '../../sass/icons/flags/wallstreet.svg';

/* German */
import Airbus from '../../sass/icons/active-symbols/otc stocks/ic-airbus.svg';
import Allianz from '../../sass/icons/active-symbols/otc stocks/ic-allianz.svg';
import BMW from '../../sass/icons/active-symbols/otc stocks/ic-bmw.svg';
import Daimler from '../../sass/icons/active-symbols/otc stocks/ic-daimler.svg';
import Deutschebank from '../../sass/icons/active-symbols/otc stocks/ic-deutschebank.svg';
import Novartis from '../../sass/icons/active-symbols/otc stocks/ic-novartis.svg';
import SAP from '../../sass/icons/active-symbols/otc stocks/ic-sap.svg';
import Siemens from '../../sass/icons/active-symbols/otc stocks/ic-siemens.svg';
/* India */
import BhartiAirtel from '../../sass/icons/active-symbols/otc stocks/ic-bhartiairtel.svg';
import MarutiSuzuki from '../../sass/icons/active-symbols/otc stocks/ic-marutisuzuki.svg';
import RelianceIndustries from '../../sass/icons/active-symbols/otc stocks/ic-relianceindustries.svg';
import TataSteel from '../../sass/icons/active-symbols/otc stocks/ic-tatasteel.svg';
/* UK */
import BP from '../../sass/icons/active-symbols/otc stocks/ic-bp.svg';
import Barclays from '../../sass/icons/active-symbols/otc stocks/ic-barclays.svg';
import BritishAmericanTobacco from '../../sass/icons/active-symbols/otc stocks/ic-britishamericantobacco.svg';
import HSBC from '../../sass/icons/active-symbols/otc stocks/ic-hsbc.svg';
import LloydsBank from '../../sass/icons/active-symbols/otc stocks/ic-lloydsbank.svg';
import RioTinto from '../../sass/icons/active-symbols/otc stocks/ic-riotinto.svg';
import StandardChartered from '../../sass/icons/active-symbols/otc stocks/ic-standardchartered.svg';
import Tesco from '../../sass/icons/active-symbols/otc stocks/ic-tesco.svg';
/* US */
import Alibaba from '../../sass/icons/active-symbols/otc stocks/ic-aibaba.svg';
import Alphabet from '../../sass/icons/active-symbols/otc stocks/ic-alphabet.svg';
import Amazon from '../../sass/icons/active-symbols/otc stocks/ic-amazon.svg';
import AmericanExpress from '../../sass/icons/active-symbols/otc stocks/ic-americanexpress.svg';
import Apple from '../../sass/icons/active-symbols/otc stocks/ic-apple.svg';
import BershireHathaway from '../../sass/icons/active-symbols/otc stocks/ic-bershirehathaway.svg';
import Boeing from '../../sass/icons/active-symbols/otc stocks/ic-boeing.svg';
import Caterpillar from '../../sass/icons/active-symbols/otc stocks/ic-caterpillar.svg';
import Citigroup from '../../sass/icons/active-symbols/otc stocks/ic-citigroup.svg';
import ElectronicArts from '../../sass/icons/active-symbols/otc stocks/ic-electronicarts.svg';
import ExxonMobil from '../../sass/icons/active-symbols/otc stocks/ic-exxonmobil.svg';
import Facebook from '../../sass/icons/active-symbols/otc stocks/ic-facebook.svg';
import GoldmanSachs from '../../sass/icons/active-symbols/otc stocks/ic-goldmansachs.svg';
import IBM from '../../sass/icons/active-symbols/otc stocks/ic-ibm.svg';
import JohnsonAndJohnson from '../../sass/icons/active-symbols/otc stocks/ic-johnson-and-johnson.svg';
import Mastercard from '../../sass/icons/active-symbols/otc stocks/ic-mastercard.svg';
import McDonalds from '../../sass/icons/active-symbols/otc stocks/ic-mcdonalds.svg';
import Microsoft from '../../sass/icons/active-symbols/otc stocks/ic-microsoft.svg';
import PepsiCo from '../../sass/icons/active-symbols/otc stocks/ic-pepsico.svg';
import ProcterAndGamble from '../../sass/icons/active-symbols/otc stocks/ic-procterandgamble.svg';

/* Energy */
import OilUSD from '../../sass/icons/active-symbols/energy/oil usd/ic-oilusd.svg';
/* Metals */
import Metal from '../../sass/icons/active-symbols/metals/ic-metal.svg';

/* Volatility Indices */
import Vol10 from '../../sass/icons/active-symbols/volatility/10 index/ic-10index.svg';
import Vol25 from '../../sass/icons/active-symbols/volatility/25 index/ic-25index.svg';
import Vol50 from '../../sass/icons/active-symbols/volatility/50 index/ic-50index.svg';
import Vol75 from '../../sass/icons/active-symbols/volatility/75 index/ic-75index.svg';
import Vol100 from '../../sass/icons/active-symbols/volatility/100 index/ic-100index.svg';
import MarketBear from '../../sass/icons/active-symbols/volatility/bear market/ic-marketbear.svg';
import MarketBull from '../../sass/icons/active-symbols/volatility/bull market/ic-marketbull.svg';

import OTCBadge from '../../sass/icons/active-symbols/ic-otcbadge.svg';
import SmartFX from '../../sass/icons/active-symbols/ic-smartfx-placeholder.svg';

const Wrapper = WrappedComponent => props => {
    let { className, ['tooltip-title']: tooltip, ...p } = props;
    className = `ic-icon ${className ? className : ''} ${tooltip ? 'tooltip' : ''}`;

    return (
        <span
            className={className}
            tooltip-title={tooltip}
            {...p}>
            <WrappedComponent />
        </span>
    );
};

export const AddIcon = Wrapper(Add);
export const AddThinIcon = Wrapper(AddThin);
export const CandleIcon = Wrapper(Candle);
export const CloseIcon = Wrapper(Close);
export const ComparisonIcon = Wrapper(Comparison);
export const CrosshairIcon = Wrapper(Crosshair);
export const DeleteIcon= Wrapper(Delete);
export const ClearIcon= Wrapper(Clear);
export const DotIcon = Wrapper(Dot);
export const DownloadIcon = Wrapper(Download);
export const DrawIcon = Wrapper(Draw);
export const HollowCandleIcon = Wrapper(HollowCandle);
export const IndicatorIcon = Wrapper(Indicator);
export const LineIcon = Wrapper(Line);
export const BaseLineIcon = Wrapper(BaseLine);
export const ListIcon = Wrapper(List);
export const MeasureIcon = Wrapper(Measure);
export const MinusIcon = Wrapper(Minus);
export const OHLCIcon = Wrapper(OHLC);
export const SplineIcon = Wrapper(Spline);
export const StarIcon = Wrapper(Star);
export const TemplateIcon = Wrapper(Template);
export const TickIcon = Wrapper(Tick);
export const SearchIcon = Wrapper(Search);
export const EditIcon = Wrapper(Edit);
export const ArrowIcon = Wrapper(Arrow);
export const FavoriteIcon = Wrapper(Star);
export const CopyIcon = Wrapper(Copy);
export const ShareIcon = Wrapper(Share);

export const ChevronRightIcon = Wrapper(ChevronRight);
export const PositionLeftIcon = Wrapper(PositionLeft);
export const PositionBottomIcon = Wrapper(PositionBottom);
export const ThemeDarkIcon = Wrapper(ThemeDark);
export const ThemeLightIcon = Wrapper(ThemeLight);
export const BackIcon = Wrapper(Back);



export const MetalIcon = Wrapper(Metal);

export const alertIconMap = {
    info:    Wrapper(Info),
    success: Wrapper(Success),
    warning: Wrapper(Warning),
    error:   Wrapper(Error),
};

export const SymbolPlaceholderIcon = Wrapper(SymbolPlaceholder);

export const CategoryIconMap = {
    active: Wrapper(Active),
    commodities: Wrapper(Commodities),
    favorite: Wrapper(FavoriteCategory),
    forex: Wrapper(Forex),
    indices: Wrapper(Indices),
    stocks: Wrapper(Stocks),
    volidx: Wrapper(Volidx),
    indicators: Wrapper(IndicatorCategory)
};

const FlagIconMap = {
    AUD: Wrapper(AUD),
    CAD: Wrapper(CAD),
    CHF: Wrapper(CHF),
    EUR: Wrapper(EUR),
    GBP: Wrapper(GBP),
    JPY: Wrapper(JPY),
    MXN: Wrapper(MXN),
    NOK: Wrapper(NOK),
    NZD: Wrapper(NZD),
    PLN: Wrapper(PLN),
    SEK: Wrapper(SEK),
    USD: Wrapper(USD),
    BOMBAY: Wrapper(Bombay),
    Dubai: Wrapper(Dubai),
    HongKong: Wrapper(HongKong),
    Jakarta: Wrapper(Jakarta),
    Singapore: Wrapper(Singapore),
    Belgium: Wrapper(Belgium),
    Dutch: Wrapper(Dutch),
    German: Wrapper(German),
    French: Wrapper(French),
    Ireland: Wrapper(Ireland),
    Spanish: Wrapper(Spanish),
    SouthAfrica: Wrapper(SouthAfrica),
    WallStreet: Wrapper(WallStreet),
};

export const FlagIcons = {
    USD: Wrapper(USD),
    German: Wrapper(German),
    French: Wrapper(French)    
}


export const ItemIconMap = {
    SPC: FlagIconMap.USD,
    AS51: FlagIconMap.AUD,
    BSESENSEX30: FlagIconMap.BOMBAY,
    HSI: FlagIconMap.HongKong,
    JCI: FlagIconMap.Jakarta,
    STI: FlagIconMap.Singapore,
    N225: FlagIconMap.JPY,
    BFX: FlagIconMap.Belgium,
    AEX: FlagIconMap.Dutch,
    DFMGI: FlagIconMap.Dubai,
    FCHI: FlagIconMap.French,
    OBX: FlagIconMap.NOK,
    SSMI: FlagIconMap.CHF,
    GDAXI: FlagIconMap.German,
    ISEQ: FlagIconMap.Ireland,
    TOP40: FlagIconMap.SouthAfrica,
    /* German */
    DEAIR: Wrapper(Airbus),
    DEALV: Wrapper(Allianz),
    DEBMW: Wrapper(BMW),
    DEDAI: Wrapper(Daimler),
    DEDBK: Wrapper(Deutschebank),
    DENOT: Wrapper(Novartis),
    DESAP: Wrapper(SAP),
    DESIE: Wrapper(Siemens),
    /* India */
    INBHARTIARTL: Wrapper(BhartiAirtel),
    INMARUTI:     Wrapper(MarutiSuzuki),
    INRIL:        Wrapper(RelianceIndustries),
    INTATASTEEL:  Wrapper(TataSteel),
    /* UK */
    UKBP:   Wrapper(BP),
    UKBARC: Wrapper(Barclays),
    UKBATS: Wrapper(BritishAmericanTobacco),
    UKHSBA: Wrapper(HSBC),
    UKLLOY: Wrapper(LloydsBank),
    UKRIO:  Wrapper(RioTinto),
    UKSTAN: Wrapper(StandardChartered),
    UKTSCO: Wrapper(Tesco),
    /* US */
    USALIBA:  Wrapper(Alibaba),
    USGOOG:   Wrapper(Alphabet),
    USAMZN:   Wrapper(Amazon),
    USAMX:    Wrapper(AmericanExpress),
    USAAPL:   Wrapper(Apple),
    USBRKSHR: Wrapper(BershireHathaway),
    USBNG:    Wrapper(Boeing),
    USCAT:    Wrapper(Caterpillar),
    USCT:     Wrapper(Citigroup),
    USEA:     Wrapper(ElectronicArts),
    USXOM:    Wrapper(ExxonMobil),
    USFB:     Wrapper(Facebook),
    USGLDSCH: Wrapper(GoldmanSachs),
    USIBM:    Wrapper(IBM),
    USJNJ:    Wrapper(JohnsonAndJohnson),
    USMA:     Wrapper(Mastercard),
    USMCDON:  Wrapper(McDonalds),
    USMSFT:   Wrapper(Microsoft),
    USPEP:    Wrapper(PepsiCo),
    USPG:     Wrapper(ProcterAndGamble),
    /* Commodities */
    frxBROUSD: Wrapper(OilUSD),
    frxXAUUSD: MetalIcon,
    frxXPDUSD: MetalIcon,
    frxXPTUSD: MetalIcon,
    frxXAGUSD: MetalIcon,
    /* Volatility Indices */
    R_10:   Wrapper(Vol10),
    R_25:   Wrapper(Vol25),
    R_50:   Wrapper(Vol50),
    R_75:   Wrapper(Vol75),
    R_100:  Wrapper(Vol100),
    RDBEAR: Wrapper(MarketBear),
    RDBULL: Wrapper(MarketBull),
};

function createCompositeIcon(A, B, icId) {
    return props => {
        const { className, ...p } = props;
        return (
            <span className={`${icId} ${className}`} {...p}><A/><B/></span>
        );
    };
}

function frx(flagA, flagB) {
    const A = FlagIconMap[flagA];
    const B = FlagIconMap[flagB];
    ItemIconMap[`frx${flagA}${flagB}`] = createCompositeIcon(A, B, 'ic-frx');
}

const OTCBadgeIcon = Wrapper(OTCBadge);
const SmartFXIcon  = Wrapper(SmartFX);

function otc(flag, symbol) {
    const FlagIcon = FlagIconMap[flag];
    ItemIconMap[symbol] = createCompositeIcon(FlagIcon, OTCBadgeIcon, 'ic-otc');
}

function wld(flag) {
    const FlagIcon = FlagIconMap[flag];
    ItemIconMap[`WLD${flag}`] = createCompositeIcon(SmartFXIcon, FlagIcon, 'ic-wld');
}

/* FOREX */
/* Major Pairs */
frx('AUD', 'JPY');
frx('AUD', 'USD');
frx('EUR', 'AUD');
frx('EUR', 'CHF');
frx('EUR', 'JPY');
frx('EUR', 'CAD');
frx('EUR', 'GBP');
frx('EUR', 'USD');
frx('GBP', 'AUD');
frx('GBP', 'JPY');
frx('GBP', 'USD');
frx('USD', 'CAD');
frx('USD', 'CHF');
frx('USD', 'JPY');
/* Minor Pairs */
frx('AUD', 'CAD');
frx('AUD', 'CHF');
frx('AUD', 'NZD');
frx('AUD', 'PLN');
frx('EUR', 'NZD');
frx('GBP', 'CAD');
frx('GBP', 'CHF');
frx('GBP', 'NOK');
frx('GBP', 'NZD');
frx('GBP', 'PLN');
frx('NZD', 'JPY');
frx('NZD', 'USD');
frx('USD', 'MXN');
frx('USD', 'NOK');
frx('USD', 'PLN');
frx('USD', 'SEK');
/* Smart FX */
wld('AUD');
wld('EUR');
wld('GBP');
wld('USD');
/* OTC Indicies */
otc('Dutch', 'OTC_AEX');
otc('GBP', 'OTC_FTSE');
otc('EUR', 'OTC_SX5E');
otc('French', 'OTC_FCHI');
otc('German', 'OTC_GDAXI');
otc('JPY', 'OTC_N225');
otc('Spanish', 'OTC_IBEX35');
otc('USD', 'OTC_SPC');
otc('WallStreet', 'OTC_DJI');

export const ActiveOptionsIconMap = {
    delete: DeleteIcon,
    edit: EditIcon,
};
