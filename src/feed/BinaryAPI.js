export default class BinaryAPI {
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
}
