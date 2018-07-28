export default class BinaryAPI {
    static get DEFAULT_COUNT() { return 1000; }
    constructor(requestAPI, requestSubscribe, requestForget) {
        this.requestAPI = requestAPI;
        this.requestSubscribe = requestSubscribe;
        this.requestForget = requestForget;
    }

    getActiveSymbols() {
        return this.requestAPI({
            active_symbols: 'brief',
            product_type: 'basic',
        });
    }

    getTradingTimes() {
        return this.requestAPI({
            trading_times: 'today',
        });
    }

    getTickHistory(params) {
        const request = BinaryAPI.createTickHistoryRequest(params);
        return this.requestAPI(request);
    }

    subscribeTickHistory(params, callback) {
        const request = BinaryAPI.createTickHistoryRequest({ ...params, subscribe: 1 });
        this.requestSubscribe(request, callback);
    }

    forget(params, callback) {
        const request = BinaryAPI.createTickHistoryRequest({ ...params, subscribe: 1 });
        return this.requestForget(request, callback);
    }

    static createTickHistoryRequest({ symbol, granularity, start, end, subscribe }) {
        const request = {
            ticks_history: symbol,
            granularity: +granularity,
            style: +granularity ? 'candles' : 'ticks',
            end: 'latest',
            count: BinaryAPI.DEFAULT_COUNT,
            adjust_start_time: 1,
        };

        if (subscribe) {
            request.subscribe = 1;
        }

        if (start) {
            delete request.count;
            request.start = start;
        }

        if (end) {
            request.end = end;
        }

        return request;
    }
}
