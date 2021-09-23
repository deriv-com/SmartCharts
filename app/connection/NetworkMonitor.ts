import { PendingPromise } from '@binary-com/smartcharts';
// eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved
class NetworkMonitor {
    static _instance: any;
    _requestAPI: any;
    getTimeInterval: any;
    onStatusUpdated: any;
    status_config = {
        online: { class: 'online', tooltip: t.translate('Online') },
        offline: { class: 'offline', tooltip: t.translate('Offline') },
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
            if (typeof this.onStatusUpdated === 'function') {
                const status_config = this.status_config;
                this.onStatusUpdated(this.status_config[status as keyof typeof status_config], is_online);
            }
        }
    };
    isOnline = () => navigator.onLine;
    async init(requestAPI?: any, updatedCallback?: any) {
        this._requestAPI = requestAPI;
        this.onStatusUpdated = updatedCallback;
        if ('onLine' in navigator) {
            window.addEventListener('online', () => {
                this.setNetworkStatus('blinking');
                this.establishConnection();
            });
            window.addEventListener('offline', () => this.setNetworkStatus('offline'));
        } else {
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
        } else {
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
