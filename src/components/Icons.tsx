import React from 'react';
import '../../sass/components/_icons.scss';

// Chart types:
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import BaseLine from '../../sass/icons/chart settings/chart types/baseline/ic-baseline-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Candle from '../../sass/icons/chart settings/chart types/candle/ic-candle-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Dot from '../../sass/icons/chart settings/chart types/dot/ic-dot-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import LineDot from '../../sass/icons/chart settings/chart types/line dot/ic-linedot-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import HeikinAshi from '../../sass/icons/chart settings/chart types/ic-heikin-ashi-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import HollowCandle from '../../sass/icons/chart settings/chart types/hollow candle/ic-hollowcandle-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Kagi from '../../sass/icons/chart settings/chart types/ic-kagi-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Line from '../../sass/icons/chart settings/chart types/line/ic-line-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import LineBreak from '../../sass/icons/chart settings/chart types/ic-linebreak-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import OHLC from '../../sass/icons/chart settings/chart types/ohlc/ic-ohlc-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import PointFigure from '../../sass/icons/chart settings/chart types/ic-pointfigure-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import RangeBars from '../../sass/icons/chart settings/chart types/ic-rangebars-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Renko from '../../sass/icons/chart settings/chart types/ic-renko-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Spline from '../../sass/icons/chart settings/chart types/spline/ic-spline-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Table from '../../sass/icons/chart settings/chart types/table/table.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/download/ic-p... Remove this comment to see the full error message
import Png from '../../sass/icons/download/ic-png.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/download/ic-c... Remove this comment to see the full error message
import Csv from '../../sass/icons/download/ic-csv.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Add from '../../sass/icons/chart settings/zoom-in/ic-zoomin-light.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-add... Remove this comment to see the full error message
import AddBold from '../../sass/icons/common/ic-add.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-clo... Remove this comment to see the full error message
import Close from '../../sass/icons/common/ic-close.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-inp... Remove this comment to see the full error message
import InputNumberMinus from '../../sass/icons/common/ic-input-number-minus.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-inp... Remove this comment to see the full error message
import InputNumberPlus from '../../sass/icons/common/ic-input-number-plus.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/close/ic-clos... Remove this comment to see the full error message
import CloseCircle from '../../sass/icons/close/ic-close-circle.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/close/ic-clos... Remove this comment to see the full error message
import CloseBold from '../../sass/icons/close/ic-close-bold.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Comparison from '../../sass/icons/chart settings/comparison/ic-comparison-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import CrosshairOff from '../../sass/icons/chart settings/crosshair/ic-crosshair-off.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import CrosshairOn from '../../sass/icons/chart settings/crosshair/ic-crosshair-on.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import CrosshairTooltip from '../../sass/icons/chart settings/crosshair/ic-crosshair-tooltip.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/delete/ic-del... Remove this comment to see the full error message
import Delete from '../../sass/icons/delete/ic-delete.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/clear/ic-clea... Remove this comment to see the full error message
import Clear from '../../sass/icons/clear/ic-clear.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Draw from '../../sass/icons/chart settings/drawing tools/ic-drawingtools-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/measure/ic-me... Remove this comment to see the full error message
import Measure from '../../sass/icons/measure/ic-measure.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import Minus from '../../sass/icons/chart settings/zoom-out/ic-zoomout-light.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/favorite/ic-f... Remove this comment to see the full error message
import Star from '../../sass/icons/favorite/ic-favorite-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/tick/ic-tick.... Remove this comment to see the full error message
import Tick from '../../sass/icons/tick/ic-tick.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/time/ic-time.... Remove this comment to see the full error message
import Time from '../../sass/icons/time/ic-time.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-act... Remove this comment to see the full error message
import Active from '../../sass/icons/common/ic-active.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/sidebar/commo... Remove this comment to see the full error message
import Commodities from '../../sass/icons/sidebar/commodities/ic-commodities-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/sidebar/forex... Remove this comment to see the full error message
import Forex from '../../sass/icons/sidebar/forex/ic-forex-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/sidebar/indic... Remove this comment to see the full error message
import Indices from '../../sass/icons/sidebar/indices/ic-indices-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/sidebar/otc/i... Remove this comment to see the full error message
import Stocks from '../../sass/icons/sidebar/otc/ic-otc-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/sidebar/synth... Remove this comment to see the full error message
import SynthIndex from '../../sass/icons/sidebar/synth_index/ic-synth-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/sidebar/volat... Remove this comment to see the full error message
import Volidx from '../../sass/icons/sidebar/volatility/ic-volatility-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/search/ic-sea... Remove this comment to see the full error message
import Search from '../../sass/icons/search/ic-search-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/edit/ic-edit.... Remove this comment to see the full error message
import Edit from '../../sass/icons/edit/ic-edit.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/dropdown/ic-d... Remove this comment to see the full error message
import Arrow from '../../sass/icons/dropdown/ic-dropdown.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import PositionLeft from '../../sass/icons/chart settings/setting/ic-position-left.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart setting... Remove this comment to see the full error message
import PositionBottom from '../../sass/icons/chart settings/setting/ic-position-bottom.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/back/ic-back.... Remove this comment to see the full error message
import Back from '../../sass/icons/back/ic-back.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/pencil/ic-pen... Remove this comment to see the full error message
import DrawCursor from '../../sass/icons/pencil/ic-pencil.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-dra... Remove this comment to see the full error message
import DrawTool from '../../sass/icons/common/ic-drawing-tool.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-hel... Remove this comment to see the full error message
import HelpCenter from '../../sass/icons/common/ic-help-center.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-dow... Remove this comment to see the full error message
import Download from '../../sass/icons/common/ic-download.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-ind... Remove this comment to see the full error message
import Indicator from '../../sass/icons/common/ic-indicators.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-tem... Remove this comment to see the full error message
import Template from '../../sass/icons/common/ic-templates.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/full-s... Remove this comment to see the full error message
import FullScreen from '../../sass/icons/common/full-screen.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/alert message... Remove this comment to see the full error message
import Warning from '../../sass/icons/alert message/warning.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/alert message... Remove this comment to see the full error message
import Error from '../../sass/icons/alert message/error.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/alert message... Remove this comment to see the full error message
import Success from '../../sass/icons/alert message/success.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/alert message... Remove this comment to see the full error message
import Info from '../../sass/icons/alert message/info.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/navigation-wi... Remove this comment to see the full error message
import Home from '../../sass/icons/navigation-widgets/ic-home.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/navigation-wi... Remove this comment to see the full error message
import Scale from '../../sass/icons/navigation-widgets/ic-scale-full.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/navigation-wi... Remove this comment to see the full error message
import Zoomin from '../../sass/icons/navigation-widgets/ic-zoomin.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/navigation-wi... Remove this comment to see the full error message
import Zoomout from '../../sass/icons/navigation-widgets/ic-zoomout.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeArea from '../../sass/icons/chart-type/ic-area.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeCandle from '../../sass/icons/chart-type/ic-candle.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeHollow from '../../sass/icons/chart-type/ic-hollow.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeOhlc from '../../sass/icons/chart-type/ic-ohlc.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeAreaGrayscale from '../../sass/icons/chart-type/ic-area-grayscale.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeCandleGrayscale from '../../sass/icons/chart-type/ic-candle-grayscale.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeHollowGrayscale from '../../sass/icons/chart-type/ic-hollow-grayscale.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/chart-type/ic... Remove this comment to see the full error message
import TypeOhlcGrayscale from '../../sass/icons/chart-type/ic-ohlc-grayscale.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/arrows/ic-arr... Remove this comment to see the full error message
import ArrowGreen from '../../sass/icons/arrows/ic-arrow-green.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/arrows/ic-arr... Remove this comment to see the full error message
import ArrowOrange from '../../sass/icons/arrows/ic-arrow-orange.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/placeholder/i... Remove this comment to see the full error message
import SymbolPlaceholder from '../../sass/icons/placeholder/ic-placeholder.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/aud.svg... Remove this comment to see the full error message
import AUD from '../../sass/icons/flags/aud.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/cad.svg... Remove this comment to see the full error message
import CAD from '../../sass/icons/flags/cad.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/chf.svg... Remove this comment to see the full error message
import CHF from '../../sass/icons/flags/chf.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/eur.svg... Remove this comment to see the full error message
import EUR from '../../sass/icons/flags/eur.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/gbp.svg... Remove this comment to see the full error message
import GBP from '../../sass/icons/flags/gbp.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/jpy.svg... Remove this comment to see the full error message
import JPY from '../../sass/icons/flags/jpy.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/mxn.svg... Remove this comment to see the full error message
import MXN from '../../sass/icons/flags/mxn.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/nok.svg... Remove this comment to see the full error message
import NOK from '../../sass/icons/flags/nok.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/nzd.svg... Remove this comment to see the full error message
import NZD from '../../sass/icons/flags/nzd.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/pln.svg... Remove this comment to see the full error message
import PLN from '../../sass/icons/flags/pln.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/sek.svg... Remove this comment to see the full error message
import SEK from '../../sass/icons/flags/sek.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/usd.svg... Remove this comment to see the full error message
import USD from '../../sass/icons/flags/usd.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/portuga... Remove this comment to see the full error message
import Portugal from '../../sass/icons/flags/portugal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/russia.... Remove this comment to see the full error message
import Russia from '../../sass/icons/flags/russia.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/thailan... Remove this comment to see the full error message
import Thailand from '../../sass/icons/flags/thailand.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/indones... Remove this comment to see the full error message
import Indonesia from '../../sass/icons/flags/indonesia.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/vietnam... Remove this comment to see the full error message
import Vietnam from '../../sass/icons/flags/vietnam.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/italy.s... Remove this comment to see the full error message
import Italy from '../../sass/icons/flags/italy.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/chinese... Remove this comment to see the full error message
import Chinese from '../../sass/icons/flags/chinese.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/chinese... Remove this comment to see the full error message
import ChineseTraditional from '../../sass/icons/flags/chinese-traditional.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/german.... Remove this comment to see the full error message
import German from '../../sass/icons/flags/german.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/hong ko... Remove this comment to see the full error message
import HongKong from '../../sass/icons/flags/hong kong.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/french.... Remove this comment to see the full error message
import French from '../../sass/icons/flags/french.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/dutch.s... Remove this comment to see the full error message
import Dutch from '../../sass/icons/flags/dutch.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/spanish... Remove this comment to see the full error message
import Spanish from '../../sass/icons/flags/spanish.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/flags/wallstr... Remove this comment to see the full error message
import WallStreet from '../../sass/icons/flags/wallstreet.svg';

/* Energy */
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import OilUSD from '../../sass/icons/active-symbols/energy/oil usd/ic-oilusd.svg';
/* Metals */
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Metal from '../../sass/icons/active-symbols/metals/ic-metal.svg';

/* Synthetic Indices */
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol10 from '../../sass/icons/active-symbols/volatility/10 index/ic-10-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol25 from '../../sass/icons/active-symbols/volatility/25 index/ic-25-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol50 from '../../sass/icons/active-symbols/volatility/50 index/ic-50-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol75 from '../../sass/icons/active-symbols/volatility/75 index/ic-75-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol100 from '../../sass/icons/active-symbols/volatility/100 index/ic-100-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol1S10 from '../../sass/icons/active-symbols/volatility/1s10 index/ic-10-1s-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol1S25 from '../../sass/icons/active-symbols/volatility/1s25 index/light-25(1s)index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol1S50 from '../../sass/icons/active-symbols/volatility/1s50 index/light-50(1s) index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol1S75 from '../../sass/icons/active-symbols/volatility/1s75 index/light-75(1s) index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Vol1S100 from '../../sass/icons/active-symbols/volatility/1s100 index/ic-100-1s-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Crash500 from '../../sass/icons/active-symbols/volatility/crash500 index/crash500 index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Crash1000 from '../../sass/icons/active-symbols/volatility/crash1000 index/crash1000 index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Boom500 from '../../sass/icons/active-symbols/volatility/boom500 index/boom500 index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Boom1000 from '../../sass/icons/active-symbols/volatility/boom1000 index/boom1000 index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import MarketBear from '../../sass/icons/active-symbols/volatility/bear market/ic-marketbear.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import MarketBull from '../../sass/icons/active-symbols/volatility/bull market/ic-marketbull.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import Step from '../../sass/icons/active-symbols/volatility/step index/step index.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import OTCBadge from '../../sass/icons/active-symbols/ic-otcbadge.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/active-symbol... Remove this comment to see the full error message
import SmartFX from '../../sass/icons/active-symbols/ic-smartfx-placeholder.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/shape/ic-empt... Remove this comment to see the full error message
import EmptyState from '../../sass/icons/shape/ic-empty-state.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/shape/ic-over... Remove this comment to see the full error message
import OverwriteState from '../../sass/icons/shape/ic-overwrite-state.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-inf... Remove this comment to see the full error message
import InfoCircle from '../../sass/icons/common/ic-info.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-lan... Remove this comment to see the full error message
import Language from '../../sass/icons/common/ic-language.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-the... Remove this comment to see the full error message
import Theme from '../../sass/icons/common/ic-theme.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-cha... Remove this comment to see the full error message
import Chart from '../../sass/icons/common/ic-charts.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-che... Remove this comment to see the full error message
import Checkbox from '../../sass/icons/common/ic-checkbox.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/common/ic-che... Remove this comment to see the full error message
import CheckboxActive from '../../sass/icons/common/ic-checkbox-active.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/ic-th... Remove this comment to see the full error message
import ThemeLight from '../../sass/icons/setting/ic-theme-light.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/ic-th... Remove this comment to see the full error message
import ThemeDark from '../../sass/icons/setting/ic-theme-dark.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/count... Remove this comment to see the full error message
import SettingCountdownLightNormal from '../../sass/icons/setting/countdown/ic-countdown-light-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/count... Remove this comment to see the full error message
import SettingCountdownLightActive from '../../sass/icons/setting/countdown/ic-countdown-light-active.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/count... Remove this comment to see the full error message
import SettingCountdownDarkNormal from '../../sass/icons/setting/countdown/ic-countdown-dark-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/count... Remove this comment to see the full error message
import SettingCountdownDarkActive from '../../sass/icons/setting/countdown/ic-countdown-dark-active.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/histo... Remove this comment to see the full error message
import SettingHistoricalLightNormal from '../../sass/icons/setting/historical/ic-historical-light-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/histo... Remove this comment to see the full error message
import SettingHistoricalLightActive from '../../sass/icons/setting/historical/ic-historical-light-active.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/histo... Remove this comment to see the full error message
import SettingHistoricalDarkNormal from '../../sass/icons/setting/historical/ic-historical-dark-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/histo... Remove this comment to see the full error message
import SettingHistoricalDarkActive from '../../sass/icons/setting/historical/ic-historical-dark-active.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/highe... Remove this comment to see the full error message
import SettingHighestLowestLightNormal from '../../sass/icons/setting/highest-lowest/ic-highest-lowest-light-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/highe... Remove this comment to see the full error message
import SettingHighestLowestLightActive from '../../sass/icons/setting/highest-lowest/ic-highest-lowest-light-active.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/highe... Remove this comment to see the full error message
import SettingHighestLowestDarkNormal from '../../sass/icons/setting/highest-lowest/ic-highest-lowest-dark-normal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/setting/highe... Remove this comment to see the full error message
import SettingHighestLowestDarkActive from '../../sass/icons/setting/highest-lowest/ic-highest-lowest-dark-active.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCatMomentum from '../../sass/icons/indicators/ic-momentum.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCatTrendLight from '../../sass/icons/indicators/ic-trend-light.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCatTrendDark from '../../sass/icons/indicators/ic-trend-dark.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCatVolatility from '../../sass/icons/indicators/ic-volatility.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCatAverages from '../../sass/icons/indicators/ic-cat-averages.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCatOther from '../../sass/icons/indicators/ic-other.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorAwesomeOscillator from '../../sass/icons/indicators/ic-awesome-oscillator.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorDTrended from '../../sass/icons/indicators/ic-dtrended.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorGator from '../../sass/icons/indicators/ic-gator.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorMacd from '../../sass/icons/indicators/ic-macd.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorRateChange from '../../sass/icons/indicators/ic-rate-of-change.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorRSI from '../../sass/icons/indicators/ic-rsi.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorStochasticOscillator from '../../sass/icons/indicators/ic-stochastic-oscillator.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorStochasticMomentum from '../../sass/icons/indicators/ic-stochastic-momentum.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorWilliamPercent from '../../sass/icons/indicators/ic-william-percent.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorAroon from '../../sass/icons/indicators/ic-aroon.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorAdx from '../../sass/icons/indicators/ic-adx.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorCommodityChannelIndex from '../../sass/icons/indicators/ic-commodity-channel-index.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorIchimoku from '../../sass/icons/indicators/ic-ichimoku.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorParabolic from '../../sass/icons/indicators/ic-parabolic.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorZigZag from '../../sass/icons/indicators/ic-zig-zag.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorBollinger from '../../sass/icons/indicators/ic-bollinger.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorDonchian from '../../sass/icons/indicators/ic-donchian.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorAverages from '../../sass/icons/indicators/ic-averages.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorEnvelope from '../../sass/icons/indicators/ic-envelope.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorAlligator from '../../sass/icons/indicators/ic-alligator.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorFractalChaos from '../../sass/icons/indicators/ic-fractal-chaos.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/indicators/ic... Remove this comment to see the full error message
import IndicatorRainbow from '../../sass/icons/indicators/ic-rainbow.svg';

// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsChannel from '../../sass/icons/draw-tools/ic-channel.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsContinuous from '../../sass/icons/draw-tools/ic-continuous.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsFibonaccifan from '../../sass/icons/draw-tools/ic-fibonacci-fan.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsHorizontal from '../../sass/icons/draw-tools/ic-horizontal.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsLine from '../../sass/icons/draw-tools/ic-line.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsRay from '../../sass/icons/draw-tools/ic-ray.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsRectangle from '../../sass/icons/draw-tools/ic-rectangle.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsTrend from '../../sass/icons/draw-tools/ic-trend.svg';
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '../../sass/icons/draw-tools/ic... Remove this comment to see the full error message
import DrawToolsVertical from '../../sass/icons/draw-tools/ic-vertical.svg';

export const Wrapper = (SvgLogo: any) => (props: any) => {
    let { className, 'tooltip-title': tooltip, ...p } = props; // eslint-disable-line prefer-const
    className = `ic-icon ${className || ''}`;
    const vb = SvgLogo.viewBox.split(' ').slice(2);

    return (
        <span className={className} tooltip-title={tooltip} {...p}>
            <svg width={vb[0]} height={vb[1]}>
                <use xlinkHref={__webpack_public_path__ + SvgLogo.url /* eslint-disable-line no-undef */} />
            </svg>
            {tooltip && (
                <>
                    <br />
                    <span className='ic-subtitle'>{tooltip}</span>
                </>
            )}
        </span>
    );
};

export const DrawingCursorIcon = Wrapper(DrawCursor);
export const ThemeLightIcon = Wrapper(ThemeLight);
export const ThemeDarkIcon = Wrapper(ThemeDark);
export const DrawToolIcon = Wrapper(DrawTool);
export const ActiveIcon = Wrapper(Active);
export const FullScreenIcon = Wrapper(FullScreen);

// Chart Types:
export const BaseLineIcon = Wrapper(BaseLine);
export const CandleIcon = Wrapper(Candle);
export const DotIcon = Wrapper(Dot);
export const LineDotIcon = Wrapper(LineDot);
export const HeikinAshiIcon = Wrapper(HeikinAshi);
export const HollowCandleIcon = Wrapper(HollowCandle);
export const KagiIcon = Wrapper(Kagi);
export const LineBreakIcon = Wrapper(LineBreak);
export const LineIcon = Wrapper(Line);
export const OHLCIcon = Wrapper(OHLC);
export const PointFigureIcon = Wrapper(PointFigure);
export const RangeBarsIcon = Wrapper(RangeBars);
export const RenkoIcon = Wrapper(Renko);
export const TableIcon = Wrapper(Table);
export const AddIcon = Wrapper(AddBold);
export const ZoomInIcon = Wrapper(Add);
export const CloseIcon = Wrapper(Close);
export const InputNumberMinusIcon = Wrapper(InputNumberMinus);
export const InputNumberPlusIcon = Wrapper(InputNumberPlus);
export const CloseCircleIcon = Wrapper(CloseCircle);
export const CloseBoldIcon = Wrapper(CloseBold);
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
export const TimeIcon = Wrapper(Time);
export const SearchIcon = Wrapper(Search);
export const EditIcon = Wrapper(Edit);
export const SettingIcon = Wrapper(Edit);
export const ArrowIcon = Wrapper(Arrow);
export const FavoriteIcon = Wrapper(Star);
export const HelpCenterIcon = Wrapper(HelpCenter);
export const DownloadIcon = Wrapper(Download);
export const InfoIcon = Wrapper(Info);
export const InfoCircleIcon = Wrapper(InfoCircle);

export const PositionLeftIcon = Wrapper(PositionLeft);
export const PositionBottomIcon = Wrapper(PositionBottom);
export const BackIcon = Wrapper(Back);

export const HomeIcon = Wrapper(Home);
export const ScaleIcon = Wrapper(Scale);
export const ZoominIcon = Wrapper(Zoomin);
export const ZoomoutIcon = Wrapper(Zoomout);

export const LanguageIcon = Wrapper(Language);
export const ThemeIcon = Wrapper(Theme);
export const ChartIcon = Wrapper(Chart);
export const CheckboxIcon = Wrapper(Checkbox);
export const CheckboxActiveIcon = Wrapper(CheckboxActive);

export const TypeAreaIcon = Wrapper(TypeArea);
export const TypeCandleIcon = Wrapper(TypeCandle);
export const TypeHollowIcon = Wrapper(TypeHollow);
export const TypeOhlcIcon = Wrapper(TypeOhlc);

export const TypeAreaGrayscaleIcon = Wrapper(TypeAreaGrayscale);
export const TypeCandleGrayscaleIcon = Wrapper(TypeCandleGrayscale);
export const TypeHollowGrayscaleIcon = Wrapper(TypeHollowGrayscale);
export const TypeOhlcGrayscaleIcon = Wrapper(TypeOhlcGrayscale);

export const IndicatorCatMomentumIcon = Wrapper(IndicatorCatMomentum);
export const IndicatorCatTrendLightIcon = Wrapper(IndicatorCatTrendLight);
export const IndicatorCatTrendDarkIcon = Wrapper(IndicatorCatTrendDark);
export const IndicatorCatVolatilityIcon = Wrapper(IndicatorCatVolatility);
export const IndicatorCatAveragesIcon = Wrapper(IndicatorCatAverages);
export const IndicatorCatOtherIcon = Wrapper(IndicatorCatOther);

export const IndicatorAwesomeOscillatorIcon = Wrapper(IndicatorAwesomeOscillator);
export const IndicatorDTrendedIcon = Wrapper(IndicatorDTrended);
export const IndicatorGatorIcon = Wrapper(IndicatorGator);
export const IndicatorMacdIcon = Wrapper(IndicatorMacd);
export const IndicatorRateChangeIcon = Wrapper(IndicatorRateChange);
export const IndicatorRSIIcon = Wrapper(IndicatorRSI);
export const IndicatorStochasticOscillatorIcon = Wrapper(IndicatorStochasticOscillator);
export const IndicatorStochasticMomentumIcon = Wrapper(IndicatorStochasticMomentum);
export const IndicatorWilliamPercentIcon = Wrapper(IndicatorWilliamPercent);
export const IndicatorAroonIcon = Wrapper(IndicatorAroon);
export const IndicatorAdxIcon = Wrapper(IndicatorAdx);
export const IndicatorCommodityChannelIndexIcon = Wrapper(IndicatorCommodityChannelIndex);
export const IndicatorIchimokuIcon = Wrapper(IndicatorIchimoku);
export const IndicatorParabolicIcon = Wrapper(IndicatorParabolic);
export const IndicatorZigZagIcon = Wrapper(IndicatorZigZag);
export const IndicatorBollingerIcon = Wrapper(IndicatorBollinger);
export const IndicatorDonchianIcon = Wrapper(IndicatorDonchian);
export const IndicatorAveragesIcon = Wrapper(IndicatorAverages);
export const IndicatorEnvelopeIcon = Wrapper(IndicatorEnvelope);
export const IndicatorAlligatorIcon = Wrapper(IndicatorAlligator);
export const IndicatorFractalChaosIcon = Wrapper(IndicatorFractalChaos);
export const IndicatorRainbowIcon = Wrapper(IndicatorRainbow);

export const MetalIcon = Wrapper(Metal);
export const EmptyStateIcon = Wrapper(EmptyState);
export const OverwriteStateIcon = Wrapper(OverwriteState);

export const ArrowGreenIcon = Wrapper(ArrowGreen);
export const ArrowOrangeIcon = Wrapper(ArrowOrange);

export const DrawToolsChannelIcon = Wrapper(DrawToolsChannel);
export const DrawToolsContinuousIcon = Wrapper(DrawToolsContinuous);
export const DrawToolsFibonaccifanIcon = Wrapper(DrawToolsFibonaccifan);

export const DrawToolsHorizontalIcon = Wrapper(DrawToolsHorizontal);
export const DrawToolsLineIcon = Wrapper(DrawToolsLine);
export const DrawToolsRayIcon = Wrapper(DrawToolsRay);
export const DrawToolsRectangleIcon = Wrapper(DrawToolsRectangle);
export const DrawToolsTrendIcon = Wrapper(DrawToolsTrend);
export const DrawToolsVerticalIcon = Wrapper(DrawToolsVertical);

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
    favorite: Wrapper(Star),
    forex: Wrapper(Forex),
    indices: Wrapper(Indices),
    stocks: Wrapper(Stocks),
    volidx: Wrapper(Volidx),
    synthetic_index: Wrapper(SynthIndex),
    indicators: Wrapper(Indicator),
};

export const SettingCountdownMap = {
    light: {
        normal: Wrapper(SettingCountdownLightNormal),
        active: Wrapper(SettingCountdownLightActive),
    },
    dark: {
        normal: Wrapper(SettingCountdownDarkNormal),
        active: Wrapper(SettingCountdownDarkActive),
    },
};

export const SettingHistoricalMap = {
    light: {
        normal: Wrapper(SettingHistoricalLightNormal),
        active: Wrapper(SettingHistoricalLightActive),
    },
    dark: {
        normal: Wrapper(SettingHistoricalDarkNormal),
        active: Wrapper(SettingHistoricalDarkActive),
    },
};

export const SettingHighestLowestMap = {
    light: {
        normal: Wrapper(SettingHighestLowestLightNormal),
        active: Wrapper(SettingHighestLowestLightActive),
    },
    dark: {
        normal: Wrapper(SettingHighestLowestDarkNormal),
        active: Wrapper(SettingHighestLowestDarkActive),
    },
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
    HongKong: Wrapper(HongKong),
    Dutch: Wrapper(Dutch),
    German: Wrapper(German),
    French: Wrapper(French),
    Spanish: Wrapper(Spanish),
    WallStreet: Wrapper(WallStreet),
};

export const FlagIcons = {
    USD: Wrapper(USD),
    GBP: Wrapper(GBP),
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
    Spanish: Wrapper(Spanish),
};

export const ItemIconMap = {
    SPC: FlagIconMap.USD,
    AS51: FlagIconMap.AUD,
    HSI: FlagIconMap.HongKong,
    N225: FlagIconMap.JPY,
    AEX: FlagIconMap.Dutch,
    FCHI: FlagIconMap.French,
    SSMI: FlagIconMap.CHF,
    GDAXI: FlagIconMap.German,
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
    '1HZ10V': Wrapper(Vol1S10),
    '1HZ25V': Wrapper(Vol1S25),
    '1HZ50V': Wrapper(Vol1S50),
    '1HZ75V': Wrapper(Vol1S75),
    '1HZ100V': Wrapper(Vol1S100),
    BOOM500: Wrapper(Boom500),
    BOOM1000: Wrapper(Boom1000),
    CRASH500: Wrapper(Crash500),
    CRASH1000: Wrapper(Crash1000),
    RDBEAR: Wrapper(MarketBear),
    RDBULL: Wrapper(MarketBull),
    stpRNG: Wrapper(Step),
};

function createCompositeIcon(A: any, B: any, icId: any) {
    return (props: any) => {
        const { className, ...p } = props;
        return (
            <span className={`${icId} ${className}`} {...p}>
                <A />
                <B />
            </span>
        );
    };
}

function frx(flagA: any, flagB: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const A = FlagIconMap[flagA];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const B = FlagIconMap[flagB];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ItemIconMap[`frx${flagA}${flagB}`] = createCompositeIcon(A, B, 'ic-frx');
}

export const OTCBadgeIcon = Wrapper(OTCBadge);
const SmartFXIcon = Wrapper(SmartFX);

function otc(flag: any, symbol: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const FlagIcon = FlagIconMap[flag];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    ItemIconMap[symbol] = FlagIcon;
}

function wld(flag: any) {
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    const FlagIcon = FlagIconMap[flag];
    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
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
