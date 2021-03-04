// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import {
    DrawToolsChannelIcon,
    DrawToolsContinuousIcon,
    DrawToolsFibonaccifanIcon,
    DrawToolsHorizontalIcon,
    DrawToolsLineIcon,
    DrawToolsRayIcon,
    DrawToolsRectangleIcon,
    DrawToolsTrendIcon,
    DrawToolsVerticalIcon,
    IndicatorCatMomentumIcon,
    IndicatorCatTrendLightIcon,
    IndicatorCatVolatilityIcon,
    IndicatorCatAveragesIcon,
    IndicatorCatOtherIcon,
    IndicatorAwesomeOscillatorIcon,
    IndicatorDTrendedIcon,
    IndicatorGatorIcon,
    IndicatorMacdIcon,
    IndicatorRateChangeIcon,
    IndicatorRSIIcon,
    IndicatorStochasticOscillatorIcon,
    IndicatorStochasticMomentumIcon,
    IndicatorWilliamPercentIcon,
    IndicatorAroonIcon,
    IndicatorAdxIcon,
    IndicatorCommodityChannelIndexIcon,
    IndicatorIchimokuIcon,
    IndicatorParabolicIcon,
    IndicatorZigZagIcon,
    IndicatorBollingerIcon,
    IndicatorDonchianIcon,
    IndicatorAveragesIcon,
    IndicatorEnvelopeIcon,
    IndicatorAlligatorIcon,
    IndicatorFractalChaosIcon,
    IndicatorRainbowIcon,
    // Chart Types
    TypeAreaIcon,
    TypeCandleIcon,
    TypeHollowIcon,
    TypeOhlcIcon,
    FlagIcons,
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/Icons.jsx' was resolved to '/... Remove this comment to see the full error message
} from './components/Icons.jsx';

export const drawTools = {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    channel: { id: 'channel', text: t.translate('Channel [num]'), icon: DrawToolsChannelIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    segment: { id: 'continuous', text: t.translate('Continuous [num]'), icon: DrawToolsContinuousIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    fibfan: { id: 'fibfan', text: t.translate('Fib Fan [num]'), icon: DrawToolsFibonaccifanIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    horizontal: { id: 'horizontal', text: t.translate('Horizontal [num]'), icon: DrawToolsHorizontalIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    line: { id: 'line', text: t.translate('Line [num]'), icon: DrawToolsLineIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    ray: { id: 'ray', text: t.translate('Ray [num]'), icon: DrawToolsRayIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    rectangle: { id: 'rectangle', text: t.translate('Rectangle [num]'), icon: DrawToolsRectangleIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    tirone: { id: 'tirone', text: t.translate('Trend [num]'), icon: DrawToolsTrendIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    vertical: { id: 'vertical', text: t.translate('Vertical [num]'), icon: DrawToolsVerticalIcon },
};

export const getIndicatorsTree = () => [
    {
        id: 'momentum',
        name: 'Momentum',
        icon: IndicatorCatMomentumIcon,
        items: [
            {
                id: 'Awesome',
                name: 'Awesome Oscillator',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    "The Awesome Oscillator is an indicator used to measure market momentum. AO calculates the difference of a 34 Period and 5 Period Simple Moving Averages. The Simple Moving Averages that are used are not calculated using closing price but rather each bar's midpoints. AO is generally used to affirm trends or to anticipate possible reversals."
                ),
                icon: IndicatorAwesomeOscillatorIcon,
            },
            {
                id: 'Detrended',
                name: 'Detrended Price Oscillator',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Detrended Price Oscillator (DPO) helps to identify price cycles without the influence of short- and long-term trends. The DPO compares a simple moving average to a historical pricenear the middle of a specified period. It also shows the peaks and drops over that particular period, making it easier to predict buy points.'
                ),
                icon: IndicatorDTrendedIcon,
            },
            {
                id: 'Gator',
                name: 'Gator Oscillator',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Gator Oscillator helps to detect trend changes in the market price. Based on the Alligator indicator, the Gator plots 2 histograms on either side of the zero line. The sleeping phase (absence of a trend) is when the bars on both sides are red. The awakening phase (formation of a trend) is when there are red and green bars on both sides. When there are green bars on both sides, it indicates the eating phase (trend strengthening). A solitary red bar appearing after the eating phase indicates the beginning of the sated phase (trend approaching its end).'
                ),
                icon: IndicatorGatorIcon,
            },
            {
                id: 'macd',
                name: 'MACD',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    "MACD is a trading indicator used in technical analysis of stock prices. It is supposed to reveal changes in the strength, direction, momentum, and duration of a trend in a stock's price."
                ),
                icon: IndicatorMacdIcon,
            },
            {
                id: 'Price ROC',
                name: 'Price Rate of Change',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Price Rate-of-Change (ROC) indicator displays the difference between the current price and the price x-time periods ago. The difference can be displayed in either points or as a percentage.'
                ),
                icon: IndicatorRateChangeIcon,
            },
            {
                id: 'rsi',
                name: 'Relative Strength Index (RSI)',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Relative Strength Index (RSI) was published by J. Welles Wilder. The current price is normalized as a percentage between 0 and 100. The name of this oscillator is misleading because it does not compare the instrument relative to another instrument or set of instruments, but rather represents the current price relative to other recent pieces within the selected lookback window length.'
                ),
                icon: IndicatorRSIIcon,
            },
            {
                id: 'stochastics',
                name: 'Stochastic Oscillator',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    "A technical momentum indicator that compares a security's closing price to its price range over a given time period. The oscillator's sensitivity to market movements can be reduced by adjusting the time period or by taking a moving average of the result."
                ),
                icon: IndicatorStochasticOscillatorIcon,
            },
            {
                id: 'Stch Mtm',
                name: 'Stochastic Momentum Index',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Stochastic Momentum Index (SMI) helps to identify overbought or oversold conditions in the market and to predict bearish or bullish trends. It calculates the distance between the current closing price and the median of the high/low range, and displays 2 lines on the chart: the first (known as %K) represents the price movement while the second (known as %D) is a moving average of the first line. If the closing price is higher than the median of the high/low range, the SMI returns a positive value. If the closing price is lower than the average price, a negative value is returned. Values above 40 indicate a bullish trend while values below -40 indicate a bearish trend.'
                ),
                icon: IndicatorStochasticMomentumIcon,
            },
            {
                id: 'Williams %R',
                name: "William's Percent Range",
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'Developed by Larry Williams, Williams %R is a momentum indicator that is the inverse of the Fast Stochastic Oscillator. Also referred to as %R, Williams %R reflects the level of the close relative to the highest high for the look-back period.'
                ),
                icon: IndicatorWilliamPercentIcon,
            },
        ],
    },
    {
        id: 'trend',
        name: 'Trend',
        icon: IndicatorCatTrendLightIcon,
        items: [
            {
                id: 'Aroon',
                name: 'Aroon',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'Developed by Tushar Chande in 1995, Aroon is an indicator system that determines whether a stock is trending or not and how strong the trend is. There are two separate indicators: Aroon-Up and Aroon-Down. A 25-day Aroon-Up measures the number of days since a 25-day high. A 25-day Aroon-Down measures the number of days since a 25-day low.'
                ),
                icon: IndicatorAroonIcon,
            },
            {
                id: 'ADX',
                name: 'ADX/DMS',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Average Directional Movement Index index (ADX) was developed in 1978 by J. Welles Wilder as an indicator of trend strength in a series of prices of a financial instrument ADX will range between 0 and 100. Generally, ADX readings below 20 indicate trend weakness, and readings above 40 indicate trend strength.'
                ),
                icon: IndicatorAdxIcon,
            },
            {
                id: 'CCI',
                name: 'Commodity Channel Index',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Commodity Channel Index (CCI) is a versatile indicator that can be used to identify a new trend or warn of extreme conditions.'
                ),
                icon: IndicatorCommodityChannelIndexIcon,
            },
            {
                id: 'Ichimoku Clouds',
                name: 'Ichimoku Clouds',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Ichimoku Cloud, also known as Ichimoku Kinko Hyo, is a versatile indicator that defines support and resistance, identifies trend direction, gauges momentum and provides trading signals. Ichimoku Kinko Hyo translates into “one look equilibrium chart”.'
                ),
                icon: IndicatorIchimokuIcon,
            },
            {
                id: 'PSAR',
                name: 'Parabolic SAR',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The parabolic SAR is calculated almost independently for each trend in the price. When the price is in an uptrend, the SAR emerges below the price and converges upwards towards it. Similarly, on a downtrend, the SAR emerges above the price and converges downwards. At each step within a trend, the SAR is calculated one period in advance.'
                ),
                icon: IndicatorParabolicIcon,
            },
            {
                id: 'ZigZag',
                name: 'Zig Zag',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'Zig Zag helps to identify trend reversals and filters out relatively small price movements by determining the support and resistance levels of the market. It accepts a percentage of deviation as the input and displays a line if the price change is larger than the percentage of deviation. Zig Zag ignores any sideways movement and is useful to filter out “market noise”.'
                ),
                icon: IndicatorZigZagIcon,
            },
        ],
    },
    {
        id: 'volatility',
        name: 'Volatility',
        icon: IndicatorCatVolatilityIcon,
        items: [
            {
                id: 'Bollinger Bands',
                name: 'Bollinger Bands',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'Bollinger Bands can be used to measure the highness or lowness of the price relative to previous trades.'
                ),
                icon: IndicatorBollingerIcon,
            },
            {
                id: 'Donchian Channel',
                name: 'Donchian Channel',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Donchian Channel is an indicator used in market trading developed by Richard Donchian. It is formed by taking the highest high and the lowest low of the last n periods. The area between the high and the low is the channel for the period chosen.'
                ),
                icon: IndicatorDonchianIcon,
            },
        ],
    },
    {
        id: 'moving-averages',
        name: 'Moving averages',
        icon: IndicatorCatAveragesIcon,
        items: [
            {
                id: 'ma',
                name: 'Moving Average (MA)',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Moving Average (MA) helps to identify the overall market trend by filtering out short-term price fluctuations. Using historical data, it calculates the average price over a specific period and plots a line on the chart. If the MA line moves upwards, it’s an indicator of an uptrend, a downtrend if it moves downwards. A buy signal occurs when the price moves above the MA line.'
                ),
                icon: IndicatorAveragesIcon,
            },
            {
                id: 'MA Env',
                name: 'Moving Average Envelope',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Moving Average Envelope (MAE) helps to identify strong price movement that indicates the start of a trend. The MAE creates a moving average line as well as 2 bands around it. In theory, when the market price touches the upper or lower bands, a trend reversal will occur, indicating a buy signal.'
                ),
                icon: IndicatorEnvelopeIcon,
            },
            {
                id: 'Rainbow MA',
                name: 'Rainbow Moving Average',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'The Rainbow Moving Average (RMA) displays several moving average lines simultaneously. When the lines intersect, it’s an indicator of price reversal and the angle of the lines are helpful to predict the trend strength. The steeper the curve, the stronger the trend. When the price crosses the moving average lines from below, it signals an upward trend. When the price crosses the moving average lines from above, it signals a downward trend. The RMA is easier to use compared to using several different moving average indicators at once.'
                ),
                icon: IndicatorRainbowIcon,
            },
        ],
    },
    {
        id: 'others',
        name: 'Others',
        icon: IndicatorCatOtherIcon,
        items: [
            {
                id: 'Alligator',
                name: 'Alligator',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'Bill Williams introduced the Alligator indicator in 1995. The Alligator is as much a metaphor as it is an indicator. It consists of three lines, overlaid on a pricing chart, that represent the jaw, the teeth and the lips of the beast, and was created to help the trader confirm the presence of a trend and its direction. The Alligator indicator can also help traders designate impulse and corrective wave formations, but the tool works best when combined with a momentum indicator.'
                ),
                icon: IndicatorAlligatorIcon,
            },
            {
                id: 'Fractal Chaos Bands',
                name: 'Fractal Chaos Band',
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                description: t.translate(
                    'Fractals are indicators on candlestick charts that identify reversal points in the market. Traders often use fractals to get an idea about the direction in which the price will develop. A fractal will form when a particular price pattern happens on a chart.'
                ),
                icon: IndicatorFractalChaosIcon,
            },
        ],
    },
];

export const ExcludedStudies = {
    Beta: true,
    // volume is not supported in chart
    Klinger: true,
    'Trade Vol': true,
    'Vol ROC': true,
    'Price Vol': true,
    'Pos Vol': true,
    'Neg Vol': true,
    'On Bal Vol': true,
    'Vol Osc': true,
    volume: true,
    'vol undr': true,
    'vol profile': true,
    'W MFI': true,
    EOM: true,
    'Chaikin MF': true,
    Twiggs: true,
    // end volume
    'Aroon Osc': true,
    'Lin R2': true,
    'Lin Fcst': true,
    'Lin Incpt': true,
    'Time Fcst': true,
    'VT Filter': true,
    TRIX: true,
    'STD Dev': true,
    Swing: true,
    'Acc Swing': true,
    'Price ROC': false,
    Momentum: true,
    'Hist Vol': true,
    'Pretty Good': true,
    Ultimate: true,
    'Chaikin Vol': true,
    'Price Osc': true,
    'True Range': true,
    ATR: true,
    'Ehler Fisher': true,
    Schaff: true,
    QStick: true,
    Coppock: true,
    'Chande Mtm': true,
    'Chande Fcst': true,
    'Intraday Mtm': true,
    RAVI: true,
    'Random Walk': true,
    'High Low': true,
    'High-Low': true,
    'Med Price': true,
    'Fractal Chaos': true,
    GAPO: true,
    'Prime Number Bands': true,
    'Prime Number': true,
    HHV: true,
    LLV: true,
    'Mass Idx': true,
    Keltner: true,
    'Elder Ray': true,
    'Elder Force': true,
    'LR Slope': true,
    COG: true,
    'Typical Price': true,
    'Weighted Close': true,
    'M Flow': true,
    'W Acc Dist': true,
    'val lines': true,
    correl: true,
    PMO: true,
    'Rel Vol': true,
    'ATR Bands': true,
    'STARC Bands': true,
    'ATR Trailing Stop': true,
    'Boll BW': true,
    'Boll %b': true,
    'Rel Vig': true,
    'Elder Impulse': true,
    'Pivot Points': true,
    VWAP: true,
    AVWAP: true,
    'P Rel': true,
    'Perf Idx': true,
    Ulcer: true,
    'Bal Pwr': true,
    'Trend Int': true,
    Choppiness: true,
    Disparity: true,
    'Rainbow Osc': true,
    'Pring KST': true,
    'Pring Sp-K': true,
    Darvas: true,
    Supertrend: true,
    Vortex: true,
    PSY: true,
    'MA Dev': true,
    Shinohara: true,
    'VT HZ Filter': true,
};

export const ChartTypes = [
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    { id: 'mountain', text: t.translate('Area'), candleOnly: false, icon: TypeAreaIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    { id: 'candle', text: t.translate('Candle'), candleOnly: true, icon: TypeCandleIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    { id: 'hollow_candle', text: t.translate('Hollow'), candleOnly: true, icon: TypeHollowIcon },
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
    { id: 'colored_bar', text: t.translate('OHLC'), candleOnly: true, icon: TypeOhlcIcon },
];

export const Intervals = [
    {
        key: 'tick',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        single: t.translate('tick'),
        items: [
            {
                interval: 0,
                num: 1,
            },
        ],
    },
    {
        key: 'minute',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        single: t.translate('minute'),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        plural: t.translate('minutes'),
        items: [
            { interval: 60, num: 1 },
            { interval: 120, num: 2 },
            { interval: 180, num: 3 },
            { interval: 300, num: 5 },
            { interval: 600, num: 10 },
            { interval: 900, num: 15 },
            { interval: 1800, num: 30 },
        ],
    },
    {
        key: 'hour',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        single: t.translate('hour'),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        plural: t.translate('hours'),
        items: [
            { interval: 3600, num: 1 },
            { interval: 7200, num: 2 },
            { interval: 14400, num: 4 },
            { interval: 28800, num: 8 },
        ],
    },
    {
        key: 'day',
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        single: t.translate('day'),
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        plural: t.translate('days'),
        items: [{ interval: 86400, num: 1 }],
    },
];

export const Languages = [
    {
        key: 'en',
        name: 'English',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.GBP />,
    },
    {
        key: 'pt',
        name: 'Português',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Portugal />,
    },
    {
        key: 'fr',
        name: 'French',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.French />,
    },
    {
        key: 'ru',
        name: 'Русский',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Russia />,
    },
    {
        key: 'th',
        name: 'Thai',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Thailand />,
    },
    {
        key: 'id',
        name: 'Indonesia',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Indonesia />,
    },
    {
        key: 'vi',
        name: 'Tiếng Việt',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Vietnam />,
    },
    {
        key: 'it',
        name: 'Italiano',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Italy />,
    },
    {
        key: 'zh_cn',
        name: '简体中文',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Chinese />,
    },
    {
        key: 'pl',
        name: 'Polish',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Poland />,
    },
    {
        key: 'zh_tw',
        name: '繁體中文',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.ChineseTraditional />,
    },
    {
        key: 'es',
        name: 'espanyol',
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        icon: <FlagIcons.Spanish />,
    },
];

export const STATE = {
    INITIAL: 'INITIAL',
    READY: 'READY',
    SCROLL_TO_LEFT: 'SCROLL_TO_LEFT',
    MARKET_STATE_CHANGE: 'MARKET_STATE_CHANGE',
};
