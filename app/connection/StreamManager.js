/* eslint-disable-camelcase */
import EventEmitter from 'event-emitter-es6';
import ConnectionManager from './ConnectionManager';
import Subscription from './Subscription';
import Stream from './Stream';

class StreamManager {
    _connection;
    _emitters = {};
    _streamIds = {};
    _lastStreamEpoch = {};
    _subscriptionData = {};
    _inProgress = {};
    _beingForgotten = {};
    _callbacks = new Map();

    constructor(connection) {
        this._connection = connection;

        for (const msgType of ['tick', 'ohlc']) {
            this._connection.on(msgType, this._onTick.bind(this));
        }
        this._connection.on(
            ConnectionManager.EVENT_CONNECTION_CLOSE,
            this._onConnectionClosed.bind(this),
        );
        this._connection.on(
            ConnectionManager.EVENT_CONNECTION_REOPEN,
            this._onConnectionOpened.bind(this),
        );
    }

    _onTick(data) {
        const { ticks_history: symbol, granularity } = data.echo_req;
        const key = `${symbol}-${granularity}`;

        const updateActiveStream = () => {
            const { id, epoch } = data[data.msg_type];
            this._streamIds[key] = id;
            // Epoch is updated with each tick so we know from when
            // to patch up missing ticks when connection recovers
            this._lastStreamEpoch[key] = epoch;
        };

        if (this._emitters[key]) {
            updateActiveStream();
            this._emitters[key].emit(Stream.EVENT_STREAM, data);
        } else if (this._beingForgotten[key] === undefined) {
            // There could be the possibility a stream could still enter even though
            // it is no longer in used. This is because we can't know the stream ID
            // from the initial response; we have to wait for the next tick to retrieve it.
            // In such scenario we need to forget these "orphaned" streams:
            updateActiveStream();
            this._forgetStream(key);
        }
    }

    _onConnectionClosed() {
        this._streamIds = { };
        for (const key of Object.keys(this._emitters)) {
            this._emitters[key].emit(Stream.EVENT_DISCONNECT);
        }
    }

    _onConnectionOpened() {
        // For _subscriptionData to have any values, connection must be reopened
        for (const key of Object.keys(this._subscriptionData)) {
            const data = this._subscriptionData[key];
            const { ticks_history: symbol, granularity } = data.echo_req;
            const subscription = new Subscription({ symbol, granularity }, { connection: this._connection });

            if (this._lastStreamEpoch[key]) {
                // patch up missing tick data
                const epoch = +this._lastStreamEpoch[key];
                subscription.subscribe(epoch + 1);
                subscription.response.then((patchData) => {
                    if (patchData.history) {
                        const { prices, times } = data.history;
                        const { prices: missingPrices, times: missingTimes } = patchData.history;
                        data.history = {
                            prices: prices.concat(missingPrices),
                            times:  times.concat(missingTimes),
                        };
                    } else if (data.candles) {
                        const { candles: missingCandles } = patchData;
                        data.candles = data.candles.concat(missingCandles);
                    }
                    this._emitters[key].emit(Stream.EVENT_STREAM, patchData);
                });
            } else {
                // _lastStreamEpoch[key] can be undefined if the first response was not received before
                // the connection closes; in such scenario we subscribe for the tick history again
                subscription.subscribe();
                subscription.response.then((newTickHistory) => {
                    this._subscriptionData[key] = Subscription.cloneResponseData(newTickHistory);
                    this._emitters[key].emit(Stream.EVENT_STREAM, newTickHistory);
                });
            }
        }
    }

    _trackSubscription(subscription) {
        return subscription.response.then((data) => {
            const { ticks_history: symbol, granularity } = data.echo_req;
            const key = `${symbol}-${granularity}`;

            const shouldSendStreamReconnect = this._subscriptionData[key] && this._emitters[key];
            if (shouldSendStreamReconnect) {
                const diff = Subscription.diffResponseData(this._subscriptionData[key], data);
                this._emitters[key].emit(Stream.EVENT_RECONNECT, diff);
            }
            this._subscriptionData[key] = Subscription.cloneResponseData(data);
            delete this._inProgress[key];
            return this._subscriptionData[key];
        });
    }

    _trackStream(stream) {
        stream.onStream(({ echo_req, ohlc, tick }) => {
            const { ticks_history: symbol, granularity } = echo_req;
            const key = `${symbol}-${granularity}`;
            if (ohlc) {
                const candles = this._subscriptionData[key].candles;
                const {
                    close, open_time: epoch, high, low, open,
                } = ohlc;
                const candle = {
                    close, high, low, open, epoch,
                };
                if (+candles[candles.length - 1].epoch === +candle.epoch) {
                    candles[candles.length - 1] = candle;
                } else {
                    candles.push(candle);
                    candles.shift();
                }
            } else if (tick) {
                const { prices, times } = this._subscriptionData[key].history;
                const { quote: price, epoch: time } = tick;
                prices.push(price);
                prices.shift();
                times.push(time);
                times.shift();
            }
        });
    }

    _forgetStream(key) {
        this._clearEmitter(key);
        if (this._streamIds[key]) {
            const id = this._streamIds[key];
            this._beingForgotten[key] = true;
            this._connection.send({ forget: id })
                .then(() => {
                    delete this._beingForgotten[key];
                    delete this._streamIds[key];
                });
        }
        if (this._subscriptionData[key]) {
            delete this._subscriptionData[key];
            delete this._lastStreamEpoch[key];
        }
    }

    _clearEmitter(key) {
        if (this._emitters[key]) {
            this._emitters[key].off(Stream.EVENT_REMEMBER_STREAM);
            this._emitters[key].off(Stream.EVENT_FORGET_STREAM);
            delete this._emitters[key];
        }
    }

    _setupEmitter(key, subscription) {
        const emitter = new EventEmitter({ emitDelay: 0 });
        this._emitters[key] = emitter;

        subscription.response.then((response) => {
            if (response.error) {
                this._clearEmitter(key);
            }
        });
        subscription.response.catch(() => this._clearEmitter(key));

        let subscribers = 0;
        emitter.on(Stream.EVENT_REMEMBER_STREAM, () => {
            ++subscribers;
        });
        emitter.on(Stream.EVENT_FORGET_STREAM, () => {
            --subscribers;
            if (subscribers === 0) {
                this._forgetStream(key);
            }
        });

        return emitter;
    }

    _handleNewStream({ symbol, granularity }) {
        const key = `${symbol}-${granularity}`;
        const subscription = new Subscription({ symbol, granularity }, { connection: this._connection });
        subscription.subscribe();
        this._inProgress[key] = this._trackSubscription(subscription, key);
        const emitter = this._setupEmitter(key, subscription);

        const stream = new Stream(subscription, emitter);
        this._trackStream(stream);
        return stream;
    }

    _handleExistingStream({ symbol, granularity }) {
        const key = `${symbol}-${granularity}`;
        const response = new Promise((resolve, reject) => {
            const data = this._subscriptionData[key];
            if (data) {
                resolve(Subscription.cloneResponseData(data));
            } else {
                const progress = this._inProgress[key];
                if (progress) {
                    progress.then(data => resolve(Subscription.cloneResponseData(data)))
                        .catch(reject);
                } else {
                    reject(new Error('No existing stream'));
                }
            }
        });
        const subscription = new Subscription({ symbol, granularity }, { response, connection: this._connection });
        const emitter = this._emitters[key];
        const stream = new Stream(subscription, emitter);
        return stream;
    }

    _getStream({ symbol, granularity = 0 }) {
        const key = `${symbol}-${granularity}`;
        if (this._emitters[key]) {
            return this._handleExistingStream({ symbol, granularity });
        }
        return this._handleNewStream({ symbol, granularity });
    }

    async subscribe(input, callback) {
        const { ticks_history: symbol, granularity } = input;
        const stream = this._getStream({ symbol, granularity });
        stream.onStream(tickResponse => callback(tickResponse));
        const historyResponse = await stream.response;
        this._callbacks.set(callback, stream);

        callback(historyResponse);
    }

    forget(symbolRequest, callback) {
        const stream = this._callbacks.get(callback);
        stream.forget();
        this._callbacks.delete(callback);
    }
}

export default StreamManager;
