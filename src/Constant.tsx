import _ from 'lodash';
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
    FlagIcons,
    IndicatorAdxIcon,
    IndicatorAlligatorIcon,
    IndicatorAroonIcon,
    IndicatorAveragesIcon,
    IndicatorAwesomeOscillatorIcon,
    IndicatorBollingerIcon,
    IndicatorCatAveragesIcon,
    IndicatorCatMomentumIcon,
    IndicatorCatOtherIcon,
    IndicatorCatTrendLightIcon,
    IndicatorCatVolatilityIcon,
    IndicatorCommodityChannelIndexIcon,
    IndicatorDonchianIcon,
    IndicatorDTrendedIcon,
    IndicatorEnvelopeIcon,
    IndicatorFractalChaosIcon,
    IndicatorGatorIcon,
    IndicatorIchimokuIcon,
    IndicatorMacdIcon,
    IndicatorParabolicIcon,
    IndicatorRainbowIcon,
    IndicatorRateChangeIcon,
    IndicatorRSIIcon,
    IndicatorStochasticMomentumIcon,
    IndicatorStochasticOscillatorIcon,
    IndicatorWilliamPercentIcon,
    IndicatorZigZagIcon,
    // Chart Types
    TypeAreaIcon,
    TypeCandleIcon,
    TypeHollowIcon,
    TypeOhlcIcon,
} from './components/Icons';
import { TGranularity, TIcon, TDefaultIndicatorConfigs, TIndicatorsTree, TDefaultIndicatorConfig } from './types';

type TDrawTools = {
    [key: string]: {
        id: string;
        text: string;
        icon: TIcon;
    };
};

export const drawTools: TDrawTools = {
    channel: { id: 'channel', text: t.translate('Channel [num]'), icon: DrawToolsChannelIcon },
    segment: { id: 'continuous', text: t.translate('Continuous [num]'), icon: DrawToolsContinuousIcon },
    fibfan: { id: 'fibfan', text: t.translate('Fib Fan [num]'), icon: DrawToolsFibonaccifanIcon },
    horizontal: { id: 'horizontal', text: t.translate('Horizontal [num]'), icon: DrawToolsHorizontalIcon },
    line: { id: 'line', text: t.translate('Line [num]'), icon: DrawToolsLineIcon },
    ray: { id: 'ray', text: t.translate('Ray [num]'), icon: DrawToolsRayIcon },
    rectangle: { id: 'rectangle', text: t.translate('Rectangle [num]'), icon: DrawToolsRectangleIcon },
    tirone: { id: 'tirone', text: t.translate('Trend [num]'), icon: DrawToolsTrendIcon },
    vertical: { id: 'vertical', text: t.translate('Vertical [num]'), icon: DrawToolsVerticalIcon },
};

export const getIndicatorsTree = (): TIndicatorsTree[] => [
    {
        category: 'momentum',
        name: t.translate('Momentum'),
        icon: IndicatorCatMomentumIcon,
        items: [
            {
                name: 'AwesomeOscillator',
                title: 'Awesome Oscillator',
                description: t.translate(
                    "The Awesome Oscillator is an indicator used to measure market momentum. AO calculates the difference of a 34 Period and 5 Period Simple Moving Averages. The Simple Moving Averages that are used are not calculated using closing price but rather each bar's midpoints. AO is generally used to affirm trends or to anticipate possible reversals."
                ),
                icon: IndicatorAwesomeOscillatorIcon,
                isPrediction: true,
            },
            {
                name: 'dpo',
                title: 'Detrended Price Oscillator',
                description: t.translate(
                    'The Detrended Price Oscillator (DPO) helps to identify price cycles without the influence of short- and long-term trends. The DPO compares a simple moving average to a historical pricenear the middle of a specified period. It also shows the peaks and drops over that particular period, making it easier to predict buy points.'
                ),
                icon: IndicatorDTrendedIcon,
            },
            {
                name: 'gator',
                title: 'Gator Oscillator',
                description: t.translate(
                    'The Gator Oscillator helps to detect trend changes in the market price. Based on the Alligator indicator, the Gator plots 2 histograms on either side of the zero line. The sleeping phase (absence of a trend) is when the bars on both sides are red. The awakening phase (formation of a trend) is when there are red and green bars on both sides. When there are green bars on both sides, it indicates the eating phase (trend strengthening). A solitary red bar appearing after the eating phase indicates the beginning of the sated phase (trend approaching its end).'
                ),
                icon: IndicatorGatorIcon,
                isPrediction: true,
            },
            {
                name: 'macd',
                title: 'MACD',
                description: t.translate(
                    "MACD is a trading indicator used in technical analysis of stock prices. It is supposed to reveal changes in the strength, direction, momentum, and duration of a trend in a stock's price."
                ),
                icon: IndicatorMacdIcon,
            },
            {
                name: 'ROC',
                title: 'Price Rate of Change',
                description: t.translate(
                    'The Price Rate-of-Change (ROC) indicator displays the difference between the current price and the price x-time periods ago. The difference can be displayed in either points or as a percentage.'
                ),
                icon: IndicatorRateChangeIcon,
            },
            {
                name: 'RSI',
                title: 'Relative Strength Index (RSI)',
                description: t.translate(
                    'The Relative Strength Index (RSI) was published by J. Welles Wilder. The current price is normalized as a percentage between 0 and 100. The name of this oscillator is misleading because it does not compare the instrument relative to another instrument or set of instruments, but rather represents the current price relative to other recent pieces within the selected lookback window length.'
                ),
                icon: IndicatorRSIIcon,
            },
            {
                name: 'StochasticOscillator',
                title: 'Stochastic Oscillator',
                description: t.translate(
                    "A technical momentum indicator that compares a security's closing price to its price range over a given time period. The oscillator's sensitivity to market movements can be reduced by adjusting the time period or by taking a moving average of the result."
                ),
                icon: IndicatorStochasticOscillatorIcon,
                isPrediction: true,
            },
            {
                name: 'SMI',
                title: 'Stochastic Momentum Index',
                description: t.translate(
                    'The Stochastic Momentum Index (SMI) helps to identify overbought or oversold conditions in the market and to predict bearish or bullish trends. It calculates the distance between the current closing price and the median of the high/low range, and displays 2 lines on the chart: the first (known as %K) represents the price movement while the second (known as %D) is a moving average of the first line. If the closing price is higher than the median of the high/low range, the SMI returns a positive value. If the closing price is lower than the average price, a negative value is returned. Values above 40 indicate a bullish trend while values below -40 indicate a bearish trend.'
                ),
                icon: IndicatorStochasticMomentumIcon,
            },
            {
                name: 'WilliamsR',
                title: "William's Percent Range",
                description: t.translate(
                    'Developed by Larry Williams, Williams %R is a momentum indicator that is the inverse of the Fast Stochastic Oscillator. Also referred to as %R, Williams %R reflects the level of the close relative to the highest high for the look-back period.'
                ),
                icon: IndicatorWilliamPercentIcon,
                isPrediction: true,
            },
        ],
    },
    {
        category: 'trend',
        name: t.translate('Trend'),
        icon: IndicatorCatTrendLightIcon,
        items: [
            {
                name: 'Aroon',
                title: 'Aroon',
                description: t.translate(
                    'Developed by Tushar Chande in 1995, Aroon is an indicator system that determines whether a stock is trending or not and how strong the trend is. There are two separate indicators: Aroon-Up and Aroon-Down. A 25-day Aroon-Up measures the number of days since a 25-day high. A 25-day Aroon-Down measures the number of days since a 25-day low.'
                ),
                icon: IndicatorAroonIcon,
            },
            {
                name: 'adx',
                title: 'ADX/DMS',
                description: t.translate(
                    'The Average Directional Movement Index index (ADX) was developed in 1978 by J. Welles Wilder as an indicator of trend strength in a series of prices of a financial instrument ADX will range between 0 and 100. Generally, ADX readings below 20 indicate trend weakness, and readings above 40 indicate trend strength.'
                ),
                icon: IndicatorAdxIcon,
                isPrediction: true,
            },
            {
                name: 'commodity_channel_index',
                title: 'Commodity Channel Index',
                description: t.translate(
                    'The Commodity Channel Index (CCI) is a versatile indicator that can be used to identify a new trend or warn of extreme conditions.'
                ),
                icon: IndicatorCommodityChannelIndexIcon,
                isPrediction: true,
            },
            {
                name: 'ichimoku',
                title: 'Ichimoku Clouds',
                description: t.translate(
                    'The Ichimoku Cloud, also known as Ichimoku Kinko Hyo, is a versatile indicator that defines support and resistance, identifies trend direction, gauges momentum and provides trading signals. Ichimoku Kinko Hyo translates into “one look equilibrium chart”.'
                ),
                icon: IndicatorIchimokuIcon,
                isPrediction: true,
            },
            {
                name: 'ParabolicSAR',
                title: 'Parabolic SAR',
                description: t.translate(
                    'The parabolic SAR is calculated almost independently for each trend in the price. When the price is in an uptrend, the SAR emerges below the price and converges upwards towards it. Similarly, on a downtrend, the SAR emerges above the price and converges downwards. At each step within a trend, the SAR is calculated one period in advance.'
                ),
                icon: IndicatorParabolicIcon,
                isPrediction: true,
            },
            {
                name: 'zigzag',
                title: 'Zig Zag',
                description: t.translate(
                    'Zig Zag helps to identify trend reversals and filters out relatively small price movements by determining the support and resistance levels of the market. It accepts a percentage of deviation as the input and displays a line if the price change is larger than the percentage of deviation. Zig Zag ignores any sideways movement and is useful to filter out “market noise”.'
                ),
                icon: IndicatorZigZagIcon,
                isPrediction: true,
            },
        ],
    },
    {
        category: 'volatility',
        name: t.translate('Volatility'),
        icon: IndicatorCatVolatilityIcon,
        items: [
            {
                name: 'bollinger_bands',
                title: 'Bollinger Bands',
                description: t.translate(
                    'Bollinger Bands can be used to measure the highness or lowness of the price relative to previous trades.'
                ),
                icon: IndicatorBollingerIcon,
            },
            {
                name: 'donchian_channel',
                title: 'Donchian Channel',
                description: t.translate(
                    'The Donchian Channel is an indicator used in market trading developed by Richard Donchian. It is formed by taking the highest high and the lowest low of the last n periods. The area between the high and the low is the channel for the period chosen.'
                ),
                icon: IndicatorDonchianIcon,
                isPrediction: true,
            },
        ],
    },
    {
        category: 'moving-averages',
        name: t.translate('Moving averages'),
        icon: IndicatorCatAveragesIcon,
        items: [
            {
                name: 'moving_average',
                title: 'Moving Average (MA)',
                description: t.translate(
                    'The Moving Average (MA) helps to identify the overall market trend by filtering out short-term price fluctuations. Using historical data, it calculates the average price over a specific period and plots a line on the chart. If the MA line moves upwards, it’s an indicator of an uptrend, a downtrend if it moves downwards. A buy signal occurs when the price moves above the MA line.'
                ),
                icon: IndicatorAveragesIcon,
            },
            {
                name: 'moving_envelope_average',
                title: 'Moving Average Envelope',
                description: t.translate(
                    'The Moving Average Envelope (MAE) helps to identify strong price movement that indicates the start of a trend. The MAE creates a moving average line as well as 2 bands around it. In theory, when the market price touches the upper or lower bands, a trend reversal will occur, indicating a buy signal.'
                ),
                icon: IndicatorEnvelopeIcon,
                isPrediction: true,
            },
            {
                name: 'rainbow',
                title: 'Rainbow Moving Average',
                description: t.translate(
                    'The Rainbow Moving Average (RMA) displays several moving average lines simultaneously. When the lines intersect, it’s an indicator of price reversal and the angle of the lines are helpful to predict the trend strength. The steeper the curve, the stronger the trend. When the price crosses the moving average lines from below, it signals an upward trend. When the price crosses the moving average lines from above, it signals a downward trend. The RMA is easier to use compared to using several different moving average indicators at once.'
                ),
                icon: IndicatorRainbowIcon,
                isPrediction: true,
            },
        ],
    },
    {
        category: 'others',
        name: t.translate('Others'),
        icon: IndicatorCatOtherIcon,
        items: [
            {
                name: 'alligator',
                title: 'Alligator',
                description: t.translate(
                    'Bill Williams introduced the Alligator indicator in 1995. The Alligator is as much a metaphor as it is an indicator. It consists of three lines, overlaid on a pricing chart, that represent the jaw, the teeth and the lips of the beast, and was created to help the trader confirm the presence of a trend and its direction. The Alligator indicator can also help traders designate impulse and corrective wave formations, but the tool works best when combined with a momentum indicator.'
                ),
                icon: IndicatorAlligatorIcon,
                isPrediction: true,
            },
            {
                name: 'fcb',
                title: 'Fractal Chaos Band',
                description: t.translate(
                    'Fractals are indicators on candlestick charts that identify reversal points in the market. Traders often use fractals to get an idea about the direction in which the price will develop. A fractal will form when a particular price pattern happens on a chart.'
                ),
                icon: IndicatorFractalChaosIcon,
                isPrediction: true,
            },
        ],
    },
];

const lineStyle = {
    thickness: 1,
    hasArea: false,
};

const fieldTypeOptions = {
    open: t.translate('Open'),
    high: t.translate('High'),
    low: t.translate('Low'),
    close: t.translate('Close'),
    'Hl/2': t.translate('Hl/2'),
    'Hlc/3': t.translate('Hlc/3'),
    'Hlcc/4': t.translate('Hlcc/4'),
    'Ohlc/4': t.translate('Ohlc/4'),
};

const movingAverageTypeOptions = {
    simple: t.translate('Simple'),
    exponential: t.translate('Exponential'),
    weighted: t.translate('Weighted'),
    hull: t.translate('Hull'),
    zeroLag: t.translate('Zero Lag'),
    timeSeries: t.translate('Time Series'),
    wellesWilder: t.translate('Welles Wilder'),
    variable: t.translate('Variable'),
    triangular: t.translate('Triangular'),
    doubleExponential: t.translate('2-Exponential'),
    tripleExponential: t.translate('3-Exponential'),
};

const RSIIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        lineStyle: _.clone(lineStyle),
        oscillatorLinesConfig: {
            overboughtStyle: _.clone(lineStyle),
            oversoldStyle: _.clone(lineStyle),
        },
        pinLabels: false,
    },
    parameters: [
        {
            path: 'lineStyle.color',
            title: t.translate('Color'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
        {
            paths: {
                value: 'oscillatorLinesConfig.overboughtValue',
                color: 'oscillatorLinesConfig.overboughtStyle.color',
            },
            title: t.translate('OverBought'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: 80,
                color: '#000000',
            },
        },
        {
            paths: {
                value: 'oscillatorLinesConfig.oversoldValue',
                color: 'oscillatorLinesConfig.oversoldStyle.color',
            },
            title: t.translate('OverSold'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: 20,
                color: '#000000',
            },
        },
        {
            path: 'showZones',
            title: t.translate('Show Zones'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

const ADXIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'smoothingPeriod',
            title: t.translate('Smoothing Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'showSeries',
            title: t.translate('Series'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
        {
            path: 'showChannelFill',
            title: t.translate('Shading'),
            type: 'switch',
            category: 'parameters',
            defaultValue: false,
        },
        {
            path: 'showHistogram',
            title: t.translate('Histogram'),
            type: 'switch',
            category: 'parameters',
            defaultValue: false,
        },
    ],
};

const AwesomeOscillatorIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'barStyle.positiveColor',
            title: t.translate('Increasing Bar'),
            defaultValue: '#00DD00',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'barStyle.negativeColor',
            title: t.translate('Decreasing Bar'),
            defaultValue: '#FF0000',
            category: 'inputs',
            type: 'colorpicker',
        },
    ],
};

const DPOIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        isCentered: true,
    },
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
        {
            path: 'movingAverageType',
            title: t.translate('Moving Average Type'),
            defaultValue: 'simple',
            category: 'inputs',
            type: 'select',
            options: movingAverageTypeOptions,
        },
    ],
};

const GatorIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'jawPeriod',
            title: t.translate('Jaw Period'),
            defaultValue: 13,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'jawOffset',
            title: t.translate('Jaw Offset'),
            defaultValue: 8,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'teethPeriod',
            title: t.translate('Teeth Period'),
            defaultValue: 8,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'teethOffset',
            title: t.translate('Teeth Offset'),
            defaultValue: 5,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'lipsPeriod',
            title: t.translate('Lips Period'),
            defaultValue: 5,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'lipsOffset',
            title: t.translate('Lips Offset'),
            defaultValue: 3,
            category: 'inputs',
            type: 'number',
        },
    ],
};

const MACDIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'fastMAPeriod',
            title: t.translate('Fast MA Period'),
            defaultValue: 12,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'slowMAPeriod',
            title: t.translate('Slow MA Period'),
            defaultValue: 26,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'signalPeriod',
            title: t.translate('Signal Period'),
            defaultValue: 9,
            category: 'inputs',
            type: 'number',
        },
    ],
};

const ROCIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
    ],
};

const StochasticOscillatorIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        lineStyle: { ..._.clone(lineStyle), color: '#FFFFFF' },
        oscillatorLinesConfig: {
            overboughtStyle: _.clone(lineStyle),
            oversoldStyle: _.clone(lineStyle),
        },
        pinLabels: false,
        overBoughtPrice: 80,
        overSoldPrice: 20,
    },
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
        {
            path: 'isSmooth',
            title: t.translate('Smooth'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
        {
            paths: {
                value: 'oscillatorLinesConfig.overboughtValue',
                color: 'oscillatorLinesConfig.overboughtStyle.color',
            },
            title: t.translate('OverBought'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: 80,
                color: '#000000',
            },
        },
        {
            paths: {
                value: 'oscillatorLinesConfig.oversoldValue',
                color: 'oscillatorLinesConfig.oversoldStyle.color',
            },
            title: t.translate('OverSold'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: 20,
                color: '#000000',
            },
        },
        {
            path: 'showZones',
            title: t.translate('Show Zones'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

const SMIIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 10,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'smoothingPeriod',
            title: t.translate('Smoothing Period'),
            defaultValue: 3,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'doubleSmoothingPeriod',
            title: t.translate('Double Smoothing Period'),
            defaultValue: 3,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'signalPeriod',
            title: t.translate('Signal Period'),
            defaultValue: 10,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'maType',
            title: t.translate('Field'),
            defaultValue: 'exponential',
            category: 'inputs',
            type: 'select',
            options: movingAverageTypeOptions,
        },
        {
            paths: {
                value: 'overboughtValue',
            },
            title: t.translate('OverBought'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: 40,
                color: '#000000',
            },
        },
        {
            paths: {
                value: 'oversoldValue',
            },
            title: t.translate('OverSold'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: -40,
                color: '#000000',
            },
        },
        {
            path: 'showZones',
            title: t.translate('Show Zones'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

const WilliamsRIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        lineStyle: _.clone(lineStyle),
        zeroHorizontalLinesStyle: _.extend(_.clone(lineStyle), { color: '0xFFF44336' }),
        oscillatorLimits: {
            overboughtStyle: _.clone(lineStyle),
            oversoldStyle: _.clone(lineStyle),
        },
    },
    parameters: [
        {
            path: 'lineStyle.color',
            title: t.translate('Color'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
        {
            paths: {
                value: 'oscillatorLimits.overboughtValue',
                color: 'oscillatorLimits.overboughtStyle.color',
            },
            title: t.translate('OverBought'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: -20,
                color: '#000000',
            },
        },
        {
            paths: {
                value: 'oscillatorLimits.oversoldValue',
                color: 'oscillatorLimits.oversoldStyle.color',
            },
            title: t.translate('OverSold'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: -80,
                color: '#000000',
            },
        },
        {
            path: 'showZones',
            title: t.translate('Show Zones'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

const AroonIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 14,
            category: 'inputs',
            type: 'number',
        },
    ],
};

const CCIIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        lineStyle: _.clone(lineStyle),
        oscillatorLinesConfig: {
            overboughtStyle: _.clone(lineStyle),
            oversoldStyle: _.clone(lineStyle),
        },
    },
    parameters: [
        {
            path: 'lineStyle.color',
            title: t.translate('Color'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 20,
            category: 'inputs',
            type: 'number',
        },
        {
            paths: {
                value: 'oscillatorLinesConfig.overboughtValue',
                color: 'oscillatorLinesConfig.overboughtStyle.color',
            },
            title: t.translate('OverBought'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: 100,
                color: '#000000',
            },
        },
        {
            paths: {
                value: 'oscillatorLinesConfig.oversoldValue',
                color: 'oscillatorLinesConfig.oversoldStyle.color',
            },
            title: t.translate('OverSold'),
            type: 'numbercolorpicker',
            category: 'parameters',
            defaultValue: {
                value: -100,
                color: '#000000',
            },
        },
        {
            path: 'showZones',
            title: t.translate('Show Zones'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

const IchimokuIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'conversionLinePeriod',
            title: t.translate('Conversion Line Period'),
            defaultValue: 9,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'baseLinePeriod',
            title: t.translate('Base Line Period'),
            defaultValue: 26,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'spanBPeriod',
            title: t.translate('Leading Span B Period'),
            defaultValue: 52,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'laggingSpanOffset',
            title: t.translate('Lagging Span Period'),
            defaultValue: -26,
            category: 'inputs',
            type: 'number',
            min: -100,
            max: 0,
        },
    ],
};

const ParabolicSARIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        scatterStyle: {
            radius: 1.5,
        },
    },
    parameters: [
        {
            path: 'scatterStyle.color',
            title: t.translate('Color'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'minAccelerationFactor',
            title: t.translate('Minimum AF'),
            defaultValue: 0.02,
            category: 'inputs',
            type: 'number',
            step: 0.01,
        },
        {
            path: 'maxAccelerationFactor',
            title: t.translate('Maximum AF'),
            defaultValue: 0.2,
            category: 'inputs',
            type: 'number',
            step: 0.01,
        },
    ],
};

const ZigzagIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        lineStyle: _.clone(lineStyle),
    },
    parameters: [
        {
            path: 'lineStyle.color',
            title: t.translate('Color'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'distance',
            title: t.translate('Distance(%)'),
            defaultValue: 10,
            category: 'inputs',
            type: 'number',
        },
    ],
};

const BollingerBandsIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 50,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
        {
            path: 'standardDeviation',
            title: t.translate('Standard Deviations'),
            defaultValue: 2,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'movingAverageType',
            title: t.translate('Moving Average Type'),
            defaultValue: 'simple',
            category: 'inputs',
            type: 'select',
            options: movingAverageTypeOptions,
        },
    ],
};

const DonchianChannelIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        upperLineStyle: _.clone(lineStyle),
        middleLineStyle: _.clone(lineStyle),
        lowerLineStyle: _.clone(lineStyle),
        fillColor: '0x1affffff',
    },
    parameters: [
        {
            path: 'upperLineStyle.color',
            title: t.translate('Donchian High'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'middleLineStyle.color',
            title: t.translate('Donchian Median'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'lowerLineStyle.color',
            title: t.translate('Donchian Low'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'highPeriod',
            title: t.translate('High Period'),
            defaultValue: 20,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'lowPeriod',
            title: t.translate('Low Period'),
            defaultValue: 20,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'showChannelFill',
            title: t.translate('Channel Fill'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

const MAIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        lineStyle: _.clone(lineStyle),
        isOverlay: true,
    },
    parameters: [
        {
            path: 'lineStyle.color',
            title: t.translate('Color'),
            defaultValue: '#000000',
            category: 'inputs',
            type: 'colorpicker',
        },
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 50,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
        {
            path: 'movingAverageType',
            title: t.translate('Type'),
            defaultValue: 'simple',
            category: 'inputs',
            type: 'select',
            options: movingAverageTypeOptions,
        },
        {
            path: 'offset',
            title: t.translate('Offset'),
            defaultValue: 0,
            category: 'inputs',
            type: 'number',
        },
    ],
};

const MAEnvIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 50,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
        {
            path: 'shiftType',
            title: t.translate('Shift Type'),
            defaultValue: 'percent',
            category: 'inputs',
            type: 'select',
            options: {
                percent: t.translate('Percent'),
                point: t.translate('Point'),
            },
        },
        {
            path: 'shift',
            title: t.translate('Shift'),
            defaultValue: 5,
            category: 'inputs',
            type: 'number',
        },

        {
            path: 'movingAverageType',
            title: t.translate('Type'),
            defaultValue: 'simple',
            category: 'inputs',
            type: 'select',
            options: movingAverageTypeOptions,
        },
    ],
};

const RainbowIndicatorConfig: TDefaultIndicatorConfig = {
    config: {
        bandsCount: 10,
        movingAverageType: 'simple',
    },
    parameters: [
        {
            path: 'period',
            title: t.translate('Period'),
            defaultValue: 50,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'fieldType',
            title: t.translate('Field'),
            defaultValue: 'close',
            category: 'inputs',
            type: 'select',
            options: fieldTypeOptions,
        },
    ],
};

const AlligatorIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'showLines',
            title: t.translate('Show Lines'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
        {
            path: 'jawPeriod',
            title: t.translate('Jaw Period'),
            defaultValue: 13,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'jawOffset',
            title: t.translate('Jaw Offset'),
            defaultValue: 8,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'teethPeriod',
            title: t.translate('Teeth Period'),
            defaultValue: 8,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'teethOffset',
            title: t.translate('Teeth Offset'),
            defaultValue: 5,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'lipsPeriod',
            title: t.translate('Lips Period'),
            defaultValue: 5,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'lipsOffset',
            title: t.translate('Lips Offset'),
            defaultValue: 3,
            category: 'inputs',
            type: 'number',
        },
        {
            path: 'showFractal',
            title: t.translate('Show Fractals'),
            type: 'switch',
            category: 'parameters',
            defaultValue: false,
        },
    ],
};

const FractalChaosBandIndicatorConfig: TDefaultIndicatorConfig = {
    parameters: [
        {
            path: 'channelFill',
            title: t.translate('Channel Fill'),
            type: 'switch',
            category: 'parameters',
            defaultValue: true,
        },
    ],
};

export const DefaultIndicatorConfigs: TDefaultIndicatorConfigs = {
    RSI: RSIIndicatorConfig,
    adx: ADXIndicatorConfig,
    AwesomeOscillator: AwesomeOscillatorIndicatorConfig,
    dpo: DPOIndicatorConfig,
    gator: GatorIndicatorConfig,
    macd: MACDIndicatorConfig,
    ROC: ROCIndicatorConfig,
    StochasticOscillator: StochasticOscillatorIndicatorConfig,
    SMI: SMIIndicatorConfig,
    WilliamsR: WilliamsRIndicatorConfig,
    Aroon: AroonIndicatorConfig,
    commodity_channel_index: CCIIndicatorConfig,
    ichimoku: IchimokuIndicatorConfig,
    ParabolicSAR: ParabolicSARIndicatorConfig,
    zigzag: ZigzagIndicatorConfig,
    bollinger_bands: BollingerBandsIndicatorConfig,
    donchian_channel: DonchianChannelIndicatorConfig,
    moving_average: MAIndicatorConfig,
    moving_envelope_average: MAEnvIndicatorConfig,
    rainbow: RainbowIndicatorConfig,
    alligator: AlligatorIndicatorConfig,
    fcb: FractalChaosBandIndicatorConfig,
};

export const ChartTypes = [
    { id: 'mountain', text: t.translate('Area'), candleOnly: false, icon: TypeAreaIcon },
    { id: 'candle', text: t.translate('Candle'), candleOnly: true, icon: TypeCandleIcon },
    { id: 'hollow_candle', text: t.translate('Hollow'), candleOnly: true, icon: TypeHollowIcon },
    { id: 'colored_bar', text: t.translate('OHLC'), candleOnly: true, icon: TypeOhlcIcon },
];

type TInterval = {
    key: string;
    single: string;
    plural?: string;
    items: {
        interval: TGranularity;
        num: number;
    }[];
}[];

export const Intervals: TInterval = [
    {
        key: 'tick',
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
        single: t.translate('minute'),
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
        single: t.translate('hour'),
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
        single: t.translate('day'),
        plural: t.translate('days'),
        items: [{ interval: 86400, num: 1 }],
    },
];

export const Languages = [
    {
        key: 'en',
        name: 'English',
        icon: <FlagIcons.GBP />,
    },
    {
        key: 'pt',
        name: 'Português',
        icon: <FlagIcons.Portugal />,
    },
    {
        key: 'fr',
        name: 'French',
        icon: <FlagIcons.French />,
    },
    {
        key: 'ru',
        name: 'Русский',
        icon: <FlagIcons.Russia />,
    },
    {
        key: 'th',
        name: 'Thai',
        icon: <FlagIcons.Thailand />,
    },
    {
        key: 'id',
        name: 'Indonesia',
        icon: <FlagIcons.Indonesia />,
    },
    {
        key: 'vi',
        name: 'Tiếng Việt',
        icon: <FlagIcons.Vietnam />,
    },
    {
        key: 'it',
        name: 'Italiano',
        icon: <FlagIcons.Italy />,
    },
    {
        key: 'zh_cn',
        name: '简体中文',
        icon: <FlagIcons.Chinese />,
    },
    {
        key: 'pl',
        name: 'Polish',
        icon: <FlagIcons.Poland />,
    },
    {
        key: 'zh_tw',
        name: '繁體中文',
        icon: <FlagIcons.ChineseTraditional />,
    },
    {
        key: 'es',
        name: 'espanyol',
        icon: <FlagIcons.Spanish />,
    },
];

export const STATE = {
    INITIAL: 'INITIAL',
    READY: 'READY',
    SCROLL_TO_LEFT: 'SCROLL_TO_LEFT',
    MARKET_STATE_CHANGE: 'MARKET_STATE_CHANGE',
};

export const TooltipsContent = {
    predictionIndicator: t.translate(
        'This indicator does not support 1-tick intervals. To use this indicator, change your chart time interval to 1 minute or more.'
    ),
};
