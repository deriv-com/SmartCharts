import { ServerTimeResponse } from '@deriv/api-types';
import { BinaryAPI } from 'src/binaryapi';
import { getUTCEpoch, getLocalDate, getUTCDate } from './index';
import PendingPromise from './PendingPromise';

class ServerTime {
    static _instance: ServerTime;

    _api?: BinaryAPI;
    clientTimeAtRequest?: number;
    getTimeInterval?: ReturnType<typeof setInterval>;
    onTimeUpdated?: () => void;
    serverTimeAtResponse?: number;
    updateTimeInterval?: ReturnType<typeof setInterval>;

    clockStarted = false;
    clockStartedPromise = PendingPromise<void, void>();

    async init(api?: BinaryAPI, updatedCallback?: () => void) {
        this._api = api;
        this.onTimeUpdated = updatedCallback;
        if (!this.clockStarted) {
            this.clockStarted = true;

            if (this.getTimeInterval) {
                clearInterval(this.getTimeInterval);
            }
            await this.requestTime();
            this.getTimeInterval = setInterval(this.requestTime.bind(this), 30000);
        } else {
            return this.clockStartedPromise;
        }
    }

    async requestTime() {
        this.clientTimeAtRequest = getUTCEpoch(new Date());
        if (this.serverTimeAtResponse) {
            // it is not the first time
            await this._api?.getServerTime().then(this._timeResponse);
        } else {
            // it is the first time
            // to boot up the speed, at the beginig
            // we use the user time
            this._timeResponse({
                time: Math.floor(new Date().getTime() / 1000),
            });
        }
        this.clockStartedPromise.resolve();
    }

    _timeResponse = (response: ServerTimeResponse | { time: number }) => {
        if ('msg_type' in response && response.error) {
            this.clockStarted = false;
        }

        if (!this.clockStarted) {
            this.init();
            return;
        }

        const serverTime = response.time;
        const clientTimeAtResponse = getUTCEpoch(new Date());

        if (serverTime && this.clientTimeAtRequest) {
            this.serverTimeAtResponse = serverTime + (clientTimeAtResponse - this.clientTimeAtRequest) / 2;
        }

        const updateTime = () => {
            if (this.serverTimeAtResponse) this.serverTimeAtResponse += 1;

            if (typeof this.onTimeUpdated === 'function') {
                this.onTimeUpdated();
            }
        };

        if (this.updateTimeInterval) {
            clearInterval(this.updateTimeInterval);
        }
        this.updateTimeInterval = setInterval(updateTime, 1000);
    };

    getEpoch() {
        if (this.serverTimeAtResponse) {
            return this.serverTimeAtResponse;
        }

        throw new Error('Server time is undefined!');
    }

    getLocalDate() {
        return getLocalDate(this.getEpoch());
    }

    getUTCDate() {
        return CIQ.strToDateTime(getUTCDate(this.getEpoch()));
    }

    static getInstance() {
        if (!this._instance) {
            this._instance = new ServerTime();
        }

        return this._instance;
    }
}

export default ServerTime;
