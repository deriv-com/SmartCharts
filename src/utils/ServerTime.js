import { getUTCEpoch } from './index';

class ServerTime {
    constructor(api) {
        this._api = api;
    }

    async get() {
        this.client_time_at_request = getUTCEpoch(new Date());
        const time = await this._api.getServerTime().then(this._timeResponse);
        return time;
    }

    _timeResponse = (response) => {
        if (response.error) return getUTCEpoch(new Date());

        const serverTime = response.time;
        const client_time_at_response = getUTCEpoch(new Date());
        const server_time_at_response = ((serverTime) + (client_time_at_response - this.client_time_at_request));

        return server_time_at_response;
    }
}

export default ServerTime;
