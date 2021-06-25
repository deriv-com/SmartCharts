import { TicksHistoryResponse, TicksStreamResponse } from '@deriv/api-types';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { OHLCStreamResponse } from 'src/types';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

const historyCandleResponse: TicksHistoryResponse = {
    echo_req: {
        adjust_start_time: 1,
        count: 3,
        end: 'latest',
        start: 1,
        style: 'ticks',
        ticks_history: 'R_50',
    },
    history: {
        prices: [272.2381, 272.2038, 272.1995],
        times: [1524809066, 1524809068, 1524809070],
    },
    msg_type: 'history',
};
const historyCandleResponseResult = [
    {
        Close: 272.2381,
        Date: '2018-04-27T06:04:26',
    },
    {
        Close: 272.2038,
        Date: '2018-04-27T06:04:28',
    },
    {
        Close: 272.1995,
        Date: '2018-04-27T06:04:30',
    },
];

const historyTicksResponse: TicksHistoryResponse = {
    candles: [
        {
            close: 272.123,
            epoch: 1524809040,
            high: 272.3895,
            low: 272.0952,
            open: 272.3895,
        },
        {
            close: 272.0673,
            epoch: 1524809100,
            high: 272.2343,
            low: 271.9868,
            open: 272.1483,
        },
        {
            close: 271.7995,
            epoch: 1524809160,
            high: 272.2094,
            low: 271.7787,
            open: 272.081,
        },
    ],
    echo_req: {
        adjust_start_time: 1,
        count: 3,
        end: 'latest',
        start: 1,
        style: 'candles',
        ticks_history: 'R_50',
    },
    msg_type: 'candles',
};
const historyTicksResponseResult = [
    {
        Close: 272.123,
        Date: '2018-04-27T06:04:00',
        High: 272.3895,
        Low: 272.0952,
        Open: 272.3895,
    },
    {
        Close: 272.0673,
        Date: '2018-04-27T06:05:00',
        High: 272.2343,
        Low: 271.9868,
        Open: 272.1483,
    },
    {
        Close: 271.7995,
        Date: '2018-04-27T06:06:00',
        High: 272.2094,
        Low: 271.7787,
        Open: 272.081,
    },
];

const tickCandleResponse: OHLCStreamResponse = {
    echo_req: {
        adjust_start_time: 1,
        count: 3,
        end: 'latest',
        granularity: 60,
        start: 1,
        style: 'candles',
        subscribe: 1,
        ticks_history: 'R_50',
    },
    msg_type: 'ohlc',
    ohlc: {
        close: '271.8080',
        epoch: 1524811658,
        granularity: 60,
        high: '271.9735',
        id: '9f5557fe-ced9-6ef3-a54a-ced44d7548f2',
        low: '271.7602',
        open: '271.9735',
        open_time: 1524811620,
        symbol: 'R_50',
    },
};
const tickCandleResponseResult = {
    Close: 271.808,
    Date: '2018-04-27T06:47:00',
    High: 271.9735,
    Low: 271.7602,
    Open: 271.9735,
};

const tickTickResponse: TicksStreamResponse = {
    echo_req: {
        adjust_start_time: 1,
        count: 3,
        end: 'latest',
        granularity: 60,
        start: 1,
        style: 'ticks',
        subscribe: 1,
        ticks_history: 'R_50',
    },
    msg_type: 'tick',
    tick: {
        ask: 271.8308,
        bid: 271.7908,
        epoch: 1524812092,
        id: 'fc1fe29b-f0a2-8840-39d7-d2f58209bb3b',
        quote: 271.8108,
        symbol: 'R_50',
        pip_size: 4,
    },
};
const tickTickResponseResult = {
    Close: 271.8108,
    Date: '2018-04-27T06:54:52',
};

describe('TickHistoryFormatter test', () => {
    it('Test parse history style="candles"', () => {
        const history = TickHistoryFormatter.formatHistory(historyCandleResponse);
        expect(history).to.deep.equal(historyCandleResponseResult);
    });

    it('Test parse history style="ticks"', () => {
        const history = TickHistoryFormatter.formatHistory(historyTicksResponse);
        expect(history).to.deep.equal(historyTicksResponseResult);
    });

    it('Test parse tick style="candles"', () => {
        const tick = TickHistoryFormatter.formatTick(tickCandleResponse);
        delete tick?.ohlc;
        expect(tick).to.deep.equal(tickCandleResponseResult);
    });

    it('Test parse tick style="ticks"', () => {
        const tick = TickHistoryFormatter.formatTick(tickTickResponse);
        delete tick?.tick;
        expect(tick).to.deep.equal(tickTickResponseResult);
    });
});
