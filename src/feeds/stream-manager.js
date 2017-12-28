import ConnectionManager from './connection-manager.js';
import EventEmitter from 'event-emitter-es6';

const STREAM_EVENT = 'stream';
const DISCONNECT_EVENT = 'disconnect';
const RECONNECT_EVENT = 'reconnect';
const SUBSCRIBE_EVENT = 'subscribe';
const FORGET_EVENT = 'forget';

class Subscription {
    static get DEFAULT_COUNT() { return 1000; }
    static get DEFAULT_TIMEOUT() { return 20*1000; }

    constructor({symbol, granularity}, connection) {
        this._connection = connection;
        this._symbol = symbol;
        this._granularity = granularity;
        this._isMarketClosed = false;

        this._subscribe();
    }

    _subscribe() {
        const req = {
            ticks_history: this._symbol,
            end: 'latest',
            count: Subscription.DEFAULT_COUNT,
            adjust_start_time: 1,
            subscribe: 1,
            style: this._granularity ? 'candles' : 'ticks',
            granularity,
        };
        this._response = this._connection
            .send(req, Subscription.DEFAULT_TIMEOUT)
            .catch((up) => {
                if (/^(MarketIsClosed|NoRealtimeQuotes)$/.test(up.code)) {
                    this._isMarketClosed = true;
                    delete req.subscribe;
                    return this._connection.send(
                        req,
                        Subscription.DEFAULT_TIMEOUT
                    );
                }
                // else
                throw up;
            });
    }

    get response() {
        return this._response;
    }

    get isMarketClosed() {
        return this._isMarketClosed;
    }
}

class Stream extends EventEmitter {
    constructor(
        subscription,
        emitter,
    ) {
        super();
        this._subscription = subscription;
        this._emitter = emitter;
        this._callbacks = {
            [STREAM_EVENT]: [],
            [DISCONNECT_EVENT]: [],
            [FORGET_EVENT]: []
        };
        this._emitter.emit(SUBSCRIBE_EVENT);
    }

    get response() { return this._subscription.response; }
    get isMarketClosed() { return this._subscription.isMarketClosed; };

    /*
     tick": {
        "ask": "362.0119",
        "bid": "361.9719",
        "epoch": "1514364470",
        "id": "26fc332c-114d-dd3e-7cb5-af99fe15cb9b",
        "quote": "361.9919",
        "symbol": "R_50"
      }
     */


    forget() {
        for(const event of Object.keys(this._callbacks)) {
            for(const callback of this._callbacks[event]) {
                this._emitter.off(event, callback);
            }
            this._callbacks[event] = [];
        }
        this._emitter.emit(FORGET_EVENT);
    }

    onStream(callback) {
        this._callbacks.stream.push(callback);
        this._emitter.on(STREAM_EVENT, callback);
    }
    onDisconnect(callback) {
        this._callbacks.disconnect.push(callback);
        this._emitter.on(DISCONNECT_EVENT, callback);
    }
    onReconnect(callback) {
        this._callbacks.reconnect.push(callback);
        this._emitter.on(RECONNECT_EVENT, callback);
    }
}

class StreamManager {
    constructor(connection, defaultCount = 1000) {
        this._connection = connection;
        this._defaultCount = defaultCount;
        this._emitters = { };
        this._streamIds = { };

        for(const msgId of ['tick', 'ohlc']) {
            this._connection.on(msgId, (data) => {
                const {ticks_history: symbol, granularity} = data.echo_req;
                const key = `${symbol}-${granularity}`;
                if(this._emitters[key]) {
                    this._emitters[key].emit(msgId, data[msgId]);
                }
            });
        }
    }

    _handleExistingStream(stream) {
        // TODO 
    }

    _forgetStream(key) {
        // TODO
    }
    _setupEmitter(key, subscription) {
        const emitter = new EventEmitter();
        this._emitters[key] = emitter;

        subscription.response.then(() => {
            if(subscription.isMarketClosed && this._emitters[key]) {
                delete this._emitters[key];
            }
        });
        subscription.response.catch(() => {
            if(this._emitters[key]) {
                delete this._emitters[key];
            }
        });

        let subscribers = 0;
        emitter.on(SUBSCRIBE_EVENT, () => {
            ++subscribers;
        });
        emitter.on(FORGET_EVENT, () => {
            --subscribers;
            if(subscribers === 0) {
                this._forgetStream(key);
            }
        });

        return emitter;
    }
    _handleNewStream({symbol, granularity}) {
        const key = `${symbol}-${granularity}`;
        const subscription = new Subscription({symbol, granularity}, this._connection);
        const emitter = this._setupEmitter(key, subscription);

        return new Stream(response, emitter);
    }

    subscribe({symbol, granularity = 0}) {
        const key = `${symbol}-${granularity}`;
        if(this._streams[key]) {
            return this._handleExistingStream(this._streams[key]);
        }
        return this._handleNewStream({symbol, granularity});
    }
    static buildFor({appId, endpoint, language = 'en'}) {
        const connectionManager = new ConnectionManager({appId, endpoint, language});
        return new StreamManager(connectionManager);
    }
}

export default StreamManager;
