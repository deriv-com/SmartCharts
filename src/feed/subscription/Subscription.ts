// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'even... Remove this comment to see the full error message
import EventEmitter from 'event-emitter-es6';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

class Subscription {
    _binaryApi: any;
    _emitter: any;
    _request: any;
    _stx: any;
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'lastStreamEpoch' implicitly has an 'any' t... Remove this comment to see the full error message
    lastStreamEpoch;
    static get EVENT_CHART_DATA() {
        return 'EVENT_CHART_DATA';
    }

    constructor(request: any, api: any, stx: any) {
        this._binaryApi = api;
        this._stx = stx;
        this._request = request;
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    async initialFetch() {
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
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

            // @ts-expect-error ts-migrate(2554) FIXME: Expected 0 arguments, but got 1.
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

    _processHistoryResponse(response: any) {
        if (response.error) {
            throw response.error;
        }

        const quotes = TickHistoryFormatter.formatHistory(response);

        if (!quotes) {
            const message = `Unexpected response: ${response}`;
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ message: string; }' is not ass... Remove this comment to see the full error message
            throw new Error({ message });
        }

        this.lastStreamEpoch = Subscription.getLatestEpoch(response);

        return quotes;
    }

    onChartData(callback: any) {
        this._emitter.on(Subscription.EVENT_CHART_DATA, callback);
    }

    static getLatestEpoch({
        candles,
        history,
    }: any) {
        if (candles) {
            return candles[candles.length - 1].epoch;
        }

        if (history) {
            const { times } = history;
            return times[times.length - 1];
        }
    }

    static getEpochFromTick({
        tick,
        ohlc,
    }: any) {
        return tick ? tick.epoch : ohlc.open_time;
    }
}

export default Subscription;
