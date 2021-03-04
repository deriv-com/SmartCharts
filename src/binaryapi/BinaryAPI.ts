export default class BinaryAPI {
    requestAPI: any;
    requestForget: any;
    requestForgetStream: any;
    requestSubscribe: any;
    static get DEFAULT_COUNT() {
        return 1000;
    }
    streamRequests = {};
    tradingTimesCache = null;
    constructor(requestAPI: any, requestSubscribe: any, requestForget: any, requestForgetStream: any) {
        this.requestAPI = requestAPI;
        this.requestSubscribe = requestSubscribe;
        this.requestForget = requestForget;
        this.requestForgetStream = requestForgetStream;
    }
    getActiveSymbols() {
        return this.requestAPI({ active_symbols: 'brief' });
    }
    getServerTime() {
        return this.requestAPI({ time: 1 });
    }
    async getTradingTimes(trading_times = 'today') {
        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (this.tradingTimesCache && this.tradingTimesCache.trading_times === trading_times) {
            // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            return { ...this.tradingTimesCache };
        }
        const response = await this.requestAPI({ trading_times });
        if (trading_times !== 'today') {
            this.tradingTimesCache = { ...response };
        }
        return response;
    }
    getTickHistory(params: any) {
        const request = BinaryAPI.createTickHistoryRequest(params);
        return this.requestAPI(request);
    }
    subscribeTickHistory(params: any, callback: any) {
        const key = this._getKey(params);
        const request = BinaryAPI.createTickHistoryRequest({ ...params, subscribe: 1 });
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this.streamRequests[key] = { request, callback };
        // Send a copy of the request, in case it gets mutated outside
        this.requestSubscribe({ ...request }, callback);
    }
    forget(params: any) {
        const key = this._getKey(params);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (!this.streamRequests[key])
            return;
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const { request, callback } = this.streamRequests[key];
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete this.streamRequests[key];
        return this.requestForget(request, callback);
    }
    forgetStream(subscription_id: any) {
        if (this.requestForgetStream && typeof this.requestForgetStream === 'function') {
            return this.requestForgetStream(subscription_id);
        }
    }
    static createTickHistoryRequest({ symbol, granularity, start, end, subscribe, adjust_start_time = 1, count }: any) {
        const request = {
            ticks_history: symbol,
            style: +granularity ? 'candles' : 'ticks',
            end: 'latest',
            count: count || BinaryAPI.DEFAULT_COUNT,
        };
        if (granularity) {
            // granularity will only be set if style=candles
            (request as any).granularity = +granularity;
        }
        if (adjust_start_time) {
            (request as any).adjust_start_time = adjust_start_time;
        }
        if (subscribe) {
            (request as any).subscribe = 1;
        }
        if (start) {
            delete request.count;
            (request as any).start = start;
        }
        if (end) {
            request.end = end;
        }
        return request;
    }
    _getKey({ symbol, granularity }: any) {
        return `${symbol}-${granularity}`;
    }
}
