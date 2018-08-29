import EventEmitter from 'event-emitter-es6';

class Subscription {
    lastStreamEpoch;
    static get EVENT_TICK() { return 'EVENT_TICK'; }

    constructor(request, api, stx) {
        this._binaryApi = api;
        this._stx = stx;
        this._request = request;
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    onTick(callback) {
        this._emitter.on(Subscription.EVENT_TICK, callback);
    }

    offTick(callback) {
        this._emitter.off(Subscription.EVENT_TICK, callback);
    }

    static getLatestEpoch({ candles, history }) {
        if (candles) {
            return candles[candles.length - 1].epoch;
        }

        if (history) {
            const { times } = history;
            return times[times.length - 1];
        }
    }

    static getEpochFromTick({ tick, ohlc }) {
        return tick ? tick.epoch : ohlc.open_time;
    }
}

export default Subscription;
