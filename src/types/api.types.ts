import { SubscriptionInformation, TicksHistoryRequest, ActiveSymbols } from '@deriv/api-types';

export type OHLCStreamResponse = {
    ohlc: {
        close: string;
        epoch: number;
        granularity: TicksHistoryRequest['granularity'];
        high: string;
        id: string;
        low: string;
        open: string;
        open_time: number;
        symbol: string;
    };
    subscription?: SubscriptionInformation;
    echo_req: {
        [k: string]: unknown;
    };
    msg_type: 'ohlc';
    req_id?: number;
};

export type ActiveSymbolsItem = ActiveSymbols[0];

export type TGranularity = 0 | TicksHistoryRequest['granularity'];

export type TTradingTimesSymbol = {
    events: [{ dates: string; descrip: string }];
    name: string;
    symbol: string;
    times: { close: string[]; open: string[]; settlement: string };
    trading_days: string[];
    feed_license?: string;
    delay_amount?: number;
};

export type TError = {
    code?: string;
    message?: string;
};
