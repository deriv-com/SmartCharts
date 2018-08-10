import EventEmitter from 'event-emitter-es6';
import { TickHistoryFormatter } from './TickHistoryFormatter';
import PendingPromise from '../utils/PendingPromise';
import { calculateGranularity, getUTCEpoch } from '../utils';

class Feed {
    static get EVENT_MASTER_DATA_UPDATE() { return 'EVENT_MASTER_DATA_UPDATE'; }

    static get EVENT_COMPARISON_DATA_UPDATE() { return 'EVENT_COMPARISON_DATA_UPDATE'; }

    static get EVENT_ON_PAGINATION() { return 'EVENT_ON_PAGINATION'; }

    startEpoch;

    endEpoch;

    constructor(binaryApi, stx, mainStore) {
        this._stx = stx;
        this._binaryApi = binaryApi;
        this._activeStreams = {};
        this._lastStreamEpoch = {};
        this._mainStore = mainStore;
        this._emitter = new EventEmitter({ emitDelay: 0 });
        this._isConnectionOpened = true;
    }

    // although not used, subscribe is overridden so that unsubscribe will be called by ChartIQ
    subscribe() {}

    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe({ symbol, period, interval }) {
        const granularity = calculateGranularity(period, interval);
        const key = this._getKey({ symbol, granularity });
        this._forgetStream(key);
    }

    _forgetStream(key) {
        const { symbol, granularity } = this._unpackKey(key);
        if (this._activeStreams[key]) {
            this._binaryApi.forget({
                symbol,
                granularity,
            });
            delete this._activeStreams[key];
        }

        if (this._lastStreamEpoch[key]) {
            delete this._lastStreamEpoch[key];
        }
    }

    _getProcessTickHistoryClosure(key, comparisonChartSymbol) {
        let hasHistory = false;
        const tickHistoryPromise = new PendingPromise();
        const processTickHistory = (resp) => {
            if (this._stx.isDestroyed) {
                console.error('No data should be coming in when chart is destroyed!');
                return;
            }
            // We assume that 1st response is the history, and subsequent
            // responses are tick stream data.
            if (hasHistory) {
                this._appendTick(resp, key, comparisonChartSymbol);
                return;
            }
            const lastEpoch = Feed.getLatestEpoch(resp);
            if (lastEpoch) { // on errors, lastEpoch can be undefined
                this._lastStreamEpoch[key] = lastEpoch;
            }
            tickHistoryPromise.resolve(resp);
            hasHistory = true;
        };
        return [tickHistoryPromise, processTickHistory];
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        const { period, interval, symbolObject } = params;
        const granularity = calculateGranularity(period, interval);
        const key = this._getKey({ symbol, granularity });

        const isComparisonChart = this._stx.chart.symbol !== symbol;
        let start = this.startEpoch || (suggestedStartDate / 1000 | 0);
        const end = this.endEpoch;
        const date = new Date();
        const now = (date.getTime() / 1000) | 0;
        if (isComparisonChart) {
            // Strange issue where comparison series is offset by timezone...
            start -= suggestedStartDate.getTimezoneOffset() * 60;
        }
        const comparisonChartSymbol = isComparisonChart ? symbol : undefined;

        const tickHistoryRequest = {
            start,
            symbol,
            granularity,
        };

        let tickHistoryPromise, processTickHistory;
        if (end && now > end) { // end is in the past; no streaming required
            tickHistoryRequest.end = end;
            tickHistoryPromise = this._binaryApi.getTickHistory(tickHistoryRequest);
        } else {
            [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure(key, comparisonChartSymbol);
            this._binaryApi.subscribeTickHistory(tickHistoryRequest, processTickHistory);
        }

        let response = await tickHistoryPromise;

        if (response.error) {
            const errorCode = response.error.code;
            const tParams = { symbol: symbolObject.name };
            if (/^(MarketIsClosed|NoRealtimeQuotes)$/.test(errorCode)) {
                // Although market is closed, we display the past tick history data
                response = await this._binaryApi.getTickHistory(tickHistoryRequest);
                this._mainStore.chart.notify({
                    text: t.translate('[symbol] market is presently closed.', tParams),
                    category: 'activesymbol',
                });
            } else if (errorCode === 'StreamingNotAllowed') {
                this._mainStore.chart.notify({
                    text: t.translate('Streaming for [symbol] is not available due to license restrictions', tParams),
                    type: 'error',
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
        } else if (processTickHistory) {
            this._activeStreams[key] = true;
        }

        const quotes = TickHistoryFormatter.formatHistory(response);
        if (!quotes) {
            console.error('Unexpected response: ', response);
            return;
        }

        callback({ quotes });
        if (!isComparisonChart) {
            const prev = quotes[quotes.length - 2];
            const prevClose = (prev !== undefined) ? prev.Close : undefined;
            this._emitter.emit(Feed.EVENT_MASTER_DATA_UPDATE, {
                ...quotes[quotes.length - 1],
                prevClose,
            });
            this._mainStore.chart.setChartAvailability(true);
        } else {
            this._emitter.emit(Feed.EVENT_COMPARISON_DATA_UPDATE);
        }
    }

    async fetchPaginationData(symbol, suggestedStartDate, endDate, params, callback) {
        const end   = getUTCEpoch(endDate);
        const start = getUTCEpoch(suggestedStartDate);
        const { period, interval } = params;
        const granularity = calculateGranularity(period, interval);

        await this._getPaginationData(symbol, granularity, start, end, callback);
    }

    async _getPaginationData(symbol, granularity, start, end, callback) {
        if (this.startEpoch && start < this.startEpoch) {
            callback({ moreAvailable: false, quotes: [] });
            return;
        }

        const now   = getUTCEpoch(new Date());
        // Tick history data only goes as far back as 3 years:
        const startLimit = now - (2.8 * 365 * 24 * 60 * 60 /* == 3 Years */);
        let result = { quotes: [] };
        if (end > startLimit) {
            try {
                const response = await this._binaryApi.getTickHistory({
                    symbol,
                    granularity,
                    start: Math.max(start, startLimit),
                    end,
                });
                const firstEpoch = Feed.getFirstEpoch(response);
                if (firstEpoch === undefined || firstEpoch === end) {
                    const newStart = start - (end - start);
                    if (newStart <= startLimit) {
                        // Passed available range. Prevent anymore pagination requests:
                        callback({ moreAvailable: false, quotes: [] });
                        return;
                    }
                    // Recursively extend the date range for more data until we exceed available range
                    await this._getPaginationData(symbol, granularity, newStart, end, callback);
                    return;
                }
                result.quotes = TickHistoryFormatter.formatHistory(response);
            } catch (err) {
                console.error(err);
                result = { error: err };
            }
        }

        callback(result);
        const isMainChart = this._stx.chart.symbol === symbol;
        if (isMainChart) { // ignore comparisons
            this._emitter.emit(Feed.EVENT_ON_PAGINATION, { start, end });
        }
    }

    unsubscribeAll() {
        for (const key of Object.keys(this._activeStreams)) {
            this._forgetStream(key);
        }
    }

    _appendTick(resp, key, comparisonChartSymbol) {
        const lastEpoch = +Feed.getEpochFromTick(resp);
        if (this.endEpoch && lastEpoch > this.endEpoch) {
            this._forgetStream(key);
        }

        this._lastStreamEpoch[key] = lastEpoch;
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
                secondarySeries: comparisonChartSymbol,
                noCreateDataSet: true,
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

    static getFirstEpoch({ candles, history }) {
        if (candles && candles.length > 0) {
            return candles[0].epoch;
        } if (history && history.times.length > 0) {
            const { times } = history;
            return +times[0];
        }
    }

    static getLatestEpoch({ candles, history }) {
        if (candles) {
            return candles[candles.length - 1].epoch;
        } if (history) {
            const { times } = history;
            return times[times.length - 1];
        }
    }

    onMasterDataUpdate(callback) {
        this._emitter.on(Feed.EVENT_MASTER_DATA_UPDATE, callback);
    }

    onComparisonDataUpdate(callback) {
        this._emitter.on(Feed.EVENT_COMPARISON_DATA_UPDATE, callback);
    }

    onPagination(callback) {
        this._emitter.on(Feed.EVENT_ON_PAGINATION, callback);
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
        this._activeStreams = {}; // prevent forget requests; active streams are invalid when connection closed
        this._connectionClosedDate = new Date();
    }

    _onConnectionReopened() {
        const keys = Object.keys(this._lastStreamEpoch);
        if (keys.length === 0) { return; }
        const { granularity } = this._unpackKey(keys[0]);
        const elapsedSeconds = (new Date() - this._connectionClosedDate) / 1000 | 0;
        const maxIdleSeconds = (granularity || 1) * this._stx.chart.maxTicks;
        if (elapsedSeconds >= maxIdleSeconds) {
            this._mainStore.chart.refreshChart();
        } else {
            for (const key of keys) {
                const startEpoch = this._lastStreamEpoch[key];
                this._resumeStream(key, startEpoch);
            }
        }
        this._connectionClosedDate = undefined;
    }

    _resumeStream(key, start) {
        if (this._activeStreams[key]) {
            throw new Error('You cannot resume an active stream!');
        }
        const { symbol, granularity } = this._unpackKey(key);
        const comparisonChartSymbol = (this._stx.chart.symbol !== symbol) ? symbol : undefined;
        const [tickHistoryPromise, processTickHistory] = this._getProcessTickHistoryClosure(key, comparisonChartSymbol);
        this._activeStreams[key] = true;
        this._binaryApi.subscribeTickHistory({
            start,
            symbol,
            granularity,
        }, processTickHistory);
        tickHistoryPromise.then((resp) => {
            this._appendHistory(resp, key, comparisonChartSymbol);
        });
    }

    _getKey({ symbol, granularity }) {
        return `${symbol}-${granularity}`;
    }

    _unpackKey(key) {
        const [symbol, granularity] = key.split('-');
        return { symbol, granularity: +granularity };
    }
}


export default Feed;
