import { ActiveSymbols, TicksStreamResponse, TradingTimesResponse } from '@deriv/api-types';
import { BinaryAPI, TradingTimes } from 'src/binaryapi';
import { ChartTypes } from 'src/Constant';
import BarrierStore from 'src/store/BarrierStore';
import { TSettings } from 'src/store/ChartSettingStore';
import { TNotification } from 'src/store/Notifier';
import { TGranularity } from '.';
import { OHLCStreamResponse } from './api.types';

export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

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
    chartData?: { activeSymbols: ActiveSymbols; tradingTimes: TradingTimes };
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

export interface IPendingPromise<Response> extends Promise<Response> {
    resolve: (res?: Response) => void;
    reject: (error?: Error) => void;
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
    value: string;
    defaultValue: string;
    subtitle?: string;
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
