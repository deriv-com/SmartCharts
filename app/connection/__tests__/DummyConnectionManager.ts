import { TicksStreamResponse } from '@deriv/api-types';
import EventEmitter from 'event-emitter-es6';
import sinon from 'sinon';
import { IPendingPromise, Listener, TBinaryAPIResponse } from 'src/types';
import PendingPromise from '../../../src/utils/PendingPromise';

export class DummyConnectionManager extends EventEmitter {
    pendingRequest: null | IPendingPromise<TBinaryAPIResponse, void> = null;
    constructor() {
        super({ emitDelay: 0 });
        this.send = sinon.fake(this.send.bind(this));
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onOpened() {}

    onClosed(cb: Listener) {
        this.on('close', cb);
    }

    close() {
        this.emit('close');
    }

    _response: TBinaryAPIResponse | null = null;

    set response(val: TBinaryAPIResponse) {
        if (!this._response && this.pendingRequest) {
            this.pendingRequest.resolve(val);
            this.pendingRequest = null;
        }

        this._response = val;
    }

    send() {
        if (!this._response && !this.pendingRequest) {
            this.pendingRequest = PendingPromise<TBinaryAPIResponse, void>();
            return this.pendingRequest;
        }

        return Promise.resolve(this._response);
    }

    emitTick(response: TicksStreamResponse) {
        const { tick } = response;
        this.emit(tick ? 'tick' : 'ohlc', response);
    }
}
