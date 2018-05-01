export default class Stream {
    static get EVENT_STREAM() {
        return 'EVENT_STREAM';
    }

    static get EVENT_DISCONNECT() {
        return 'EVENT_DISCONNECT';
    }

    static get EVENT_RECONNECT() {
        return 'EVENT_RECONNECT';
    }

    static get EVENT_REMEMBER_STREAM() {
        return 'EVENT_REMEMBER_STREAM';
    }

    static get EVENT_FORGET_STREAM() {
        return 'EVENT_FORGET_STREAM';
    }

    constructor(
        subscription,
        emitter,
    ) {
        this._subscription = subscription;
        this._emitter = emitter;
        this._callbacks = {
            [Stream.EVENT_STREAM]: [],
            [Stream.EVENT_RECONNECT]: [],
            [Stream.EVENT_DISCONNECT]: [],
        };
        this._emitter.emit(Stream.EVENT_REMEMBER_STREAM);
    }

    get response() {
        return this._subscription.response;
    }

    forget() {
        for (const event of Object.keys(this._callbacks)) {
            for (const callback of this._callbacks[event]) {
                this._emitter.off(event, callback);
            }
            this._callbacks[event] = [];
        }
        this._emitter.emit(Stream.EVENT_FORGET_STREAM);
    }

    onStream(callback) {
        this._callbacks[Stream.EVENT_STREAM].push(callback);
        this._emitter.on(Stream.EVENT_STREAM, callback);
    }

    onDisconnect(callback) {
        this._callbacks[Stream.EVENT_DISCONNECT].push(callback);
        this._emitter.on(Stream.EVENT_DISCONNECT, callback);
    }

    onReconnect(callback) {
        this._callbacks[Stream.EVENT_RECONNECT].push(callback);
        this._emitter.on(Stream.EVENT_RECONNECT, callback);
    }
}
