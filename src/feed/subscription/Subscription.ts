import { TicksHistoryResponse, TicksStreamResponse } from '@deriv/api-types';
import EventEmitter from 'event-emitter-es6';
import { BinaryAPI } from 'src/binaryapi';
import { TCreateTickHistoryParams } from 'src/binaryapi/BinaryAPI';
import Context from 'src/components/ui/Context';
import { Listener, OHLCStreamResponse, TQuote, TMainStore } from 'src/types';
import { TickHistoryFormatter } from '../TickHistoryFormatter';

export type TQuoteResponse = { quotes: TQuote[]; response: TicksHistoryResponse; error?: unknown };

class Subscription {
    _binaryApi: BinaryAPI;
    _emitter: EventEmitter;
    _request: TCreateTickHistoryParams;
    _stx: Context['stx'];
    lastStreamEpoch?: number;
    _mainStore: TMainStore;
    static get EVENT_CHART_DATA() {
        return 'EVENT_CHART_DATA';
    }
    get contractInfo() {
        return this._mainStore.state.contractInfo;
    }

    constructor(request: TCreateTickHistoryParams, api: BinaryAPI, stx: Context['stx'], mainStore: TMainStore) {
        this._binaryApi = api;
        this._stx = stx;
        this._request = request;
        this._emitter = new EventEmitter({ emitDelay: 0 });
        this._mainStore = mainStore;
    }

    async initialFetch() {
        const quotes_and_response = await this._startSubscribe(this._request);

        return quotes_and_response;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    pause() {}

    async resume() {
        if (this.lastStreamEpoch) {
            const tickHistoryRequest = {
                ...this._request,
                start: this.lastStreamEpoch,
            };

            const quotes_and_response = await this._startSubscribe(tickHistoryRequest);

            return quotes_and_response;
        }
    }

    forget() {
        this.lastStreamEpoch = undefined;
        this._emitter.off(Subscription.EVENT_CHART_DATA);
    }

    async _startSubscribe(_request: TCreateTickHistoryParams): Promise<TQuoteResponse> {
        throw new Error('Please override!');
    }

    _processHistoryResponse(response: TicksHistoryResponse | any) {
        if (response.error) {
            throw response.error;
        }
        let quotes;
        //@ts-ignore
        if(!!this.contractInfo.tick_stream){
            //@ts-ignore
            quotes = TickHistoryFormatter.formatAllTicks(response);
            console.log('hi1', response, quotes);
            //@ts-ignore
            this.lastStreamEpoch = response[response?.length -1].epoch;
            
        }else{
            quotes = TickHistoryFormatter.formatHistory(response);
            console.log('hi2', response, quotes);
            this.lastStreamEpoch = Subscription.getLatestEpoch(response);
        }

        if (!quotes) {
            const message = `Unexpected response: ${response}`;
            throw new Error(message);
        }

        return quotes;
    }

    onChartData(callback: Listener) {
        this._emitter.on(Subscription.EVENT_CHART_DATA, callback);
    }

    static getLatestEpoch({ candles, history }: TicksHistoryResponse | any) {
        if (candles) {
            return candles[candles.length - 1].epoch;
        }

        if (history) {
            const { times = [] } = history;
            return times[times.length - 1];
        }
    }

    static getEpochFromTick(response: TicksStreamResponse | OHLCStreamResponse | any) {
        //@ts-ignore
        if( !!response.tick_display_value ){
            //@ts-ignore
            return response.epoch as number;
        }

        if ('tick' in response && response.tick) {
            return response.tick.epoch as number;
        }
        
        return (response as OHLCStreamResponse).ohlc.open_time;
    }
}

export default Subscription;
