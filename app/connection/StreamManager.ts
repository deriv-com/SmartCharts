import Stream from './Stream';
import { mergeTickHistory } from './tickUtils';

class StreamManager {
    MAX_CACHE_TICKS = 5000;
    _connection;
    _streams = {};
    _streamIds = {};
    _tickHistoryCache = {};
    _tickHistoryPromises = {};
    _beingForgotten = {};

    constructor(connection: any) {
        this._connection = connection;

        for (const msgType of ['tick', 'ohlc']) {
            this._connection.on(msgType, this._onTick.bind(this));
        }
        this._connection.onClosed(this._onConnectionClosed.bind(this));
    }

    _onTick(data: any) {
        const key = this._getKey(data.echo_req);

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (this._streams[key] && this._tickHistoryCache[key]) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this._streamIds[key] = data[data.msg_type].id;
            this._cacheTick(key, data);
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this._streams[key].emitTick(data);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        } else if (this._beingForgotten[key] === undefined) {
            // There could be the possibility a stream could still enter even though
            // it is no longer in used. This is because we can't know the stream ID
            // from the initial response; we have to wait for the next tick to retrieve it.
            // In such scenario we need to forget these "orphaned" streams:
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this._streamIds[key] = data[data.msg_type].id;
            this._forgetStream(key);
        }
    }

    _onConnectionClosed() {
        // StreamManager simply discards all streams upon disconnection;
        // It is not its responsibility to reestablish the streams upon reconnection.
        this._streamIds = {}; // set it to blank so that forget requests do not get called
        for (const key of Object.keys(this._streams)) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (this._streams[key].subscriberCount !== 0) {
                this._forgetStream(key);
            }
        }
    }

    _onReceiveTickHistory(data: any) {
        const key = this._getKey(data.echo_req);
        const cache = StreamManager.cloneTickHistoryResponse(data);
        if (cache) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this._tickHistoryCache[key] = cache;
        }
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        delete this._tickHistoryPromises[key];
    }

    _cacheTick(key: any, {
        ohlc,
        tick,
    }: any) {
        if (ohlc) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const candles = this._tickHistoryCache[key].candles;
            const { close, open_time: epoch, high, low, open } = ohlc;
            const candle = {
                close,
                high,
                low,
                open,
                epoch,
            };
            if (candles[candles.length - 1] && +candles[candles.length - 1].epoch === +candle.epoch) {
                candles[candles.length - 1] = candle;
            } else {
                candles.push(candle);

                if (candles.length > this.MAX_CACHE_TICKS) {
                    candles.shift();
                }
            }
        } else if (tick) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const { prices, times } = this._tickHistoryCache[key].history;
            const { quote: price, epoch: time } = tick;
            prices.push(price);
            times.push(time);

            if (prices.length > this.MAX_CACHE_TICKS) {
                prices.shift();
                times.shift();
            }
        }
    }

    _forgetStream(key: any) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const stream = this._streams[key];
        if (stream) {
            // Note that destroying a stream also removes all subscribed events
            stream.destroy();
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            delete this._streams[key];
        }

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (this._streamIds[key]) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const id = this._streamIds[key];
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this._beingForgotten[key] = true;
            this._connection.send({ forget: id }).then(() => {
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                delete this._beingForgotten[key];
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                delete this._streamIds[key];
            });
        }

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (this._tickHistoryCache[key]) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            delete this._tickHistoryCache[key];
        }
    }

    _createNewStream(request: any) {
        const key = this._getKey(request);
        const stream = new Stream();
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this._streams[key] = stream;
        const subscribePromise = this._connection.send(request);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        this._tickHistoryPromises[key] = subscribePromise;

        subscribePromise
            .then((response: any) => {
                this._onReceiveTickHistory(response);
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

    async subscribe(request: any, callback: any) {
        const key = this._getKey(request);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let stream = this._streams[key];
        if (!stream) {
            stream = this._createNewStream(request);
        }

        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let tickHistoryResponse = this._tickHistoryCache[key];
        if (!tickHistoryResponse) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            tickHistoryResponse = await this._tickHistoryPromises[key];
        }

        const responseStart = tickHistoryResponse.echo_req.start;
        if (responseStart > request.start) {
            // request needs more data
            const patchRequest = { ...request };
            delete patchRequest.subscribe;
            const { history, candles } = tickHistoryResponse;
            patchRequest.end = history ? +history.times[0] : candles[0].epoch;
            const patch = await this._connection.send(patchRequest);
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

    forget(request: any, callback: any) {
        const key = this._getKey(request);
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const stream = this._streams[key];
        if (stream) {
            stream.offStream(callback);
        }
    }

    _getKey({
        ticks_history: symbol,
        granularity,
    }: any) {
        return `${symbol}-${granularity || 0}`;
    }

    static cloneTickHistoryResponse({
        history,
        candles,
        ...others
    }: any) {
        let clone;

        if (history) {
            const { prices, times } = history;
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

        return clone;
    }
}

export default StreamManager;
