import React from 'react';
import '../../sass/components/_icons.scss';

// Chart types:
import BaseLine from '../../sass/icons/chart settings/chart types/baseline/ic-baseline-normal.svg';
import Candle from '../../sass/icons/chart settings/chart types/candle/ic-candle-normal.svg';
import Dot from '../../sass/icons/chart settings/chart types/dot/ic-dot-normal.svg';
import HeikinAshi from '../../sass/icons/chart settings/chart types/ic-heikin-ashi-normal.svg';
import HollowCandle from '../../sass/icons/chart settings/chart types/hollow candle/ic-hollowcandle-normal.svg';
import Kagi from '../../sass/icons/chart settings/chart types/ic-kagi-normal.svg';
import Line from '../../sass/icons/chart settings/chart types/line/ic-line-normal.svg';
import LineBreak from '../../sass/icons/chart settings/chart types/ic-linebreak-normal.svg';
import OHLC from '../../sass/icons/chart settings/chart types/ohlc/ic-ohlc-normal.svg';
import PointFigure from '../../sass/icons/chart settings/chart types/ic-pointfigure-normal.svg';
import RangeBars from '../../sass/icons/chart settings/chart types/ic-rangebars-normal.svg';
import Renko from '../../sass/icons/chart settings/chart types/ic-renko-normal.svg';
import Spline from '../../sass/icons/chart settings/chart types/spline/ic-spline-normal.svg';
import Png from '../../sass/icons/download/ic-png.svg';
import Csv from '../../sass/icons/download/ic-csv.svg';


import Add from '../../sass/icons/chart settings/zoom-in/ic-zoomin-light.svg';
import Close from '../../sass/icons/close/ic-close.svg';
import Comparison from '../../sass/icons/chart settings/comparison/ic-comparison-normal.svg';
import CrosshairOff from '../../sass/icons/chart settings/crosshair/ic-crosshair-off.svg';
import CrosshairOn from '../../sass/icons/chart settings/crosshair/ic-crosshair-on.svg';
import CrosshairTooltip from '../../sass/icons/chart settings/crosshair/ic-crosshair-tooltip.svg';
import Delete from '../../sass/icons/delete/ic-delete.svg';
import Clear from '../../sass/icons/clear/ic-clear.svg';
import Draw from '../../sass/icons/chart settings/drawing tools/ic-drawingtools-normal.svg';
import Indicator from '../../sass/icons/chart settings/indicators/ic-indicator-normal.svg';
import Measure from '../../sass/icons/measure/ic-measure.svg';
import Minus from '../../sass/icons/chart settings/zoom-out/ic-zoomout-light.svg';
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
import Download from '../../sass/icons/download/ic-download.svg';
import PositionLeft from '../../sass/icons/chart settings/setting/ic-position-left.svg';
import PositionBottom from '../../sass/icons/chart settings/setting/ic-position-bottom.svg';
import Back from '../../sass/icons/back/ic-back.svg';


import Warning from '../../sass/icons/alert message/warning.svg';
import Error from '../../sass/icons/alert message/error.svg';
import Success from '../../sass/icons/alert message/success.svg';
import Info from '../../sass/icons/alert message/info.svg';

import SymbolPlaceholder from '../../sass/icons/placeholder/ic-placeholder.svg';

const SpriteSheetIcon = name => () => (
    <svg className="cq-spritesheet">
        <use href={`./dist/smartcharts-spritemap.svg#${name}`} />
    </svg>
);

/* Energy */
const Metal = SpriteSheetIcon('ic-metal');
const OilUSD = SpriteSheetIcon('ic-oilusd');

const Portugal = SpriteSheetIcon('portugal');
const Russia = SpriteSheetIcon('russia');
const Thailand = SpriteSheetIcon('thailand');
const Indonesia = SpriteSheetIcon('indonesia');
const Vietnam = SpriteSheetIcon('vietnam');
const Italy = SpriteSheetIcon('italy');
const Chinese = SpriteSheetIcon('chinese');
const ChineseTraditional = SpriteSheetIcon('chinese-traditional');
const Belgium = SpriteSheetIcon('belgium');
const HongKong = SpriteSheetIcon('hong-kong');
const Singapore = SpriteSheetIcon('singapore');
const Bombay = SpriteSheetIcon('bombay');
const Jakarta = SpriteSheetIcon('jakarta');
const German = SpriteSheetIcon('german');
const Dubai = SpriteSheetIcon('dubai');
const Ireland = SpriteSheetIcon('ireland');
const French = SpriteSheetIcon('french');
const Dutch = SpriteSheetIcon('dutch');
const Spanish = SpriteSheetIcon('spanish');
const SouthAfrica = SpriteSheetIcon('south-africa');
const WallStreet = SpriteSheetIcon('wallstreet');

/* Volatility Indices */
const Vol10 = SpriteSheetIcon('ic-10-index');
const Vol25 = SpriteSheetIcon('ic-25-index');
const Vol50 = SpriteSheetIcon('ic-50-index');
const Vol75 = SpriteSheetIcon('ic-75-index');
const Vol100 = SpriteSheetIcon('ic-100-index');
const MarketBear = SpriteSheetIcon('ic-marketbear');
const MarketBull = SpriteSheetIcon('ic-marketbull');

const OTCBadge = SpriteSheetIcon('ic-otcbadge');
const SmartFX = SpriteSheetIcon('ic-smartfx-placeholder');

const AUD = SpriteSheetIcon('aud');
const CAD = SpriteSheetIcon('cad');
const CHF = SpriteSheetIcon('chf');
const EUR = SpriteSheetIcon('eur');
const GBP = SpriteSheetIcon('gbp');
const JPY = SpriteSheetIcon('jpy');
const MXN = SpriteSheetIcon('mxn');
const NOK = SpriteSheetIcon('nok');
const NZD = SpriteSheetIcon('nzd');
const PLN = SpriteSheetIcon('pln');
const SEK = SpriteSheetIcon('sek');
const USD = SpriteSheetIcon('usd');

const Wrapper = WrappedComponent => (props) => {
    let { className, 'tooltip-title': tooltip, ...p } = props; // eslint-disable-line prefer-const
    className = `ic-icon ${className || ''}`;

    return (
        <span
            className={className}
            tooltip-title={tooltip}
            {...p}
        >
            <WrappedComponent />
            {tooltip && <React.Fragment><br /><span className="ic-subtitle">{tooltip}</span></React.Fragment>}
        </span>
    );
};

// Chart Types:
export const BaseLineIcon = Wrapper(BaseLine);
export const CandleIcon = Wrapper(Candle);
export const DotIcon = Wrapper(Dot);
export const HeikinAshiIcon = Wrapper(HeikinAshi);
export const HollowCandleIcon = Wrapper(HollowCandle);
export const KagiIcon = Wrapper(Kagi);
export const LineBreakIcon = Wrapper(LineBreak);
export const LineIcon = Wrapper(Line);
export const OHLCIcon = Wrapper(OHLC);
export const PointFigureIcon = Wrapper(PointFigure);
export const RangeBarsIcon = Wrapper(RangeBars);
export const RenkoIcon = Wrapper(Renko);

export const AddIcon = Wrapper(Add);
export const ZoomInIcon = Wrapper(Add);
export const CloseIcon = Wrapper(Close);
export const ComparisonIcon = Wrapper(Comparison);
export const CrosshairOffIcon = Wrapper(CrosshairOff);
export const CrosshairOnIcon = Wrapper(CrosshairOn);
export const CrosshairTooltipIcon = Wrapper(CrosshairTooltip);
export const DeleteIcon = Wrapper(Delete);
export const ClearIcon = Wrapper(Clear);
export const DrawIcon = Wrapper(Draw);
export const IndicatorIcon = Wrapper(Indicator);
export const MeasureIcon = Wrapper(Measure);
export const ZoomOutIcon = Wrapper(Minus);
export const SplineIcon = Wrapper(Spline);
export const PngIcon = Wrapper(Png);
export const CsvIcon = Wrapper(Csv);
export const StarIcon = Wrapper(Star);
export const TemplateIcon = Wrapper(Template);
export const TickIcon = Wrapper(Tick);
export const SearchIcon = Wrapper(Search);
export const EditIcon = Wrapper(Edit);
export const SettingIcon = Wrapper(Edit);
export const ArrowIcon = Wrapper(Arrow);
export const FavoriteIcon = Wrapper(Star);
export const DownloadIcon = Wrapper(Download);


export const PositionLeftIcon = Wrapper(PositionLeft);
export const PositionBottomIcon = Wrapper(PositionBottom);
export const BackIcon = Wrapper(Back);


export const MetalIcon = Wrapper(Metal);

export const alertIconMap = {
    info: Wrapper(Info),
    success: Wrapper(Success),
    warning: Wrapper(Warning),
    error: Wrapper(Error),
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
    indicators: Wrapper(IndicatorCategory),
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
    French: Wrapper(French),
    Portugal: Wrapper(Portugal),
    Russia: Wrapper(Russia),
    Thailand: Wrapper(Thailand),
    Indonesia: Wrapper(Indonesia),
    Vietnam: Wrapper(Vietnam),
    Italy: Wrapper(Italy),
    Chinese: Wrapper(Chinese),
    ChineseTraditional: Wrapper(ChineseTraditional),
    Poland: Wrapper(PLN),
};


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
    /*
    // German
    DEAIR: Wrapper(Airbus),
    DEALV: Wrapper(Allianz),
    DEBMW: Wrapper(BMW),
    DEDAI: Wrapper(Daimler),
    DEDBK: Wrapper(Deutschebank),
    DENOT: Wrapper(Novartis),
    DESAP: Wrapper(SAP),
    DESIE: Wrapper(Siemens),
    // India
    INBHARTIARTL: Wrapper(BhartiAirtel),
    INMARUTI:     Wrapper(MarutiSuzuki),
    INRIL:        Wrapper(RelianceIndustries),
    INTATASTEEL:  Wrapper(TataSteel),
    // UK
    UKBP:   Wrapper(BP),
    UKBARC: Wrapper(Barclays),
    UKBATS: Wrapper(BritishAmericanTobacco),
    UKHSBA: Wrapper(HSBC),
    UKLLOY: Wrapper(LloydsBank),
    UKRIO:  Wrapper(RioTinto),
    UKSTAN: Wrapper(StandardChartered),
    UKTSCO: Wrapper(Tesco),
    // US
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
    */
    /* Commodities */
    frxBROUSD: Wrapper(OilUSD),
    frxXAUUSD: MetalIcon,
    frxXPDUSD: MetalIcon,
    frxXPTUSD: MetalIcon,
    frxXAGUSD: MetalIcon,
    /* Volatility Indices */
    R_10: Wrapper(Vol10),
    R_25: Wrapper(Vol25),
    R_50: Wrapper(Vol50),
    R_75: Wrapper(Vol75),
    R_100: Wrapper(Vol100),
    RDBEAR: Wrapper(MarketBear),
    RDBULL: Wrapper(MarketBull),
};

function createCompositeIcon(A, B, icId) {
    return (props) => {
        const { className, ...p } = props;
        return (
            <span className={`${icId} ${className}`} {...p}><A /><B /></span>
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
otc('USD', 'OTC_NDX');
otc('CHF', 'OTC_SSMI');
otc('HongKong', 'OTC_HSI');
otc('AUD', 'OTC_AS51');

export const ActiveOptionsIconMap = {
    delete: DeleteIcon,
    edit: EditIcon,
};
