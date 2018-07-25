import EventEmitter from 'event-emitter-es6';
import RobustWebsocket from 'robust-websocket';
import { PendingPromise } from '@binary-com/smartcharts'; // eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved

class ConnectionManager extends EventEmitter {
    static get EVENT_CONNECTION_CLOSE() { return 'CONNECTION_CLOSE'; }
    static get EVENT_CONNECTION_REOPEN() { return 'CONNECTION_REOPEN'; }

    constructor({ appId, endpoint, language }) {
        super({ emitDelay: 0 });
        this._url = `${endpoint}?l=${language}&app_id=${appId}`;
        this._counterReqId = 1;
        this._initialize();
        this._pendingRequests = { };
    }

    _initialize() {
        this._websocket = new RobustWebsocket(this._url);

        // There's a strange bug where upon reconnection over a short period
        // the OPEN status precedes CLOSED. To circumvent this we assert that
        // connection status can only go from OPEN to CLOSE and back again.
        // ...could be an issue with RobustWebsocket.
        let isConnectionOpened = false;
        const onConnectionStatusChanged = () => {
            isConnectionOpened = !isConnectionOpened;
            if (isConnectionOpened) {
                this._onopen();
            } else {
                this._onclose();
            }
        };
        this._websocket.addEventListener('open', onConnectionStatusChanged);
        this._websocket.addEventListener('close', onConnectionStatusChanged);
        this._websocket.addEventListener('message', this._onmessage.bind(this));
    }

    _onopen() {
        if (this._connectionOpened) {
            this._connectionOpened.resolve();
            this._connectionOpened = undefined;
        }
        this.emit(ConnectionManager.EVENT_CONNECTION_REOPEN);
        if (!this._pingTimer) {
            this._pingTimer = setInterval(this._pingCheck.bind(this), 15000);
        }
    }

    _pingCheck() {
        if (this._websocket.readyState === WebSocket.OPEN) {
            this.send({ ping: 1 }, 3000)
                .catch(() => {
                    console.error('Server unresponsive. Creating new connection...');
                    // Reset connection if ping gets no pong from server
                    this._websocket.close();
                    this._initialize();
                });
        }
    }

    _onclose() {
        if (!this._pingTimer) {
            clearInterval(this._pingTimer);
            this._pingTimer = undefined;
        }

        Object.keys(this._pendingRequests).forEach((req_id) => {
            this._pendingRequests[req_id].reject('Pending requests are rejected as connection is closed.');
        });
        this._pendingRequests = { };
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

    _timeoutRequest(req_id, timeout) {
        setTimeout(() => {
            if (this._pendingRequests[req_id] && this._pendingRequests[req_id].isPending) {
                this._pendingRequests[req_id].reject(new Error('Request Timeout'));
                delete this._pendingRequests[req_id];
            }
        }, timeout);
    }

    async send(data, timeout) {
        const req = Object.assign({}, data);
        req.req_id = this._counterReqId++;

        if (this._websocket.readyState !== WebSocket.OPEN) {
            if (!this._connectionOpened) {
                this._connectionOpened = new PendingPromise();
            }
            await this._connectionOpened;
        }

        this._websocket.send(JSON.stringify(req));
        this._pendingRequests[req.req_id] = new PendingPromise(req);
        if (timeout) {
            this._timeoutRequest(req.req_id, timeout);
        }
        return this._pendingRequests[req.req_id];
    }

    destroy() {
        this._websocket.close();
    }
}

export default ConnectionManager;
