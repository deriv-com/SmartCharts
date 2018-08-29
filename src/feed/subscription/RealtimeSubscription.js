import PendingPromise from '../../utils/PendingPromise';
import Subscription from './Subscription';

class RealtimeSubscription extends Subscription {
    _tickCallback;

    async initialFetch() {
        const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure();
        this._binaryApi.subscribeTickHistory(this._request, processTickHistory);
        const response = await tickHistoryPromise;

        const lastEpoch = Subscription.getLatestEpoch(response);

        if (lastEpoch) { // on errors, lastEpoch can be undefined
            this.lastStreamEpoch = lastEpoch;
        }

        if (!response.error) {
            this._tickCallback = processTickHistory;
        }

        return response;
    }

    pause() {
        // prevent forget requests; active streams are invalid when connection closed
        this._tickCallback = undefined;
    }

    async resume() {
        if (this._tickCallback) {
            throw new Error('You cannot resume an active stream!');
        }

        if (this.lastStreamEpoch) {
            const { symbol, granularity } = this._request;
            const tickHistoryRequest = {
                start: +this.lastStreamEpoch,
                symbol,
                granularity,
            };

            const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure();
            this._tickCallback = processTickHistory;
            this._binaryApi.subscribeTickHistory(tickHistoryRequest, processTickHistory);

            const response = await tickHistoryPromise;
            return response;
        }
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

        this.lastStreamEpoch = undefined;
        this._emitter.off(Subscription.EVENT_TICK);
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
                this.lastStreamEpoch = +Subscription.getEpochFromTick(resp);
                this._emitter.emit(Subscription.EVENT_TICK, resp);
                return;
            }
            tickHistoryPromise.resolve(resp);
            hasHistory = true;
        };
        return [tickHistoryPromise, processTickHistory];
    }
}

export default RealtimeSubscription;
