import EventEmitter from 'event-emitter-es6';
import PendingPromise from './PendingPromise';

class ConnectionManager extends EventEmitter {
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
    async send(data, timeout = 20000) {
        const req = Object.assign({}, data);
        req.req_id = this._counterReqId++;
        await this._connectionOpened;
        this._assertConnected();
        this._websocket.send(JSON.stringify(req));
        this._pendingRequests[req.req_id] = PendingPromise(req);
        if (timeout) {
            this._timeoutRequest(req.req_id, timeout);
        }
        return this._pendingRequests[req.req_id];
    }

    destroy() {
        this._autoReconnect = 0;
        this._websocket.close();
    }
}

export default ConnectionManager;
