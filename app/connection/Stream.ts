import { TicksStreamResponse } from '@deriv/api-types';
import EventEmitter from 'event-emitter-es6';
import { Listener } from 'src/types';

export default class Stream extends EventEmitter {
    _emitter?: EventEmitter;
    static get EVENT_STREAM() {
        return 'EVENT_STREAM';
    }
    static get EVENT_NO_SUBSCRIBER() {
        return 'EVENT_NO_SUBSCRIBER';
    }

    subscriberCount = 0;

    constructor() {
        super({ emitDelay: 0 });
    }

    forget() {
        this.off(Stream.EVENT_STREAM);
        this._emitter?.emit(Stream.EVENT_NO_SUBSCRIBER);
    }

    emitTick(data: TicksStreamResponse) {
        this.emit(Stream.EVENT_STREAM, data);
    }

    onNoSubscriber(callback: Listener) {
        this.on(Stream.EVENT_NO_SUBSCRIBER, callback);
    }

    offNoSubscriber(callback: Listener) {
        this.off(Stream.EVENT_NO_SUBSCRIBER, callback);
    }

    onStream(callback: Listener) {
        this.subscriberCount++;
        this.on(Stream.EVENT_STREAM, callback);
    }

    offStream(callback: Listener) {
        this.subscriberCount--;
        this.on(Stream.EVENT_STREAM, callback);
        if (this.subscriberCount === 0) {
            this.emit(Stream.EVENT_NO_SUBSCRIBER);
        }
    }
}
