export default class Subscription {
    static get DEFAULT_COUNT() {
        return 1000;
    }

    static get DEFAULT_TIMEOUT() {
        return 20 * 1000;
    }

    constructor(request, { connection, response = null }) {
        this._connection = connection;
        this._request = request;
        this._response = response;
    }

    subscribe() {
        this._response = this._connection
            .send(this._request, Subscription.DEFAULT_TIMEOUT);
    }

    get response() {
        return this._response;
    }

    static cloneResponseData(data) {
        const clone = {
            echo_req: Object.assign({}, data.echo_req),
        };

        if (data.history) {
            const prices = data.history.prices.slice(0);
            const times = data.history.times.slice(0);
            clone.history = {
                prices,
                times,
            };
        } else if (data.candles) {
            clone.candles = data.candles.slice(0);
        }
        return clone;
    }

    static diffResponseData(perv, now) {
        const diff = {
            echo_req: Object.assign({}, now.echo_req),
        };
        if (perv.history && now.history) {
            const epoch = perv.history.times[perv.history.times.length - 1];
            const index = now.history.times.indexOf(epoch);

            diff.history = {
                times: [],
                prices: [],
            };
            if (index !== -1) {
                diff.history.times = now.history.times.slice(index + 1);
                diff.history.prices = now.history.prices.slice(index + 1);
            }
        }
        if (perv.candles && now.candles) {
            const findIndex = (array, predicate) => {
                for (let idx = 0; idx < array.length; ++idx) {
                    if (predicate(array[idx])) {
                        return idx;
                    }
                }
                return -1;
            };
            const epoch = perv.candles[perv.candles.length - 1].epoch;
            const index = findIndex(now.candles, candle => candle.epoch === epoch);

            diff.candles = [];
            if (index !== -1) {
                diff.candles = now.candles.slice(index);
            }
        }
        return diff;
    }
}
