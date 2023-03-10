import { ProposalOpenContract, TicksStreamResponse } from '@deriv/api-types';
import { TCreateTickHistoryParams } from 'src/binaryapi/BinaryAPI';
import { IPendingPromise } from 'src/types';
import PendingPromise from '../../utils/PendingPromise';
import { TickHistoryFormatter } from '../TickHistoryFormatter';
import Subscription from './Subscription';

class RealtimeSubscription extends Subscription {
    _tickCallback?: (resp: TicksStreamResponse) => void;

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

    async _startSubscribe(tickHistoryRequest: TCreateTickHistoryParams) {
        const contract_info = this.contractInfo as ProposalOpenContract;
        const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure();
        
        //here we include duration = 'ticks' && exclude duration = 'seconds' which hasn't tick_stream, all_ticks, tick_count (consist of 15-86.400 ticks)
        if (!this.shouldFetchTickHistory && !!contract_info.tick_stream) {
            this._binaryApi.subscribeTickHistory(
                Object.assign(tickHistoryRequest, { count: contract_info.tick_count }),
                processTickHistory
            );
        } else {
            const contract_duration =
                contract_info.current_spot_time && contract_info.date_start
                    ? contract_info.current_spot_time - contract_info.date_start
                    : 0;
            const min_tick_count = 1000;
            this._binaryApi.subscribeTickHistory(
                Object.assign(tickHistoryRequest, {
                    count: contract_duration > min_tick_count ? contract_duration : min_tick_count,
                }),
                processTickHistory
            );
        }

        const response = await tickHistoryPromise;
        const quotes = this._processHistoryResponse(response);
        this._tickCallback = processTickHistory;

        return { quotes, response };
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

    _getProcessTickHistoryClosure(): [IPendingPromise<TicksStreamResponse, void>, (resp: TicksStreamResponse) => void] {
        let hasHistory = false;
        const tickHistoryPromise = PendingPromise<TicksStreamResponse, void>();
        const processTickHistory = (resp: TicksStreamResponse) => {
            if (this._stx.isDestroyed) {
                const subscriptionId = resp.subscription?.id as string;
                this._binaryApi.forgetStream(subscriptionId);
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

    _onTick(response: TicksStreamResponse) {
        this.lastStreamEpoch = +Subscription.getEpochFromTick(response);
        const quotes = [TickHistoryFormatter.formatTick(response)];
        this._emitter.emit(Subscription.EVENT_CHART_DATA, quotes);
    }
}

export default RealtimeSubscription;
