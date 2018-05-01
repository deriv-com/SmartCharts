import NotificationStore from '../store/NotificationStore';
import {TickHistoryFormatter} from './TickHistoryFormatter';

class Feed {
    constructor(binaryApi, cxx, mainStore) {
        this._cxx = cxx;
        this._binaryApi = binaryApi;
        this._streams = {};
        this._mainStore = mainStore;
    }

    // although not used, subscribe is overriden so that unsubscribe will be called by ChartIQ
    subscribe() {}

    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe(symObj) {
        const key = this._getStreamKey(symObj);
        if (this._streams[key]) {
            this._binaryApi.forget(this._streams[key]);
            delete this._streams[key];
        }
    }

    _getStreamKey({ symbol, period, interval }) {
        return JSON.stringify({ symbol, period, interval });
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        const { period, interval, symbolObject } = params;
        const key = this._getStreamKey(params);
        const isComparisonChart = this._cxx.chart.symbol !== symbol;
        const comparison_chart_symbol = isComparisonChart ? symbol : undefined;

        let cb = undefined;
        const history = await new Promise((resolve) => {
            const processTick = (comparisonSymbol) => {
                let hasHistory = false;
                return response => {
                    if (hasHistory) {
                        const quotes = [TickHistoryFormatter.formatTick(response)];

                        if (comparisonSymbol) {
                            CIQ.addMemberToMasterdata({
                                stx: this._cxx,
                                label: comparisonSymbol,
                                data: quotes,
                                createObject: true,
                            });
                        } else {
                            this._cxx.updateChartData(quotes);
                        }
                    }
                    resolve(response);
                    hasHistory = true;
                };
            };
            cb = processTick(comparison_chart_symbol);
            this._binaryApi.subscribe({
                symbol,
                granularity: Feed.calculateGranularity(period, interval),
            }, cb, 20000);
        });

        this._streams[key] = cb;

        // Clear all notifications related to active symbols
        this._mainStore.notification.removeByCategory('activesymbol');

        try {
            const response = history;
            const quotes = TickHistoryFormatter.formatHistory(response);

            // if(stream.isMarketClosed) {
            //     this._mainStore.notification.notify({
            //         text: t.translate('[symbol] market is presently closed.', { symbol: symbolObject.name }),
            //         category: 'activesymbol',
            //     });
            // }

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
