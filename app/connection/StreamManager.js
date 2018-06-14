/* eslint-disable-camelcase */
import EventEmitter from 'event-emitter-es6';
import ConnectionManager from './ConnectionManager';
import Subscription from './Subscription';
import Stream from './Stream';

class StreamManager {
    static get MSG_TICK() { return 'tick'; }
    static get MSG_OHLC() { return 'ohlc'; }
    constructor(connection) {
        this._connection = connection;
        this._emitters = { };
        this._streamIds = { };
        this._subscriptionData = { };
        this._inProgress = { };
        this._initialize();
        this._callbacks = new Map();
    }
    _initialize() {
        for (const msgType of [StreamManager.MSG_TICK, StreamManager.MSG_OHLC]) {
            this._connection.on(msgType, (data) => {
                const { ticks_history: symbol, granularity } = data.echo_req;
                const key = `${symbol}-${granularity}`;
                if (this._emitters[key]) {
                    this._streamIds[key] = data[msgType].id;
                    this._emitters[key].emit(Stream.EVENT_STREAM, data);
                } else {
                    console.error(`LEAKING STREAM ON ${msgType} => symbol: ${symbol}, granularity: ${granularity}`); // eslint-disable-line
                }
            });
        }
        this._connection.on(ConnectionManager.EVENT_CONNECTION_CLOSE, () => {
            this._streamIds = { };
            for (const key of Object.keys(this._emitters)) {
                this._emitters[key].emit(Stream.EVENT_DISCONNECT);
            }
        });
        this._connection.on(ConnectionManager.EVENT_CONNECTION_REOPEN, () => {
           if (this.reloadChart) {
               this.reloadChart();
            }
        });
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
            delete this._streamIds[key];
            this._connection.send({ forget: id });
        }
        if (this._subscriptionData[key]) {
            delete this._subscriptionData[key];
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

    reloadChart(callback)
    {
        this.reloadChart = callback;
    }
}

export default StreamManager;
