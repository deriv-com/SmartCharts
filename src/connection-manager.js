import EventEmitter from 'event-emitter-es6';

function PendingPromise(data = null) {
    let resolve, reject;
    const promise = new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
    });
    promise.resolve = (data) => {
        promise.isPending = false;
        resolve(data);
    };
    promise.reject = (error) => {
        promise.isPending = false;
        reject(error);
    };
    promise.data = data;
    return promise;
}

class ConnectionManager extends EventEmitter {
    static get MSG_TICK_HISTORY() { return 'tick_history'; }
    static get MSG_TICK() { return 'tick'; }
    static get MSG_OHLC() { return 'ohlc'; }
    static get EVENT_CONNECTION_CLOSE() { return 'CONNECTION_CLOSE'; }
    static get EVENT_CONNECTION_REOPEN() { return 'CONNECTION_REOPEN'; }
    constructor({ appId, endpoint, language }) {
        super();
        this._url = `${endpoint}?l=${language}&app_id=${appId}`;
        this._counterReqId = 1;
        this._initialize();
        this._pendingRequests = { };
        this._autoReconnect = true;
    }
    _initialize() {
        this._websocket = new WebSocket(this._url);
        window.ws = this._websocket;

        this._websocket.addEventListener('open', this._onopen.bind(this));
        this._websocket.addEventListener('close', this._onclose.bind(this));
        this._websocket.addEventListener('error', this._onclose.bind(this));
        this._websocket.addEventListener('message', this._onmessage.bind(this));
        this._connectionOpened = PendingPromise();
    }
    _onopen() {
        this._connectionOpened.resolve();
    }
    _onclose() {
        if (this._connectionOpened.isPending) {
            this._connectionOpened.reject('Connection Error');
        }
        Object.keys(this._pendingRequests).forEach(req_id => this._pendingRequests[req_id]
                .reject('Connection Error'));
        this._pendingRequests = { };
        if (this._autoReconnect) {
            this._initialize();
            this._connectionOpened.then(() => {
                this.emit(ConnectionManager.EVENT_CONNECTION_REOPEN);
            });
        }
        this.emit(ConnectionManager.EVENT_CONNECTION_CLOSE);
    }
    _onmessage(message) {
        const data = JSON.parse(message.data);
        const { req_id, msg_type } = data;
        if (this._pendingRequests[req_id]) {
            this._pendingRequests[req_id].resolve(data);
            delete this._pendingRequests[req_id];
        }
        this.emit(msg_type, data);
    }
    _assertConnected() {
        ['CONNECTING', 'CLOSING', 'CLOSED'].forEach((state) => {
            if (this._websocket.readyState === WebSocket[state]) {
                throw new Error(`Websocket is ${state}`);
            }
        });
    }
    _timeoutRequest(req_id, timeout) {
        setTimeout(() => {
            if (this._pendingRequests[req_id] && this._pendingRequests[req_id].isPending) {
                this._pendingRequests[req_id].reject(new Error('Request Timeout'));
                delete this._pendingRequests[req_id];
            }
        }, timeout);
    }
    async send(data, timeout) {
        data.req_id = this._counterReqId++;
        await this._connectionOpened;
        this._assertConnected();
        this._websocket.send(JSON.stringify(data));
        this._pendingRequests[data.req_id] = PendingPromise(data);
        if (timeout) {
            this._timeoutRequest(data.req_id, timeout);
        }
        return this._pendingRequests[data.req_id];
    }

    destroy() {
        this._autoReconnect = 0;
        this._websocket.close();
    }
}

export default ConnectionManager;
