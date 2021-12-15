import { ActiveSymbols, TicksStreamResponse, TradingTimesResponse } from '@deriv/api-types';
import { HtmlHTMLAttributes } from 'react';
import { BinaryAPI } from 'src/binaryapi';
import { ChartTypes } from 'src/Constant';
import BarrierStore from 'src/store/BarrierStore';
import { TSettings } from 'src/store/ChartSettingStore';
import { TNotification } from 'src/store/Notifier';
import { TGranularity } from '.';
import { OHLCStreamResponse } from './api.types';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type TObject = {
    [key: string]: unknown;
};

export type TBinaryAPIRequest = {
    passthrough?: {
        [k: string]: unknown;
    };
    req_id?: number;
    [k: string]: unknown;
};

export type TBinaryAPIResponse = {
    echo_req: {
        [k: string]: unknown;
    };
    req_id?: number;
    msg_type: any;
    [k: string]: unknown;
};

export type TRequestAPI = (request: TBinaryAPIRequest) => Promise<TBinaryAPIResponse>;
export type TResponseAPICallback = (response: TBinaryAPIResponse) => void;
export type TRequestSubscribe = (request: TBinaryAPIRequest, callback: TResponseAPICallback) => void;
export type TRequestForgetStream = (id: string) => void;
export type TRequestForget = (request: TBinaryAPIRequest, callback: TResponseAPICallback) => void;

export type Listener = (...args: any[]) => void;

export type TIconProps = {
    className?: string;
    ['tooltip-title']?: React.ReactElement | string;
} & HtmlHTMLAttributes<HTMLSpanElement>;

export type TBar = {
    height: number;
    cName: string;
};

export type ChartType = ArrayElement<typeof ChartTypes> & { active?: boolean; disabled?: boolean };

export type TChartParams = {
    requestAPI: BinaryAPI['requestAPI'];
    requestSubscribe: BinaryAPI['requestSubscribe'];
    requestForget: BinaryAPI['requestForget'];
    requestForgetStream?: BinaryAPI['requestForgetStream'];
    id?: string;
    getMarketsOrder?: (active_symbols: ActiveSymbols) => string[];
    getIndicatorHeightRatio?: (chart_height: number, indicator_count: number) => { height: number; percent: number };
    symbol?: string;
    initialData?: {
        masterData?: TQuote[];
        tradingTimes?: TradingTimesResponse;
        activeSymbols?: ActiveSymbols;
    } & TradingTimesResponse;
    feedCall?: { activeSymbols: boolean; tradingTimes: boolean };
    granularity?: TGranularity;
    chartType?: string;
    startEpoch?: number;
    endEpoch?: number;
    chartControlsWidgets?: React.FC | null;
    topWidgets?: React.FC;
    bottomWidgets?: React.FC;
    toolbarWidget?: React.FC;
    isMobile?: boolean;
    onSettingsChange?: (newSettings: Omit<TSettings, 'activeLanguages'>) => void;
    stateChangeListener?: (state: string, option?: { symbol: string | undefined; isClosed: boolean }) => void;
    settings?: TSettings;
    barriers?: BarrierStore[];
    enableRouting?: boolean;
    enable?: boolean;
    isConnectionOpened?: boolean;
    onMessage: (message: TNotification) => void;
    isAnimationEnabled?: boolean;
    showLastDigitStats?: boolean;
    scrollToEpoch?: number | null;
    scrollToEpochOffset?: number;
    clearChart?: () => void;
    onExportLayout?: (currentLayout: typeof CIQ.UI.Layout) => void;
    importedLayout?: typeof CIQ.UI.Layout;
    shouldFetchTradingTimes?: boolean;
    maxTick?: number;
    crosshair?: number;
    crosshairTooltipLeftAllow?: number | null;
    zoom?: number;
    yAxisMargin?: { bottom: number; top: number };
    enableScroll?: boolean | null;
    enableZoom?: boolean | null;
    chartData?: { activeSymbols: ActiveSymbols; tradingTimes: TradingTimesResponse['trading_times'] };
};

export type TQuote = {
    Date: string;
    Open?: number;
    High?: number;
    Low?: number;
    Close: number;
    tick?: TicksStreamResponse['tick'];
    ohlc?: OHLCStreamResponse['ohlc'];
    DT?: Date;
    prevClose?: number;
};

export interface IPendingPromise<T, E> extends Promise<T> {
    resolve: (res: T | PromiseLike<T>) => void;
    reject: (error: E | PromiseLike<E>) => void;
    isPending: boolean;
}

export type TChanges = {
    [key: string]: boolean;
};

export type TSettingsItemGroup = {
    key: string;
    fields: TSettingsItem[];
};

export type TSettingsItem = {
    id: string;
    title: string;
    value: string | number | boolean | TObject;
    defaultValue: string;
    type: string;
    subtitle?: string;
    min?: number;
    max?: number;
    step?: number;
    options?: {
        [x: string]: string;
    };
};

export type TOpenClose = { date: string; open: Date; close: Date };
export type TTimes = { open: Date; close: Date };

export type TTradingTimesItem = {
    feed_license?: string;
    isClosedToday: boolean;
    holidays: string[];
    closes_early: TOpenClose[];
    opens_late: TOpenClose[];
    delay_amount: number;
    times?: TTimes[];
    isOpenAllDay: boolean;
    isClosedAllDay: boolean;
    isOpened?: boolean;
};
