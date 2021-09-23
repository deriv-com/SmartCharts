import EventEmitter from 'event-emitter-es6';
import sinon from 'sinon';
import PendingPromise from '../../../src/utils/PendingPromise';

export class DummyConnectionManager extends EventEmitter {
    pendingRequest: any;
    constructor() {
        super({ emitDelay: 0 });
        this.send = sinon.fake(this.send.bind(this));
    }

    onOpened() {}

    onClosed(cb: any) {
        this.on('close', cb);
    }

    close() {
        this.emit('close');
    }

    _response = null;

    set response(val: any) {
        if (!this._response && this.pendingRequest) {
            this.pendingRequest.resolve(val);
            this.pendingRequest = null;
        }

        this._response = val;
    }

    send(request: any) {
        if (!this._response && !this.pendingRequest) {
            this.pendingRequest = PendingPromise();
            return this.pendingRequest;
        }

        return Promise.resolve(this._response);
    }

    emitTick(response: any) {
        const { tick } = response;
        this.emit(tick ? 'tick' : 'ohlc', response);
    }
}
