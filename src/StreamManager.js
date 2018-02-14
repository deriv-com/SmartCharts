/* eslint-disable-camelcase */
import EventEmitter from 'event-emitter-es6';
import ConnectionManager from './ConnectionManager';

class Subscription {
    static get DEFAULT_COUNT() { return 1000; }
    static get DEFAULT_TIMEOUT() { return 20 * 1000; }

    constructor({ symbol, granularity }, { connection, response = null }) {
        this._connection = connection;
        this._symbol = symbol;
        this._granularity = granularity;
        this._response = response;
        this._isMarketClosed = false;
    }
    subscribe() {
        const req = {
            ticks_history: this._symbol,
            end: 'latest',
            count: Subscription.DEFAULT_COUNT,
            adjust_start_time: 1,
            subscribe: 1,
            style: this._granularity ? 'candles' : 'ticks',
            granularity: this._granularity,
        };
        const handleNoStream = (code) => {
            if (/^(MarketIsClosed|NoRealtimeQuotes)$/.test(code)) {
                this._isMarketClosed = true;
                delete req.subscribe;
                return this._connection.send(
                    req,
                    Subscription.DEFAULT_TIMEOUT,
                );
            }
        }
        this._response = this._connection
            .send(req, Subscription.DEFAULT_TIMEOUT)
            .catch((up) => {
                const result = handleNoStream(up.code);
                if (result) return result;
                throw up;
            })
            .then((data) => {
                if (data.error) {
                    const result = handleNoStream(data.error.code);
                    if (result) return result;
                    const up = new Error(data.error.message);
                    up.response = data;
                    throw up;
                }
                return data;
            });
    }
    get response() {
        return this._response;
    }
    get isMarketClosed() {
        return this._isMarketClosed;
    }

    static cloneResponseData(data) {
        const clone = {
            echo_req: Object.assign({}, data.echo_req),
        };

        if (data.history) {
            const prices = data.history.prices.slice(0);
            const times = data.history.times.slice(0);
            clone.history = { prices, times };
        } else if (data.candles) {
            clone.candles = data.candles.slice(0);
        }
        return clone;
    }
    static diffResponseData(perv, now) {
        const diff = {
            echo_req: Object.assign({}, now.echo_req),
        };
        if (perv.history && now.history) {
            const epoch = perv.history.times[perv.history.times.length - 1];
            const index = now.history.times.indexOf(epoch);

            diff.history = { times: [], prices: [] };
            if (index !== -1) {
                diff.history.times = now.history.times.slice(index + 1);
                diff.history.prices = now.history.prices.slice(index + 1);
            }
        }
        if (perv.candles && now.candles) {
            const findIndex = (array, predicate) => {
                for (let idx = 0; idx < array.length; ++idx) {
                    if (predicate(array[idx])) {
                        return idx;
                    }
                }
                return -1;
            };
            const epoch = perv.candles[perv.candles.length - 1].epoch;
            const index = findIndex(now.candles, candle => candle.epoch === epoch);

            diff.candles = [];
            if (index !== -1) {
                diff.candles = now.candles.slice(index);
            }
        }
        return diff;
    }
}

export class Stream {
    static get EVENT_STREAM() { return 'EVENT_STREAM'; }
    static get EVENT_DISCONNECT() { return 'EVENT_DISCONNECT'; }
    static get EVENT_RECONNECT() { return 'EVENT_RECONNECT'; }
    static get EVENT_REMEMBER_STREAM() { return 'EVENT_REMEMBER_STREAM'; }
    static get EVENT_FORGET_STREAM() { return 'EVENT_FORGET_STREAM'; }
    constructor(
        subscription,
        emitter,
    ) {
        this._subscription = subscription;
        this._emitter = emitter;
        this._callbacks = {
            [Stream.EVENT_STREAM]: [],
            [Stream.EVENT_RECONNECT]: [],
            [Stream.EVENT_DISCONNECT]: [],
        };
        this._emitter.emit(Stream.EVENT_REMEMBER_STREAM);
    }
    get response() {
        return this._subscription.response;
    }
    get isMarketClosed() {
        return this._subscription.isMarketClosed;
    }
    forget() {
        for (const event of Object.keys(this._callbacks)) {
            for (const callback of this._callbacks[event]) {
                this._emitter.off(event, callback);
            }
            this._callbacks[event] = [];
        }
        this._emitter.emit(Stream.EVENT_FORGET_STREAM);
    }
    onStream(callback) {
        this._callbacks[Stream.EVENT_STREAM].push(callback);
        this._emitter.on(Stream.EVENT_STREAM, callback);
    }
    onDisconnect(callback) {
        this._callbacks[Stream.EVENT_DISCONNECT].push(callback);
        this._emitter.on(Stream.EVENT_DISCONNECT, callback);
    }
    onReconnect(callback) {
        this._callbacks[Stream.EVENT_RECONNECT].push(callback);
        this._emitter.on(Stream.EVENT_RECONNECT, callback);
    }
}

class StreamManager {
    constructor(connection, defaultCount = 1000) {
        this._connection = connection;
        this._defaultCount = defaultCount;
        this._emitters = { };
        this._streamIds = { };
        this._subscriptionData = { };
        this._inProgress = { };
        this._initialize();
    }
    _initialize() {
        for (const msgType of [ConnectionManager.MSG_TICK, ConnectionManager.MSG_OHLC]) {
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
            for (const key of Object.keys(this._subscriptionData)) {
                const data = this._subscriptionData[key];
                const { ticks_history: symbol, granularity } = data.echo_req;
                const subscription = new Subscription({ symbol, granularity }, { connection: this._connection });
                subscription.subscribe();
                this._inProgress[key] = this._trackSubscription(subscription);
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
        const emitter = new EventEmitter();
        this._emitters[key] = emitter;

        subscription.response.then(() => {
            if (subscription.isMarketClosed) {
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
    subscribe({ symbol, granularity = 0 }) {
        const key = `${symbol}-${granularity}`;
        if (this._emitters[key]) {
            return this._handleExistingStream({ symbol, granularity });
        }
        return this._handleNewStream({ symbol, granularity });
    }
    historicalData({
        symbol, granularity, start, end,
    }) {
        const req = {
            ticks_history: symbol,
            end,
            start,
            adjust_start_time: 1,
            granularity,
            style: granularity ? 'candles' : 'ticks',
        };
        return this._connection.send(req);
    }
    static buildFor({ appId, endpoint, language = 'en' }) {
        const connectionManager = new ConnectionManager({ appId, endpoint, language });
        return new StreamManager(connectionManager);
    }
}

export default StreamManager;
