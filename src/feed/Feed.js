import EventEmitter from 'event-emitter-es6';
import NotificationStore from '../store/NotificationStore';
import { TickHistoryFormatter } from './TickHistoryFormatter';
import PendingPromise from '../utils/PendingPromise';
import { getUTCEpoch } from '../utils';

class Feed {
    static get EVENT_MASTER_DATA_UPDATE() { return 'EVENT_MASTER_DATA_UPDATE'; }
    static get EVENT_COMPARISON_DATA_UPDATE() { return 'EVENT_COMPARISON_DATA_UPDATE'; }

    constructor(binaryApi, stx, mainStore) {
        this._stx = stx;
        this._binaryApi = binaryApi;
        this._callbacks = {};
        this._lastStreamEpoch = {};
        this._mainStore = mainStore;
        this._emitter = new EventEmitter({ emitDelay: 0 });
        this._isConnectionOpened = true;
    }

    // although not used, subscribe is overridden so that unsubscribe will be called by ChartIQ
    subscribe() {}

    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe({ symbol, period, interval }) {
        const granularity = Feed.calculateGranularity(period, interval);
        const key = `${symbol}-${granularity}`;
        if (this._callbacks[key]) {
            this._binaryApi.forget({
                symbol,
                granularity,
            }, this._callbacks[key]);
            delete this._callbacks[key];
        }
    }

    _getProcessTickHistoryClosure(key, comparisonChartSymbol) {
        let hasHistory = false;
        const tickHistoryPromise = new PendingPromise();
        const processTickHistory = (resp) => {
            // We assume that 1st response is the history, and subsequent
            // responses are tick stream data.
            if (hasHistory) {
                this._appendTick(resp, key, comparisonChartSymbol);
                return;
            }
            this._lastStreamEpoch[key] = Feed.getLatestEpoch(resp);
            tickHistoryPromise.resolve(resp);
            hasHistory = true;
        };
        return [tickHistoryPromise, processTickHistory];
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        const { period, interval, symbolObject } = params;
        const granularity = Feed.calculateGranularity(period, interval);
        const key = `${symbol}-${granularity}`;
        const isComparisonChart = this._stx.chart.symbol !== symbol;
        const comparisonChartSymbol = isComparisonChart ? symbol : undefined;

        const dataRequest = {
            symbol,
            granularity,
        };

        const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure(key, comparisonChartSymbol);
        this._binaryApi.subscribeTickHistory(dataRequest, processTickHistory);
        let response = await tickHistoryPromise;

        // Clear all notifications related to active symbols
        this._mainStore.notification.removeByCategory('activesymbol');

        if (response.error) {
            const errorCode = response.error.code;
            const tParams = { symbol: symbolObject.name };
            if (/^(MarketIsClosed|NoRealtimeQuotes)$/.test(errorCode)) {
                // Although market is closed, we display the past tick history data
                response = await this._binaryApi.getTickHistory(dataRequest);
                this._mainStore.notification.notify({
                    text: t.translate('[symbol] market is presently closed.', tParams),
                    category: 'activesymbol',
                });
            } else if (errorCode === 'StreamingNotAllowed') {
                this._mainStore.notification.notify({
                    text: t.translate('Streaming for [symbol] is not available due to license restrictions', tParams),
                    type: NotificationStore.TYPE_ERROR,
                    category: 'activesymbol',
                });
                let dataCallback = { quotes: [] };
                if (isComparisonChart) {
                    // Passing error will prevent the chart from being shown; for
                    // main chart we still want the chart to be shown, just disabled
                    dataCallback = { error: errorCode, suppressAlert: true, ...dataCallback };
                } else {
                    this._mainStore.chart.setChartAvailability(false);
                }
                callback(dataCallback);
                return;
            }
        } else {
            this._callbacks[key] = processTickHistory;
        }

        const quotes = TickHistoryFormatter.formatHistory(response);
        if (!quotes) {
            console.error('Unexpected response: ', response);
            return;
        }

        callback({ quotes });
        if (!isComparisonChart) {
            this._emitter.emit(Feed.EVENT_MASTER_DATA_UPDATE, {
                ...quotes[quotes.length - 1],
                prevClose: quotes[quotes.length - 2].Close,
            });
            this._mainStore.chart.setChartAvailability(true);
        } else {
            this._emitter.emit(Feed.EVENT_COMPARISON_DATA_UPDATE);
        }
    }

    async fetchPaginationData(symbol, suggestedStartDate, endDate, params, callback) {
        const start = getUTCEpoch(suggestedStartDate);
        const end   = getUTCEpoch(endDate);
        const now   = getUTCEpoch(new Date());
        const startLimit = now - (2.8 * 365 * 24 * 60 * 60);
        const { period, interval } = params;

        const result = { quotes: [] };
        if (end > startLimit) {
            try {
                const response = await this._binaryApi.getTickHistory({
                    symbol,
                    granularity: Feed.calculateGranularity(period, interval),
                    start: Math.max(start, startLimit),
                    end,
                });
                result.quotes = TickHistoryFormatter.formatHistory(response);
            } catch (err) {
                console.error(err);
                result.quotes = { error: err };
            }
        }

        callback(result);
    }

    unsubscribeAll() {
        for (const key in this._callbacks) {
            const { symbol, period, interval } = JSON.parse(key);
            this._binaryApi.forget({
                symbol,
                granularity: Feed.calculateGranularity(period, interval),
            }, this._callbacks[key]);
        }
    }

    _appendTick(resp, key, comparisonChartSymbol) {
        this._lastStreamEpoch[key] = Feed.getEpochFromTick(resp);
        const quotes = [TickHistoryFormatter.formatTick(resp)];

        this._updateChartData(quotes, comparisonChartSymbol);
    }

    _appendHistory(resp, key, comparisonChartSymbol) {
        this._lastStreamEpoch[key] = Feed.getLatestEpoch(resp);
        const quotes = TickHistoryFormatter.formatHistory(resp);

        this._updateChartData(quotes, comparisonChartSymbol);
    }

    _updateChartData(quotes, comparisonChartSymbol) {
        if (comparisonChartSymbol) {
            this._stx.updateChartData(quotes, null, {
                useAsLastSale: true,
                secondarySeries: comparisonChartSymbol,
            });
            this._emitter.emit(Feed.EVENT_COMPARISON_DATA_UPDATE);
        } else {
            this._stx.updateChartData(quotes);
            this._emitter.emit(Feed.EVENT_MASTER_DATA_UPDATE, quotes[0]);
        }
    }

    static getEpochFromTick({ tick, ohlc }) {
        return tick ? tick.epoch : ohlc.open_time;
    }

    static getLatestEpoch({ candles, history }) {
        if (candles) {
            return candles[candles.length - 1].epoch;
        }

        const { times } = history;
        return times[times.length - 1];
    }

    static calculateGranularity(period, interval) {
        const toSeconds = {
            second: 0,
            minute: 60,
            day: 24 * 60 * 60,
        };

        return toSeconds[interval] * period;
    }

    onMasterDataUpdate(callback) {
        this._emitter.on(Feed.EVENT_MASTER_DATA_UPDATE, callback);
    }

    onComparisonDataUpdate(callback) {
        this._emitter.on(Feed.EVENT_COMPARISON_DATA_UPDATE, callback);
    }

    setConnectionOpened(isOpened) {
        if (isOpened === this._isConnectionOpened) { return; }

        this._isConnectionOpened = isOpened;
        if (isOpened) {
            this._onConnectionReopened();
        } else {
            this._onConnectionClosed();
        }
    }

    _onConnectionClosed() {
        this._connectionClosedDate = new Date();

        // Forget calls are not necessary; streams are lost when connection is closed
        // this._callbacks = {};
    }

    _onConnectionReopened() {
        const elapsedTime = new Date() - this._connectionClosedDate;
        const keys = Object.keys(this._lastStreamEpoch);
        const granularity = +keys[0].split('-')[1];
        const isNeedRefreshChart = elapsedTime > 100000;
        if (isNeedRefreshChart) {
            this._callbacks = {}; // We don't need to send forget requests for a new connection
            this._mainStore.chart.refreshChart();
        } else {
            // patch missing data...
            for (const key of keys) {
                const [symbol] = key.split('-');
                const comparisonChartSymbol = (this._stx.chart.symbol !== symbol) ? symbol : undefined;
                const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure(key, comparisonChartSymbol);
                // override the processTickHistory callback with new processTickHistory
                this._callbacks[key] = processTickHistory;
                const start = this._lastStreamEpoch[key];
                this._binaryApi.subscribeTickHistory({
                    start,
                    symbol,
                    granularity,
                }, processTickHistory);
                tickHistoryPromise.then((resp) => {
                    this._appendHistory(resp, key, comparisonChartSymbol);
                });
            }
        }
    }
}


export default Feed;
