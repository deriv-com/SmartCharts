import {
    Candles,
    History,
    TicksHistoryRequest,
    TicksHistoryResponse,
    TickSpotData,
    TicksStreamResponse,
} from '@deriv/api-types';
import { ArrayElement, OHLCStreamResponse, TBinaryAPIRequest } from 'src/types';
import ConnectionManager from './ConnectionManager';
import Stream from './Stream';
import { mergeTickHistory } from './tickUtils';

class StreamManager {
    MAX_CACHE_TICKS = 5000;
    _connection: ConnectionManager;
    _streams: Record<string, Stream> = {};
    _streamIds: Record<string, string | undefined> = {};
    _tickHistoryCache: Record<string, Required<TicksHistoryResponse>> = {};
    _tickHistoryPromises: Record<string, Promise<Required<TicksHistoryResponse>>> = {};
    _beingForgotten: Record<string, boolean> = {};

    constructor(connection: ConnectionManager) {
        this._connection = connection;

        for (const msgType of ['tick', 'ohlc']) {
            this._connection.on(msgType, this._onTick.bind(this));
        }
        this._connection.onClosed(this._onConnectionClosed.bind(this));
    }

    _onTick(data: TicksStreamResponse) {
        const key = this._getKey((data.echo_req as unknown) as TicksHistoryRequest);

        if (this._streams[key] && this._tickHistoryCache[key]) {
            this._streamIds[key] = data[data.msg_type]?.id;
            this._cacheTick(key, data);
            this._streams[key].emitTick(data);
        } else if (this._beingForgotten[key] === undefined) {
            // There could be the possibility a stream could still enter even though
            // it is no longer in used. This is because we can't know the stream ID
            // from the initial response; we have to wait for the next tick to retrieve it.
            // In such scenario we need to forget these "orphaned" streams:
            this._streamIds[key] = data[data.msg_type]?.id;
            this._forgetStream(key);
        }
    }

    _onConnectionClosed() {
        // StreamManager simply discards all streams upon disconnection;
        // It is not its responsibility to reestablish the streams upon reconnection.
        this._streamIds = {}; // set it to blank so that forget requests do not get called
        for (const key of Object.keys(this._streams)) {
            if (this._streams[key].subscriberCount !== 0) {
                this._forgetStream(key);
            }
        }
    }

    _onReceiveTickHistory(data: Required<TicksHistoryResponse>) {
        const key = this._getKey((data.echo_req as unknown) as TicksHistoryRequest);
        const cache = StreamManager.cloneTickHistoryResponse(data);
        if (cache) {
            this._tickHistoryCache[key] = cache;
        }
        delete this._tickHistoryPromises[key];
    }

    _cacheTick(key: string, response: TicksStreamResponse | OHLCStreamResponse) {
        if ('ohlc' in response) {
            const { ohlc } = response as OHLCStreamResponse;
            const candles = this._tickHistoryCache[key].candles as Candles;
            const { close, open_time: epoch, high, low, open } = ohlc;
            const candle: ArrayElement<Candles> = {
                close: (close as unknown) as number,
                high: (high as unknown) as number,
                low: (low as unknown) as number,
                open: (open as unknown) as number,
                epoch,
            };
            const lastCandle = candles[candles.length - 1] as Required<Candles[0]>;
            if (lastCandle && candle.epoch && +lastCandle.epoch === +candle.epoch) {
                candles[candles.length - 1] = candle;
            } else {
                candles.push(candle);

                if (candles.length > this.MAX_CACHE_TICKS) {
                    candles.shift();
                }
            }
        } else if ('tick' in response) {
            const { tick } = response;
            const history = this._tickHistoryCache[key].history;

            const { prices, times } = history as Required<History>;
            const { quote: price, epoch: time } = tick as Required<TickSpotData>;

            prices.push(price);
            times.push(time);

            if (prices.length > this.MAX_CACHE_TICKS) {
                prices.shift();
                times.shift();
            }
        }
    }

    _forgetStream(key: string) {
        const stream = this._streams[key];
        if (stream) {
            // Note that destroying a stream also removes all subscribed events
            stream.destroy();
            delete this._streams[key];
        }

        if (this._streamIds[key]) {
            const id = this._streamIds[key];
            this._beingForgotten[key] = true;
            this._connection.send({ forget: id }).then(() => {
                delete this._beingForgotten[key];
                delete this._streamIds[key];
            });
        }

        if (this._tickHistoryCache[key]) {
            delete this._tickHistoryCache[key];
        }
    }

    _createNewStream(request: TicksHistoryRequest) {
        const key = this._getKey(request);
        const stream = new Stream();
        this._streams[key] = stream;
        const subscribePromise = this._connection.send((request as unknown) as TBinaryAPIRequest);
        this._tickHistoryPromises[key] = subscribePromise as Promise<Required<TicksHistoryResponse>>;

        subscribePromise
            .then(response => {
                this._onReceiveTickHistory(response as Required<TicksHistoryResponse>);
                if (response.error) {
                    this._forgetStream(key);
                }
            })
            .catch(() => {
                this._forgetStream(key);
            });

        stream.onNoSubscriber(() => this._forgetStream(key));

        return stream;
    }

    async subscribe(req: TBinaryAPIRequest, callback: (response: TicksHistoryResponse) => void) {
        const request = (req as unknown) as TicksHistoryRequest;
        const key = this._getKey(request);
        let stream = this._streams[key];
        if (!stream) {
            stream = this._createNewStream(request);
        }

        let tickHistoryResponse = this._tickHistoryCache[key];
        if (!tickHistoryResponse) {
            tickHistoryResponse = await this._tickHistoryPromises[key];
        }

        const responseStart = ((tickHistoryResponse.echo_req as unknown) as TicksHistoryRequest).start;
        if (responseStart && request.start && responseStart > request.start) {
            // request needs more data
            const patchRequest = { ...request };
            delete patchRequest.subscribe;
            const { history, candles } = tickHistoryResponse as Required<TicksHistoryResponse>;
            patchRequest.end = String(history && history.times?.[0] ? +history.times[0] : candles[0].epoch || '');
            const patch = (await this._connection.send(patchRequest)) as Required<TicksHistoryResponse>;
            tickHistoryResponse = mergeTickHistory(tickHistoryResponse, patch);
        }

        if (tickHistoryResponse.error) {
            callback(tickHistoryResponse);
        } else {
            // If cache data is available, send a copy otherwise we risk
            // mutating the cache outside of StreamManager
            callback(StreamManager.cloneTickHistoryResponse(tickHistoryResponse));
        }

        stream.onStream(callback);
    }

    forget(request: TBinaryAPIRequest, callback: (response: TicksHistoryResponse) => void) {
        const key = this._getKey((request as unknown) as TicksHistoryRequest);
        const stream = this._streams[key];
        if (stream) {
            stream.offStream(callback);
        }
    }

    _getKey({ ticks_history: symbol, granularity }: TicksHistoryRequest) {
        return `${symbol}-${granularity || 0}`;
    }

    static cloneTickHistoryResponse({ history, candles, ...others }: Required<TicksHistoryResponse>) {
        let clone: TicksHistoryResponse | null = null;

        if (history) {
            const { prices, times } = history as Required<History>;
            clone = {
                ...others,
                history: {
                    prices: prices.slice(0),
                    times: times.slice(0),
                },
            };
        } else if (candles) {
            clone = { ...others, candles: candles.slice(0) };
        }

        return clone as Required<TicksHistoryResponse>;
    }
}

export default StreamManager;
