import EventEmitter from 'event-emitter-es6';

export default class Stream extends EventEmitter {
    _emitter: any;
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
        this._emitter.emit(Stream.EVENT_NO_SUBSCRIBER);
    }

    emitTick(data: any) {
        this.emit(Stream.EVENT_STREAM, data);
    }

    onNoSubscriber(callback: any) {
        this.on(Stream.EVENT_NO_SUBSCRIBER, callback);
    }

    offNoSubscriber(callback: any) {
        this.off(Stream.EVENT_NO_SUBSCRIBER, callback);
    }

    onStream(callback: any) {
        this.subscriberCount++;
        this.on(Stream.EVENT_STREAM, callback);
    }

    offStream(callback: any) {
        this.subscriberCount--;
        this.on(Stream.EVENT_STREAM, callback);
        if (this.subscriberCount === 0) {
            this.emit(Stream.EVENT_NO_SUBSCRIBER);
        }
    }
}
