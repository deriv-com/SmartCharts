import { ActiveSymbols, TicksStreamResponse, TradingTimesResponse } from '@deriv/api-types';
import { HtmlHTMLAttributes } from 'react';
import { BinaryAPI } from 'src/binaryapi';
import { ChartTypes } from 'src/Constant';
import ChartState from 'src/store/ChartState';
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
    [key: string]: unknown;
};

export type TBinaryAPIResponse = {
    echo_req: {
        [k: string]: unknown;
    };
    req_id?: number;
    msg_type: any;
    [key: string]: unknown;
};

export type TRequestAPI = (request: TBinaryAPIRequest) => Promise<TBinaryAPIResponse>;
export type TResponseAPICallback = (response: TBinaryAPIResponse) => void;
export type TRequestSubscribe = (request: TBinaryAPIRequest, callback: TResponseAPICallback) => void;
export type TRequestForgetStream = (id: string) => void;
export type TRequestForget = (request: TBinaryAPIRequest, callback: TResponseAPICallback) => void;
export type TNetworkConfig = {
    class: string;
    tooltip: string;
};

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

export type TLanguage = {
    key: string;
    name: string;
    icon: JSX.Element;
};

export type TSettings = {
    countdown?: boolean;
    historical?: boolean;
    lang?: string;
    language?: string;
    position?: string;
    enabledNavigationWidget?: boolean;
    isAutoScale?: boolean;
    isHighestLowestMarkerEnabled?: boolean;
    theme?: string;
    activeLanguages?: Array<string | TLanguage> | null;
};

export type TStateChangeListener = (state: string, option?: { symbol: string | undefined; isClosed: boolean }) => void;

export type TRatio = {
    height: number;
    percent: number;
};

export type TGetIndicatorHeightRatio = (chart_height: number, indicator_count: number) => TRatio;

export type TInitialChartData = {
    masterData?: TQuote[];
    tradingTimes?: TradingTimesResponse['trading_times'];
    activeSymbols?: ActiveSymbols;
};

export type TBarrierUpdateProps = {
    shade: string;
    shadeColor: string | undefined;
    foregroundColor: string | null;
    color: string;
    onChange: (param: TBarrierChangeParam) => void;
    relative: boolean;
    draggable: boolean;
    lineStyle: string;
    hidePriceLines: boolean;
    high?: number;
    low?: number;
    hideBarrierLine?: boolean;
    hideOffscreenBarrier?: boolean;
    hideOffscreenLine?: boolean;
    title?: string;
    showOffscreenArrows?: boolean;
    isSingleBarrier?: boolean;
    opacityOnOverlap?: number;
};

export type TChartProps = {
    requestAPI: BinaryAPI['requestAPI'];
    requestSubscribe: BinaryAPI['requestSubscribe'];
    requestForget: BinaryAPI['requestForget'];
    requestForgetStream?: BinaryAPI['requestForgetStream'];
    id?: string;
    getMarketsOrder?: (active_symbols: ActiveSymbols) => string[];
    getIndicatorHeightRatio?: TGetIndicatorHeightRatio;
    symbol?: string;
    feedCall?: { activeSymbols?: boolean; tradingTimes?: boolean };
    granularity?: TGranularity;
    chartType?: string;
    startEpoch?: number;
    endEpoch?: number;
    chartControlsWidgets?: TChartControlsWidgets;
    topWidgets?: () => React.ReactElement;
    bottomWidgets?: () => React.ReactElement;
    toolbarWidget?: () => React.ReactElement;
    isMobile?: boolean;
    onSettingsChange?: (newSettings: Omit<TSettings, 'activeLanguages'>) => void;
    stateChangeListener?: TStateChangeListener;
    settings?: TSettings;
    barriers?: TBarrierUpdateProps[];
    enableRouting?: boolean;
    enable?: boolean;
    isConnectionOpened?: boolean;
    onMessage?: (message: TNotification) => void;
    isAnimationEnabled?: boolean;
    showLastDigitStats?: boolean;
    scrollToEpoch?: number | null;
    clearChart?: () => void;
    onExportLayout?: (currentLayout: typeof CIQ.UI.Layout) => void;
    importedLayout?: typeof CIQ.UI.Layout;
    shouldFetchTradingTimes?: boolean;
    maxTick?: number | null;
    crosshairTooltipLeftAllow?: number | null;
    zoom?: number;
    yAxisMargin?: { bottom: number; top: number };
    enableScroll?: boolean | null;
    enableZoom?: boolean | null;
    initialData?: TInitialChartData;
    chartData?: TInitialChartData;
    networkStatus?: TNetworkConfig;
    refreshActiveSymbols?: ChartState['refreshActiveSymbols'];
    chartStatusListener?: ChartState['chartStatusListener'];
    enabledChartFooter?: boolean;
    anchorChartToLeft?: boolean;
    margin?: number;
    isStaticChart?: ChartState['isStaticChart'];
    enabledNavigationWidget?: boolean;
    onCrosshairChange?: (state?: number | null) => void | null;
    crosshairState?: number | null;
    children?: React.ReactNode;
    historical?: boolean;
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
    Volume?: number;
};

export interface IPendingPromise<T, E> extends Promise<T> {
    resolve: (res: T | PromiseLike<T>) => void;
    reject: (error: E | PromiseLike<E>) => void;
    isPending: boolean;
    data: any;
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
    options?: Record<string, string>;
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

export type TBarrierChangeParam = { high?: number; low?: number };

export type TOpenMarket = {
    category?: string;
    subcategory?: string | null;
    market?: string | null;
};

export type TRefData = {
    setPosition: ({ epoch, price }: Record<string, number | null | undefined>) => void;
    div: HTMLDivElement;
    value?: Element | null;
};

export type TChartControlsWidgets = ((props: { isMobile?: boolean }) => React.ReactElement) | null;

export type TIcon = (props: TIconProps) => JSX.Element;
