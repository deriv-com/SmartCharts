import EventEmitter from 'event-emitter-es6';
import { reaction, when } from 'mobx';
import { TickHistoryFormatter } from './TickHistoryFormatter';
import { calculateGranularity, getUTCEpoch, calculateTimeUnitInterval } from '../utils';
import { RealtimeSubscription, DelayedSubscription } from './subscription';
import ServerTime from '../utils/ServerTime';

class Feed {
    static get EVENT_MASTER_DATA_UPDATE() { return 'EVENT_MASTER_DATA_UPDATE'; }
    static get EVENT_COMPARISON_DATA_UPDATE() { return 'EVENT_COMPARISON_DATA_UPDATE'; }
    static get EVENT_ON_PAGINATION() { return 'EVENT_ON_PAGINATION'; }
    get startEpoch() { return this._mainStore.state.startEpoch; }
    get endEpoch() { return this._mainStore.state.endEpoch; }
    get granularity() { return this._mainStore.chart.granularity; }
    get context() { return this._mainStore.chart.context; }
    get loader() { return this._mainStore.loader; }
    _activeStreams = {};
    _isConnectionOpened = true;

    constructor(binaryApi, stx, mainStore, tradingTimes) {
        this._stx = stx;
        this._binaryApi = binaryApi;
        this._mainStore = mainStore;
        this._serverTime = ServerTime.getInstance();
        this._tradingTimes = tradingTimes;
        reaction(() => mainStore.state.isConnectionOpened, this.onConnectionChanged.bind(this));
        when(() => this.context, this.onContextReady);

        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    onContextReady = () => {
        reaction(() => [this.startEpoch, this.endEpoch], this.onRangeChanged);
    };

    onRangeChanged = () => {
        const now = this._serverTime.getEpoch();
        if (this.endEpoch && this.endEpoch > now) {
            // endEpoch cannot be set in the future or ChartIQ will
            // trigger a fetchInitialData request in stx.setRange
            return;
        }

        const periodicity = calculateTimeUnitInterval(this.granularity);
        const rangeTime = ((this.granularity || 1) * this._stx.chart.maxTicks);

        // If the endEpoch is undefined _and_ there are no active streams, we initiate streaming
        if (this.endEpoch === undefined) {
            if (Object.keys(this._activeStreams).length === 0) {
                // Set the end range to the future to trigger ChartIQ to start streaming
                const future = now + 10;
                const dtRight = new Date(future * 1000);
                const dtLeft =  new Date((this.startEpoch || now - rangeTime) * 1000);
                this._stx.setRange({ dtLeft, dtRight, periodicity }, () => this._stx.home());
            }
            return;
        }

        const dtLeft =  new Date((this.startEpoch || this.endEpoch - rangeTime) * 1000);
        const dtRight = new Date(this.endEpoch * 1000);
        this._stx.setRange({ dtLeft, dtRight, periodicity }, () => {
            this._stx.draw();
            this._stx.home();
        });
    };

    // although not used, subscribe is overridden so that unsubscribe will be called by ChartIQ
    subscribe() {}

    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe({ symbol, period, interval }) {
        const granularity = calculateGranularity(period, interval);
        const key = this._getKey({ symbol, granularity });
        this._forgetStream(key);
    }

    _forgetStream(key) {
        if (this._activeStreams[key]) {
            this._activeStreams[key].forget();
            delete this._activeStreams[key];
        }
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        const { period, interval, symbolObject } = params;
        const granularity = calculateGranularity(period, interval);
        const key = this._getKey({ symbol, granularity });
        const localDate = this._serverTime.getLocalDate();
        suggestedStartDate = suggestedStartDate > localDate ? localDate : suggestedStartDate;
        const isComparisonChart = this._stx.chart.symbol !== symbol;
        let start = this.startEpoch || (suggestedStartDate / 1000 | 0);
        const end = this.endEpoch;
        const now = this._serverTime.getEpoch() | 0;
        if (isComparisonChart) {
            // Strange issue where comparison series is offset by timezone...
            start -= suggestedStartDate.getTimezoneOffset() * 60;
        }
        const comparisonChartSymbol = isComparisonChart ? symbol : undefined;
        const symbolName = symbolObject.name;
        this.loader.setState('chart-data');

        if (this._tradingTimes.isFeedUnavailable(symbol)) {
            this._mainStore.notifier.notifyFeedUnavailable(symbolName);
            let dataCallback = { quotes: [] };
            if (isComparisonChart) {
                // Passing error will prevent the chart from being shown; for
                // main chart we still want the chart to be shown, just disabled
                dataCallback = { error: 'StreamingNotAllowed', suppressAlert: true, ...dataCallback };
            } else {
                this._mainStore.chart.setChartAvailability(false);
            }
            callback(dataCallback);
            return;
        }

        const tickHistoryRequest = {
            start,
            symbol,
            granularity,
        };

        let getHistoryOnly = false;
        let quotes;
        if (end && now > end) { // end is in the past; no streaming required
            tickHistoryRequest.end = end;
            getHistoryOnly = true;
        } else if (this._tradingTimes.isMarketOpened(symbol)) {
            let subscription;
            const delay = this._tradingTimes.getDelayedMinutes(symbol);
            if (delay > 0) {
                this._mainStore.notifier.notifyDelayedMarket(symbolName, delay);

                subscription = new DelayedSubscription(tickHistoryRequest, this._binaryApi, this._stx, delay);
            } else {
                subscription = new RealtimeSubscription(tickHistoryRequest, this._binaryApi, this._stx);
            }

            try {
                quotes = await subscription.initialFetch();
            } catch (error) {
                const { message: text } = error;
                this._mainStore.notifier.notify({
                    text,
                    category: 'activesymbol',
                });
                callback({ quotes: [] });
                return;
            }

            subscription.onChartData((tickResponse) => {
                this._appendChartData(tickResponse, key, comparisonChartSymbol);
            });

            // if symbol is changed before request is completed, past request needs to be forgotten:
            if (!isComparisonChart && this._stx.chart.symbol !== symbol) {
                callback({ quotes: [] });
                subscription.forget();
                return;
            }

            this._activeStreams[key] = subscription;
        } else {
            this._mainStore.notifier.notifyMarketClose(symbolName);

            // Although market is closed, we display the past tick history data
            getHistoryOnly = true;
        }

        if (getHistoryOnly) {
            const response = await this._binaryApi.getTickHistory(tickHistoryRequest);
            quotes = TickHistoryFormatter.formatHistory(response);
        }

        if (!quotes) {
            console.error('No quotes found!!');
            callback({ quotes: [] });
            return;
        }
        callback({ quotes });

        this._emitDataUpdate(quotes, comparisonChartSymbol);
    }

    async fetchPaginationData(symbol, suggestedStartDate, endDate, params, callback) {
        const end   = getUTCEpoch(endDate);
        const start = getUTCEpoch(suggestedStartDate);
        const { period, interval } = params;
        const granularity = calculateGranularity(period, interval);

        await this._getPaginationData(symbol, granularity, start, end, callback);
    }

    async _getPaginationData(symbol, granularity, start, end, callback) {
        if (this.startEpoch && start < this.startEpoch
            || this.endEpoch && end > this.endEpoch) {
            callback({ moreAvailable: false, quotes: [] });
            return;
        }

        const now = this._serverTime.getEpoch();
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

    _forgetIfEndEpoch(key) {
        const subscription = this._activeStreams[key];
        if (!subscription) { return; }
        const lastEpoch = subscription.lastStreamEpoch;
        if (this.endEpoch && lastEpoch > this.endEpoch) {
            this._forgetStream(key);
        }
    }

    _appendChartData(quotes, key, comparisonChartSymbol) {
        this._forgetIfEndEpoch(key);
        if (!this._activeStreams[key]) {
            quotes = [];
        }
        if (comparisonChartSymbol) {
            this._stx.updateChartData(quotes, null, {
                secondarySeries: comparisonChartSymbol,
                noCreateDataSet: true,
            });
        } else {
            this._stx.updateChartData(quotes);
        }

        this._emitDataUpdate(quotes, comparisonChartSymbol);
    }

    _emitDataUpdate(quotes, comparisonChartSymbol) {
        const prev = quotes[quotes.length - 2];
        const prevClose = (prev !== undefined) ? prev.Close : undefined;
        const dataUpdate = {
            ...quotes[quotes.length - 1],
            prevClose,
        };

        if (!comparisonChartSymbol) {
            this._emitter.emit(Feed.EVENT_MASTER_DATA_UPDATE, dataUpdate);
            this._mainStore.chart.setChartAvailability(true);
        } else {
            this._emitter.emit(Feed.EVENT_COMPARISON_DATA_UPDATE, {
                symbol: comparisonChartSymbol,
                ...dataUpdate,
            });
        }

        if (this.endEpoch) {
            this._stx.home();
        }
    }

    static getFirstEpoch({ candles, history }) {
        if (candles && candles.length > 0) {
            return candles[0].epoch;
        }

        if (history && history.times.length > 0) {
            const { times } = history;
            return +times[0];
        }
    }

    onMasterDataUpdate(callback) {
        this._emitter.on(Feed.EVENT_MASTER_DATA_UPDATE, callback);
    }

    offMasterDataUpdate(callback) {
        this._emitter.off(Feed.EVENT_MASTER_DATA_UPDATE, callback);
    }

    onComparisonDataUpdate(callback) {
        this._emitter.on(Feed.EVENT_COMPARISON_DATA_UPDATE, callback);
    }

    onPagination(callback) {
        this._emitter.on(Feed.EVENT_ON_PAGINATION, callback);
    }

    offPagination(callback) {
        this._emitter.off(Feed.EVENT_ON_PAGINATION, callback);
    }

    onConnectionChanged() {
        const isOpened = this._mainStore.state.isConnectionOpened;
        if (isOpened === undefined || isOpened === this._isConnectionOpened) { return; }

        this._isConnectionOpened = isOpened;
        if (isOpened) {
            this._onConnectionReopened();
        } else {
            this._onConnectionClosed();
        }
    }

    _onConnectionClosed() {
        for (const key in this._activeStreams) {
            this._activeStreams[key].pause();
        }
        this._connectionClosedDate = new Date();
    }

    _onConnectionReopened() {
        const keys = Object.keys(this._activeStreams);
        if (keys.length === 0) { return; }
        const { granularity } = this._unpackKey(keys[0]);
        const elapsedSeconds = (new Date() - this._connectionClosedDate) / 1000 | 0;
        const maxIdleSeconds = (granularity || 1) * this._stx.chart.maxTicks;
        if (elapsedSeconds >= maxIdleSeconds) {
            this._mainStore.chart.refreshChart();
        } else {
            for (const key of keys) {
                this._resumeStream(key);
            }
        }
        this._connectionClosedDate = undefined;
    }

    _resumeStream(key) {
        const { symbol } = this._unpackKey(key);
        const comparisonChartSymbol = (this._stx.chart.symbol !== symbol) ? symbol : undefined;
        this._activeStreams[key].resume().then((quotes) => {
            this._appendChartData(quotes, key, comparisonChartSymbol);
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
