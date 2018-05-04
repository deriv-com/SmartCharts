export default class BinaryAPI {
    static get DEFAULT_COUNT() { return 1000; }
    constructor(requestAPI, requestSubscribe, requestForget) {
        this.requestAPI = requestAPI;
        this.requestSubscribe = requestSubscribe;
        this.requestForget = requestForget;
    }

    async getActiveSymbols() {
        return this.requestAPI({
            active_symbols: 'brief',
            product_type: 'basic',
        });
    }

    async getTradingTimes() {
        return this.requestAPI({
            trading_times: 'today',
        });
    }

    async getTickHistory({ start, end, symbol, granularity }) {
        const req = {
            ticks_history: symbol,
            granularity,
            style: granularity ? 'candles' : 'ticks'
        };

        if (start && end) {
            return this.requestAPI({
                ...req,
                end,
                start,
                adjust_start_time: 1,
            });
        }

        return this.requestAPI({
            ...req,
            end: 'latest',
            count: BinaryAPI.DEFAULT_COUNT,
            adjust_start_time: 1,
        });
    }

    subscribeTickHistory({ symbol, granularity }, callback) {
        this.requestSubscribe({
            ticks_history: symbol,
            granularity,
            style: granularity ? 'candles' : 'ticks',
            end: 'latest',
            count: BinaryAPI.DEFAULT_COUNT,
            adjust_start_time: 1,
            subscribe: 1,
        }, callback);
    }

    forget(callback) {
        return this.requestForget(callback);
    }
}
