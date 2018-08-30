import EventEmitter from 'event-emitter-es6';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

class Subscription {
    lastStreamEpoch;
    static get EVENT_CHART_DATA() { return 'EVENT_CHART_DATA'; }

    constructor(request, api, stx) {
        this._binaryApi = api;
        this._stx = stx;
        this._request = request;
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    async initialFetch() {
        const quotes = await this._startSubscribe(this._request);

        return quotes;
    }

    pause() {}

    async resume() {
        if (this.lastStreamEpoch) {
            const tickHistoryRequest = {
                ...this._request,
                start: this.lastStreamEpoch,
            };

            const quotes = await this._startSubscribe(tickHistoryRequest);

            return quotes;
        }
    }

    forget() {
        this.lastStreamEpoch = undefined;
        this._emitter.off(Subscription.EVENT_CHART_DATA);
    }

    async _startSubscribe() {
        throw new Error('Please override!');
    }

    _processHistoryResponse(response) {
        if (response.error) {
            throw new Error(response.error);
        }

        const quotes = TickHistoryFormatter.formatHistory(response);

        if (!quotes) {
            const message = `Unexpected response: ${response}`;
            throw new Error({ message });
        }

        this.lastStreamEpoch = Subscription.getLatestEpoch(response);

        return quotes;
    }

    onChartData(callback) {
        this._emitter.on(Subscription.EVENT_CHART_DATA, callback);
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
