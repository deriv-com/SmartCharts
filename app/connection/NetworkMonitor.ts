// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '@binary-com/smartcharts' or it... Remove this comment to see the full error message
import { PendingPromise } from '@binary-com/smartcharts';
 // eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved
class NetworkMonitor {
    static _instance: any;
    _requestAPI: any;
    getTimeInterval: any;
    onStatusUpdated: any;
    status_config = {
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        online: { class: 'online', tooltip: t.translate('Online') },
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        offline: { class: 'offline', tooltip: t.translate('Offline') },
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        blinking: { class: 'blinker', tooltip: t.translate('Connecting to server') },
    };
    last_status: any;
    last_is_online: any;
    statusStarted = false;
    statusStartedPromise = new PendingPromise();
    setNetworkStatus = (status: any) => {
        const is_online = this.isOnline();
        if (status !== this.last_status || is_online !== this.last_is_online) {
            this.last_status = status;
            this.last_is_online = is_online;
            if (typeof this.onStatusUpdated === 'function')
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                {this.onStatusUpdated(this.status_config[status], is_online);}
        }
    };
    isOnline = () => navigator.onLine;
    async init(requestAPI: any, updatedCallback: any) {
        this._requestAPI = requestAPI;
        this.onStatusUpdated = updatedCallback;
        if ('onLine' in navigator) {
            window.addEventListener('online', () => {
                this.setNetworkStatus('blinking');
                this.establishConnection();
            });
            window.addEventListener('offline', () => this.setNetworkStatus('offline'));
        }
        else {
            // default to always online and fallback to WS checks
            (navigator as any).onLine = true;
        }
        this.setNetworkStatus(this.isOnline() ? 'blinking' : 'offline');
        return this.establishConnection();
    }
    async establishConnection() {
        if (!this.statusStarted && this.isOnline()) {
            this.statusStarted = true;
            clearInterval(this.getTimeInterval);
            await this.requestPing();
            this.getTimeInterval = setInterval(this.requestPing.bind(this), 30000);
        }
        else {
            return this.statusStartedPromise;
        }
    }
    async requestPing() {
        await this._requestAPI({ ping: 1 }).then(this._statusResponse);
        this.statusStartedPromise.resolve();
    }
    _statusResponse = (response: any) => {
        if (response.error) {
            this.statusStarted = false;
        }
        if (!this.statusStarted) {
            // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 0.
            this.init();
            return;
        }
        if (response.ping === 'pong') {
            this.setNetworkStatus('online');
        }
    };
    static getInstance() {
        if (!this._instance) {
            this._instance = new NetworkMonitor();
        }
        return this._instance;
    }
}
export default NetworkMonitor;
