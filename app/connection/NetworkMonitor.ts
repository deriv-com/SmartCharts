import { PendingPromise } from '@deriv-com/smartcharts';
import { PingResponse } from '@deriv/api-types';
import { TNetworkConfig, TRequestAPI } from 'src/types';
// eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved

type TOnStatusUpdated = (config: TNetworkConfig, is_online: boolean) => void;

class NetworkMonitor {
    static _instance: NetworkMonitor;
    _requestAPI?: TRequestAPI | null;
    getTimeInterval?: ReturnType<typeof setInterval>;
    onStatusUpdated?: TOnStatusUpdated;
    status_config = {
        online: { class: 'online', tooltip: t.translate('Online') },
        offline: { class: 'offline', tooltip: t.translate('Offline') },
        blinking: { class: 'blinker', tooltip: t.translate('Connecting to server') },
    };
    last_status?: string;
    last_is_online?: boolean;
    statusStarted = false;
    statusStartedPromise = PendingPromise<void, void>();
    setNetworkStatus = (status: string) => {
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
    async init(requestAPI?: TRequestAPI | null, updatedCallback?: TOnStatusUpdated) {
        this._requestAPI = requestAPI;
        this.onStatusUpdated = updatedCallback;
        if ('onLine' in navigator) {
            window.addEventListener('online', () => {
                this.setNetworkStatus('blinking');
                this.establishConnection();
            });
            window.addEventListener('offline', () => this.setNetworkStatus('offline'));
        }
        this.setNetworkStatus(this.isOnline() ? 'blinking' : 'offline');
        return this.establishConnection();
    }
    async establishConnection() {
        if (!this.statusStarted && this.isOnline()) {
            this.statusStarted = true;
            clearInterval(this.getTimeInterval as NodeJS.Timeout);
            await this.requestPing();
            this.getTimeInterval = setInterval(this.requestPing.bind(this), 30000);
        } else {
            return this.statusStartedPromise;
        }
    }
    async requestPing() {
        await this._requestAPI?.({ ping: 1 }).then(this._statusResponse);
        this.statusStartedPromise.resolve();
    }
    _statusResponse = (response: PingResponse) => {
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
