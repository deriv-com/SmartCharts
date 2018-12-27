import EventEmitter from 'event-emitter-es6';
import { PendingPromise } from '@binary-com/smartcharts'; // eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved
import RobustWebsocket from './robust-websocket';

class ConnectionManager extends EventEmitter {
    static get EVENT_CONNECTION_CLOSE() { return 'CONNECTION_CLOSE'; }
    static get EVENT_CONNECTION_REOPEN() { return 'CONNECTION_REOPEN'; }

    constructor({ appId, endpoint, language }) {
        super({ emitDelay: 0 });
        this._url = `${endpoint}?l=${language}&app_id=${appId}`;
        this._counterReqId = 1;
        this._initialize();
        this._pendingRequests = { };
        this._bufferedRequests = [];
    }

    _initialize() {
        this._websocket = new RobustWebsocket(this._url, null, {
            shouldReconnect(event /* , ws */) {
                if (event.code === 1006
                && event.type === 'close') {
                    // Server websocket disconnected; reset to restore connection
                    return 0;
                }
                if (event.code === 1008
                    || event.code === 1011
                    || event.type === 'close') return;
                if (event.type === 'online') { return 0; }
                return 3000;
            },
        });

        // There's a strange bug where upon reconnection over a short period
        // the OPEN status precedes CLOSED. To circumvent this we manually
        // check the readyState when the event is fired
        const onConnectionStatusChanged = () => {
            if (this._websocket.readyState === WebSocket.OPEN) {
                this._onWsOpen();
            } else {
                this._onWsClosed();
            }
        };
        this._websocket.addEventListener('open', onConnectionStatusChanged);
        this._websocket.addEventListener('close', onConnectionStatusChanged);
        this._websocket.addEventListener('message', this._onmessage.bind(this));
    }

    onOpened(callback) {
        this.on(ConnectionManager.EVENT_CONNECTION_REOPEN, callback);
    }

    onClosed(callback) {
        this.on(ConnectionManager.EVENT_CONNECTION_CLOSE, callback);
    }

    _onWsOpen() {
        if (this._connectionOpened) {
            this._connectionOpened.resolve();
            this._connectionOpened = undefined;
        }
        this.emit(ConnectionManager.EVENT_CONNECTION_REOPEN);
        this._sendBufferedRequests();

        if (!this._pingTimer) {
            this._pingTimer = setInterval(this._pingCheck.bind(this), 15000);
        }
    }

    _pingCheck() {
        if (this._websocket.readyState === WebSocket.OPEN) {
            this.send({ ping: 1 }, 5000)
                .catch(() => {
                    if (this._websocket.readyState === WebSocket.OPEN) {
                        console.error('Server unresponsive. Creating new connection...');
                        // Reset connection if ping gets no pong from server
                        this._websocket.close();
                        this._initialize();
                    }
                });
        }
    }

    _onWsClosed() {
        if (!this._pingTimer) {
            clearInterval(this._pingTimer);
            this._pingTimer = undefined;
        }

        Object.keys(this._pendingRequests).forEach((req_id) => {
            this._bufferedRequests.push(this._pendingRequests[req_id]);
        });

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

    _sendBufferedRequests() {
        while (this._bufferedRequests.length > 0) {
            const req = this._bufferedRequests.shift();
            this.send(req.data);
        }
    }

    async send(data, timeout) {
        const req = Object.assign({}, data);
        req.req_id = req.req_id || this._counterReqId++;

        if (this._websocket.readyState !== WebSocket.OPEN) {
            if (!this._connectionOpened) {
                this._connectionOpened = new PendingPromise();
            }
            await this._connectionOpened;
        }

        this._websocket.send(JSON.stringify(req));
        if (!this._pendingRequests[data.req_id]) {
            this._pendingRequests[req.req_id] = new PendingPromise(req);
        }
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
