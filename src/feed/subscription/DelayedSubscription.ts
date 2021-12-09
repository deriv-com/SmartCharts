import { TicksHistoryResponse } from '@deriv/api-types';
import { BinaryAPI } from 'src/binaryapi';
import { TCreateTickHistoryParams } from 'src/binaryapi/BinaryAPI';
import Context from 'src/components/ui/Context';
import Subscription from './Subscription';

class DelayedSubscription extends Subscription {
    _timerId?: ReturnType<typeof setInterval>;
    UPDATE_INTERVAL = 3000;

    constructor(request: TCreateTickHistoryParams, api: BinaryAPI, stx: Context['stx'], delay: number) {
        super(request, api, stx);
        this._request = {
            ...this._request,
            // start times must be offset with delay because
            // there is no data within delay intervals
            start: (this._request.start as number) - delay * 60,
        };
    }

    pause() {
        this._endTimer();
    }

    async _startSubscribe(tickHistoryRequest: TCreateTickHistoryParams) {
        const response: TicksHistoryResponse = await this._binaryApi.getTickHistory(tickHistoryRequest);
        const quotes = this._processHistoryResponse(response);
        this._startTimer();
        return { quotes, response };
    }

    forget() {
        this._endTimer();
        super.forget();
    }

    _startTimer() {
        if (!this._timerId) {
            this._timerId = setInterval(this.onUpdateDelayedFeed, this.UPDATE_INTERVAL);
        }
    }

    _endTimer() {
        if (this._timerId) {
            clearInterval(this._timerId);
            this._timerId = undefined;
        }
    }

    onUpdateDelayedFeed = async () => {
        if (this.lastStreamEpoch) {
            const tickHistoryRequest = {
                ...this._request,
                start: this.lastStreamEpoch,
                // When updating delayed feeds, we don't want the
                // start time to be offset by the delayed amount:
                adjust_start_time: 0,
            };
            const response = await this._binaryApi.getTickHistory(tickHistoryRequest as TCreateTickHistoryParams);
            const quotes = this._processHistoryResponse(response);
            this._emitter?.emit(Subscription.EVENT_CHART_DATA, quotes);
        } else {
            console.error('Unable to update delayed feed without epoch from last tick');
            this._endTimer();
        }
    };
}

export default DelayedSubscription;
