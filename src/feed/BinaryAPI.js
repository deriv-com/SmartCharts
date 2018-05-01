export default class BinaryAPI {
    static get DEFAULT_COUNT() { return 1000; }
    constructor(requestAPI, requestSubscribe, requestForget) {
        this.requestAPI = requestAPI;
        this.requestSubscribe = requestSubscribe;
        this.forget = requestForget;

        this.sharedStreamHistoryInput = {
            end: 'latest',
            count: BinaryAPI.DEFAULT_COUNT,
            adjust_start_time: 1,
        };
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

    _getSharedTickHistoryInput({ symbol, granularity }) {
        return {
            ticks_history: symbol,
            granularity,
            style: granularity ? 'candles' : 'ticks'
        };
    }

    async getTickHistory(input) {
        const { start, end } = input;

        const req = this._getSharedTickHistoryInput(input);

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
            ...this.sharedStreamHistoryInput,
        });
    }

    subscribeTickHistory(input, callback) {
        const req = this._getSharedTickHistoryInput(input);
        this.requestSubscribe({
            ...req,
            ...this.sharedStreamHistoryInput,
            subscribe: 1,
        }, callback);
    }
}
