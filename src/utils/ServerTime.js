import { getUTCEpoch, getLocalDate, getUTCDate } from './index';

class ServerTime {
    clockStarted = false;

    constructor(api) {
        this._api = api;
        this.init();
    }

    init() {
        if (!this.clockStarted) {
            clearInterval(this.getTimeInterval);
            this.requestTime();
            this.getTimeInterval = setInterval(this.requestTime.bind(this), 30000);
            this.clockStarted = true;
        }
    }

    async requestTime() {
        this.clientTimeAtRequest = getUTCEpoch(new Date());
        await this._api.getServerTime().then(this._timeResponse);
    }

    _timeResponse = (response) => {
        if (response.error) {
            this.clockStarted = false;
        }

        if (!this.clockStarted) {
            this.init();
            return;
        }

        const serverTime = response.time;

        const updateTime = () => {
            const clientTimeAtResponse = getUTCEpoch(new Date());
            this.serverTimeAtResponse = (serverTime + clientTimeAtResponse - this.clientTimeAtRequest);
        };

        clearInterval(this.updateTimeInterval);
        updateTime();
        this.updateTimeInterval = setInterval(updateTime, 1000);
    }

    getEpoch() {
        return this.serverTimeAtResponse ? this.serverTimeAtResponse :  getUTCEpoch(new Date());
    }

    getLocalDate() {
        return getLocalDate(this.getEpoch());
    }

    getUTCDate() {
        return new Date(getUTCDate(this.getEpoch()));
    }
}

export default ServerTime;
