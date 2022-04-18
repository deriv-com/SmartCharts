import { TicksStreamResponse } from '@deriv/api-types';
import { IPendingPromise } from 'src/types';
import { TCreateTickHistoryParams } from 'src/binaryapi/BinaryAPI';
import PendingPromise from '../../utils/PendingPromise';
import Subscription from './Subscription';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

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
        //@ts-ignore
        if(!!this.contractInfo.tick_stream){
            console.log('it is open contract');
            //@ts-ignore
        const response = await this.contractInfo?.tick_stream;

        // console.log('this._stx.isDestroyed', this._stx.isDestroyed);
        //  if (this._stx.isDestroyed) {
        //     //@ts-ignore
        //     console.log('this._mainStore', this._mainStore.state?.contractInfo?.id);
        //      //@ts-ignore
        //     if(this._mainStore.state?.contractInfo?.id){
        //     //@ts-ignore
        //     const subscriptionId = this._mainStore.state?.contractInfo?.id;
        //     this._binaryApi.forgetStream(subscriptionId);
        //     }
        // }
        //@ts-ignore
        this._onTick(response);

        const quotes = this._processHistoryResponse(response);
        console.log('{ quotes, response } ', quotes, response);

            return { quotes, response };
        }else{
        const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure();
        this._binaryApi.subscribeTickHistory(tickHistoryRequest, processTickHistory);
        const response = await tickHistoryPromise;
        const quotes = this._processHistoryResponse(response);
        this._tickCallback = processTickHistory;

            return { quotes, response };
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

        super.forget();
    }

    _getProcessTickHistoryClosure(): [IPendingPromise<TicksStreamResponse, void>, (resp: TicksStreamResponse) => void] {
        let hasHistory = false;
        const tickHistoryPromise = PendingPromise<TicksStreamResponse, void>();
        const processTickHistory = (resp: TicksStreamResponse) => {
            if (this._stx.isDestroyed) {
                if(!resp.subscription?.id)return;
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

    _onTick(response: TicksStreamResponse | any) {
        //@ts-ignore
        if(!!this.contractInfo.tick_stream){
            //@ts-ignore
            this.lastStreamEpoch = +Subscription.getEpochFromTick(response[Object.keys(response).length - 1]);
            //@ts-ignore
            const quotes = [TickHistoryFormatter.formatTick(response[Object.keys(response).length - 1])];
            console.log('quotes', quotes, response[Object.keys(response).length - 1]);
            this._emitter.emit(Subscription.EVENT_CHART_DATA, quotes);
            console.log('1 this._emitter', this._emitter, quotes);
            
        }else{
            this.lastStreamEpoch = +Subscription.getEpochFromTick(response);
            const quotes = [TickHistoryFormatter.formatTick(response)];
            this._emitter.emit(Subscription.EVENT_CHART_DATA, quotes);
            console.log('2 this._emitter', this._emitter, quotes);
        } 
    }
}

export default RealtimeSubscription;
