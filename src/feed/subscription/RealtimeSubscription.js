import PendingPromise from '../../utils/PendingPromise';
import Subscription from './Subscription';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

class RealtimeSubscription extends Subscription {
    _tickCallback;

    pause() {
        // prevent forget requests; active streams are invalid when connection closed
        this._tickCallback = undefined;
    }

    async resume() {
        if (this._tickCallback) {
            throw new Error('You cannot resume an active stream!');
        }

        return super.resume();
    }

    async _startSubscribe(tickHistoryRequest) {
        const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure();
        this._binaryApi.subscribeTickHistory(tickHistoryRequest, processTickHistory);
        const response = await tickHistoryPromise;
        const quotes = this._processHistoryResponse(response);
        this._tickCallback = processTickHistory;

        return quotes;
    }

    forget() {
        if (this._tickCallback) {
            const { symbol, granularity } = this._request;
            this._binaryApi.forget({
                symbol,
                granularity,
            });
            this._tickCallback = undefined;
        }

        super.forget();
    }

    _getProcessTickHistoryClosure() {
        let hasHistory = false;
        const tickHistoryPromise = new PendingPromise();
        const processTickHistory = (resp) => {
            if (this._stx.isDestroyed) {
                console.error('No data should be coming in when chart is destroyed!');
                return;
            }
            // We assume that 1st response is the history, and subsequent
            // responses are tick stream data.
            if (hasHistory) {
                this._onTick(resp);
                return;
            }
            tickHistoryPromise.resolve(resp);
            hasHistory = true;
        };
        return [tickHistoryPromise, processTickHistory];
    }

    _onTick(response) {
        this.lastStreamEpoch = +Subscription.getEpochFromTick(response);
        const quotes = [TickHistoryFormatter.formatTick(response)];
        this._emitter.emit(Subscription.EVENT_CHART_DATA, quotes);
    }
}

export default RealtimeSubscription;
