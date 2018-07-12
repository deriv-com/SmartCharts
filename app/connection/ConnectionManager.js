import EventEmitter from 'event-emitter-es6';
import RobustWebsocket from 'robust-websocket';
import { PendingPromise } from '@binary-com/smartcharts'; // eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved

class ConnectionManager extends EventEmitter {
    static get EVENT_CONNECTION_CLOSE() { return 'CONNECTION_CLOSE'; }
    static get EVENT_CONNECTION_REOPEN() { return 'CONNECTION_REOPEN'; }
    openPromises = [];

    constructor({ appId, endpoint, language }) {
        super({ emitDelay: 0 });
        this._url = `${endpoint}?l=${language}&app_id=${appId}`;
        this._counterReqId = 1;
        this._initialize();
        this._pendingRequests = { };
    }

    _initialize() {
        this._websocket = new RobustWebsocket(this._url);

        this._websocket.addEventListener('open', this._onopen.bind(this));
        this._websocket.addEventListener('close', this._onclose.bind(this));
        this._websocket.addEventListener('message', this._onmessage.bind(this));
    }

    _onopen() {
        for (const promise of this.openPromises) {
            promise.resolve();
        }
        this.openPromises.length = 0; // clear array
        this.emit(ConnectionManager.EVENT_CONNECTION_REOPEN);
    }

    _onclose() {
        Object.keys(this._pendingRequests).forEach(req_id => this._pendingRequests[req_id]
            .reject('Connection Error'));
        this._pendingRequests = { };
        this.emit(ConnectionManager.EVENT_CONNECTION_CLOSE);
        this.closeTime = new Date();
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

        if (this._websocket.readyState !== 1 /* 1 == OPEN */) {
            const openPromise = new PendingPromise();
            this.openPromises.push(openPromise);
            await openPromise;
        }

        this._websocket.send(JSON.stringify(req));
        this._pendingRequests[req.req_id] = PendingPromise(req);
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
