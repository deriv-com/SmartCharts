import { ActiveSymbols, TicksStreamResponse, TradingTimesResponse } from '@deriv/api-types';
import { ChartTypes } from 'src/Constant';
import { OHLCStreamResponse } from './api.types';
import { TMainStore } from './stores.types';

export type TBar = {
    height: number;
    cName: string;
};

export type ChartType = typeof ChartTypes[0];

export type TChartParams = {
    enable?: boolean;
    shouldFetchTradingTimes?: TMainStore['state']['shouldFetchTradingTimes'];
    getMarketsOrder?: (active_symbols: ActiveSymbols) => string[];
    initialData?: {
        masterData?: TQuote[];
        tradingTimes?: TradingTimesResponse;
        activeSymbols?: ActiveSymbols;
    };
};

export type TQuote = {
    Date: string;
    Open?: number;
    High?: number;
    Low?: number;
    Close: number;
    tick?: TicksStreamResponse['tick'];
    ohlc?: OHLCStreamResponse['ohlc'];
};

export interface IPendingPromise<Response> extends Promise<Response> {
    resolve: (res?: Response) => void;
    reject: (error?: any) => void;
    isPending: boolean;
    data: any;
}

export type TChanges = {
    [key: string]: boolean;
};

export type TSettingsItemGroup = {
    key: string;
    fields: TSettingsItems[];
};

export type TSettingsItems = {
    id: string;
    title: string;
    value: string;
    defaultValue: string;
    subtitle: string;
};

export type TOpenClose = { date: string; open: Date; close: Date };
export type TTimes = { open: Date; close: Date };

export type TTradingTimesItem = {
    feed_license: string;
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
