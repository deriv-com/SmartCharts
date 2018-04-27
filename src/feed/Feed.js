import NotificationStore from '../store/NotificationStore';
import {TickHistoryFormatter} from './TickHistoryFormatter';

class Feed {
    constructor(streamManager, cxx, mainStore) {
        this._cxx = cxx;
        this._streamManager = streamManager;
        this._streams = {};
        this._mainStore = mainStore;
    }

    // although not used, subscribe is overriden so that unsubscribe will be called by ChartIQ
    subscribe() {}

    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe(symObj) {
        const key = this._getStreamKey(symObj);
        if (this._streams[key]) {
            this._streams[key].forget();
            delete this._streams[key];
        }
    }

    _getStreamKey({ symbol, period, interval }) {
        return JSON.stringify({ symbol, period, interval });
    }

    _trackStream(stream, comparison_chart_symbol) {
        stream.onStream((response) => {
            const quotes = [TickHistoryFormatter.formatTick(response)];

            if (comparison_chart_symbol) {
                CIQ.addMemberToMasterdata({
                    stx: this._cxx,
                    label: comparison_chart_symbol,
                    data: quotes,
                    createObject: true,
                });
            } else {
                this._cxx.updateChartData(quotes);
            }
        });
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        const { period, interval, symbolObject } = params;
        const key = this._getStreamKey(params);

        const stream = this._streams[key] || this._streamManager.subscribe({
            symbol,
            granularity: Feed.calculateGranularity(period, interval),
        });

        const isComparisonChart = this._cxx.chart.symbol !== symbol;
        this._trackStream(stream, isComparisonChart ? symbol : undefined);
        this._streams[key] = stream;

        // Clear all notifications related to active symbols
        this._mainStore.notification.removeByCategory('activesymbol');

        try {
            const response = await stream.response;
            const quotes = TickHistoryFormatter.formatHistory(response);

            if(stream.isMarketClosed) {
                this._mainStore.notification.notify({
                    text: t.translate('[symbol] market is presently closed.', { symbol: symbolObject.name }),
                    category: 'activesymbol',
                });
            }

            callback({ quotes });
            this._mainStore.chart.isChartAvailable = true;
        } catch (err) {
            this._streams[key].forget();
            delete this._streams[key];
            if (err.response && err.response.error.code === 'StreamingNotAllowed'){
                this._mainStore.chart.isChartAvailable = false;
                this._mainStore.notification.notify({
                    text: t.translate('Streaming for [symbol] is not available due to license restrictions', { symbol: symbolObject.name }),
                    type: NotificationStore.TYPE_ERROR,
                    category: 'activesymbol',
                });
                callback({ quotes: [] });
            } else {
                console.error(err);
                callback({ error: err });
            }
        }
    }

    async fetchPaginationData(symbol, suggestedStartDate, endDate, params, callback) {
        const start = suggestedStartDate.getTime() / 1000;
        const end = endDate.getTime() / 1000;
        const now = (new Date().getTime() / 1000) | 0;
        const startLimit = now - (2.8 * 365 * 24 * 60 * 60);
        const { period, interval } = params;

        let result = { quotes: [] };
        if (end > startLimit) {
            try {
                const response = await this._streamManager.historicalData({
                    symbol,
                    granularity: Feed.calculateGranularity(period, interval),
                    start: Math.max(start, startLimit),
                    end,
                });
                result.quotes = TickHistoryFormatter.formatHistory(response);
            } catch (err) {
                console.error(err); // eslint-disable-line
                result.quotes = { error: err };
            }
        }

        callback(result);
    }

    static calculateGranularity(period, interval) {
        const toSeconds = {
            second: 0,
            minute: 60,
            day: 24 * 60 * 60,
        };

        return toSeconds[interval] * period;
    }
}


export default Feed;
