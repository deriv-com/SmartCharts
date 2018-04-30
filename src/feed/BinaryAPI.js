export default class BinaryAPI {
    constructor(requestAPI, requestSubscribe, requestForget) {
        this.requestAPI = requestAPI;
        this.subscribe = requestSubscribe;
        this.forget = requestForget;
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

    async getTickHistory() {
        return this.requestAPI({

        });
    }

    async subscribeTickHistory() {
        return this.requestSubscribe({

        });
    }

    async forget(callback) {
        this.requestForget(callback);
    }
}
