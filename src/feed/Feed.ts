import EventEmitter from 'event-emitter-es6';
import { reaction } from 'mobx';
import { TicksHistoryRequest, TicksHistoryResponse } from '@deriv/api-types';
import { Listener, TError, TGranularity, TMainStore, TQuote } from 'src/types';
import { TCreateTickHistoryParams } from 'src/binaryapi/BinaryAPI';
import { BinaryAPI, TradingTimes } from 'src/binaryapi';
import Context from 'src/components/ui/Context';
import { TickHistoryFormatter } from './TickHistoryFormatter';
import { calculateGranularity, getUTCEpoch, calculateTimeUnitInterval, getUTCDate } from '../utils';
import { RealtimeSubscription, DelayedSubscription } from './subscription';
import ServerTime from '../utils/ServerTime';
import { TQuoteResponse } from './subscription/Subscription';

type TPaginationParams = {
    period: number;
    interval: string;
    symbolObject: {
        name: string;
        symbol: string;
    };
};

type TPaginationCallback = (params: { quotes?: TQuote[]; error?: unknown; moreAvailable?: boolean }) => void;

class Feed {
    _binaryApi: BinaryAPI;
    _connectionClosedDate?: Date;
    _emitter: EventEmitter;
    _mainStore: TMainStore;
    _serverTime: ServerTime;
    _stx: Context['stx'];
    _tradingTimes: TradingTimes;
    static get EVENT_MASTER_DATA_UPDATE() {
        return 'EVENT_MASTER_DATA_UPDATE';
    }
    static get EVENT_MASTER_DATA_REINITIALIZE() {
        return 'EVENT_MASTER_DATA_REASSIGN';
    }
    static get EVENT_COMPARISON_DATA_UPDATE() {
        return 'EVENT_COMPARISON_DATA_UPDATE';
    }
    static get EVENT_START_PAGINATION() {
        return 'EVENT_START_PAGINATION';
    }
    static get EVENT_ON_PAGINATION() {
        return 'EVENT_ON_PAGINATION';
    }
    get startEpoch() {
        return this._mainStore.state.startEpoch;
    }
    get endEpoch() {
        return this._mainStore.state.endEpoch;
    }
    get granularity() {
        return this._mainStore.chart.granularity;
    }
    get context() {
        return this._mainStore.chart.context;
    }
    get loader() {
        return this._mainStore.loader;
    }
    get margin() {
        return this._mainStore.state.margin;
    }
    get paginationLoader() {
        return this._mainStore.paginationLoader;
    }
    _activeStreams: Record<string, DelayedSubscription | RealtimeSubscription> = {};
    _isConnectionOpened = true;
    constructor(binaryApi: BinaryAPI, stx: Context['stx'], mainStore: TMainStore, tradingTimes: TradingTimes) {
        this._stx = stx;
        this._binaryApi = binaryApi;
        this._mainStore = mainStore;
        this._serverTime = ServerTime.getInstance();
        this._tradingTimes = tradingTimes;
        reaction(() => mainStore.state.isConnectionOpened, this.onConnectionChanged.bind(this));
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }
    onRangeChanged = (forceLoad: boolean) => {
        const periodicity = calculateTimeUnitInterval(this.granularity);
        const rangeTime = (this.granularity || 1) * this._stx.chart.maxTicks;
        let dtLeft = null;
        let dtRight = null;
        this._mainStore.state.setChartIsReady(false);
        if (!this.endEpoch) {
            if (this.startEpoch) {
                dtLeft = this.startEpoch ? CIQ.strToDateTime(getUTCDate(this.startEpoch)) : undefined;
            }
        } else {
            dtLeft = CIQ.strToDateTime(getUTCDate(this.startEpoch || this.endEpoch - rangeTime));
            dtRight = CIQ.strToDateTime(getUTCDate(this.endEpoch));
        }
        this._stx.setRange({ dtLeft, dtRight, periodicity, forceLoad }, () => {
            if (!this.endEpoch && !this.startEpoch) {
                this._stx.home();
                delete this._stx.layout.range;
            } else {
                this.scaleChart();
            }
            this._mainStore.state.saveLayout();
            this._mainStore.state.setChartIsReady(true);
        });
    };
    scaleChart() {
        if (this.startEpoch) {
            if (this._stx.animations.liveScroll && this._stx.animations.liveScroll.running) {
                this._stx.animations.liveScroll.stop();
            }
            if (!this.endEpoch) {
                this._stx.maxMasterDataSize = 0;
                this._stx.chart.lockScroll = true;
            } else {
                this._stx.chart.isDisplayFullMode = false;
                this._stx.chart.lockScroll = false;
            }
            this._stx.setMaxTicks(
                this._stx.chart.dataSet.length + (Math.floor(this._stx.chart.dataSet.length / 5) || 2)
            );
            this._stx.chart.scroll = this._stx.chart.dataSet.length;
            this._stx.chart.isScrollLocationChanged = true;
            /**
             * for tick condition with few points, in that case, if your try to zoom in
             * as the maxTicks is less than minimumZoomTicks, chart zoom out beside of
             * zoom in, as a result, we try to override the minimumZoomTicks to prevent that
             */
            if (this._stx.chart.maxTicks < this._stx.minimumZoomTicks) {
                this._stx.minimumZoomTicks = this._stx.chart.maxTicks - 1;
            }
            this._stx.draw();
        }
    }
    // although not used, subscribe is overridden so that unsubscribe will be called by ChartIQ
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    subscribe() {}
    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe({ symbol, period, interval }: { symbol: string; period: number; interval: string }) {
        // the chart forgets the ticks_history of the main chart symbol before sending a new request in fetchInitialData function.
        if (this._stx.chart.symbol === symbol) return;
        const granularity = calculateGranularity(period, interval);
        const key = this._getKey({ symbol, granularity });
        this._forgetStream(key);
    }
    _forgetStream(key: string) {
        if (this._activeStreams[key]) {
            this._activeStreams[key].forget();
            delete this._activeStreams[key];
        }
    }
    async fetchInitialData(
        symbol: string,
        suggestedStartDate: Date,
        _suggestedEndDate: Date,
        params: TPaginationParams,
        callback: TPaginationCallback
    ) {
        this.setHasReachedEndOfData(false);
        this.paginationLoader.updateOnPagination(true);
        const { period, interval, symbolObject } = params;
        const granularity = calculateGranularity(period, interval);
        const key = this._getKey({ symbol, granularity });
        const localDate = this._serverTime.getLocalDate();
        if (suggestedStartDate > localDate) suggestedStartDate = localDate;
        if (!this.startEpoch && ((suggestedStartDate as unknown) as number) > (this.endEpoch as number)) {
            suggestedStartDate = CIQ.strToDateTime(getUTCDate((this.endEpoch as number) - 200000));
        }
        const isComparisonChart = this._stx.chart.symbol !== symbol;
        let start = this.startEpoch || Math.floor((((suggestedStartDate as unknown) as number) / 1000) | 0);
        start = this.margin && this.startEpoch ? start - this.margin : start;
        const end = this.margin && this.endEpoch ? this.endEpoch + this.margin : this.endEpoch;
        if (isComparisonChart) {
            // Strange issue where comparison series is offset by timezone...
            start -= suggestedStartDate.getTimezoneOffset() * 60;
        }
        const comparisonChartSymbol = isComparisonChart ? symbol : undefined;
        const symbolName = symbolObject.name;
        this.loader.setState('chart-data');
        if (this._tradingTimes.isFeedUnavailable(symbol)) {
            this._mainStore.notifier.notifyFeedUnavailable(symbolName);
            let dataCallback: {
                error?: string;
                suppressAlert?: boolean;
                quotes: TQuote[];
            } = { quotes: [] };
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
        const tickHistoryRequest: Partial<TCreateTickHistoryParams> = {
            symbol,
            granularity: granularity as TicksHistoryRequest['granularity'],
            start: this.endEpoch ? start : undefined,
            count: this.endEpoch ? undefined : this._mainStore.lastDigitStats.count,
        };
        let getHistoryOnly = false;
        let quotes: TQuote[] | undefined;
        if (end) {
            // When there is end; no streaming required
            tickHistoryRequest.end = String(end);
            getHistoryOnly = true;
        } else if (this._tradingTimes.isMarketOpened(symbol)) {
            let subscription: DelayedSubscription | RealtimeSubscription;
            const delay = this._tradingTimes.getDelayedMinutes(symbol);
            if (delay > 0) {
                this._mainStore.notifier.notifyDelayedMarket(symbolName, delay);
                subscription = new DelayedSubscription(
                    tickHistoryRequest as TCreateTickHistoryParams,
                    this._binaryApi,
                    this._stx,
                    delay
                );
            } else {
                subscription = new RealtimeSubscription(
                    tickHistoryRequest as TCreateTickHistoryParams,
                    this._binaryApi,
                    this._stx
                );
            }
            try {
                // The chart should forget all ticks_history subscriptions when the symbol/granularity of the main chart is changed before sending the new request.
                if (!isComparisonChart) {
                    this.unsubscribeAll();
                }
                const { quotes: new_quotes, response } = await subscription.initialFetch();
                quotes = new_quotes.filter(quote => {
                    return new Date(`${quote.Date}Z`).getTime() / 1000 >= start;
                });

                if (!this.endEpoch) {
                    this._mainStore.lastDigitStats.updateLastDigitStats(response);
                }
            } catch (error) {
                const { message: text } = error as TError;
                this._mainStore.notifier.notify({
                    text: text as string,
                    type: 'error',
                    category: 'activesymbol',
                });
                callback({ quotes: [] });
                this.paginationLoader.updateOnPagination(false);
                return;
            }
            subscription.onChartData((tickResponse: TQuote[]) => {
                // Append comming ticks to chart only if it belongs to selected symbol after symbol changes
                if (isComparisonChart || symbol === this._stx.chart.symbol) {
                    if (this._stx.isDestroyed) return;
                    this._appendChartData(tickResponse, key, comparisonChartSymbol);
                }
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
            const response: TicksHistoryResponse = await this._binaryApi.getTickHistory(
                tickHistoryRequest as TCreateTickHistoryParams
            );
            quotes = TickHistoryFormatter.formatHistory(response);
        }
        if (!quotes) {
            callback({ quotes: [] });
            return;
        }
        quotes = this._trimQuotes(quotes);
        callback({ quotes });
        this._mainStore.chart.updateYaxisWidth();
        this.scaleChart();
        this._emitDataUpdate(quotes, comparisonChartSymbol, true);
        this._mainStore.state.setMaxtTick();
        this.paginationLoader.updateOnPagination(false);
    }
    async fetchPaginationData(
        symbol: string,
        suggestedStartDate: Date,
        endDate: Date,
        params: TPaginationParams,
        callback: TPaginationCallback
    ) {
        const end = getUTCEpoch(endDate);
        const start = getUTCEpoch(suggestedStartDate);
        const { period, interval } = params;
        const granularity = calculateGranularity(period, interval);
        const isMainChart = this._stx.chart.symbol === symbol;
        if (isMainChart) {
            // ignore comparisons
            this._emitter.emit(Feed.EVENT_START_PAGINATION, { start, end });
        }
        await this._getPaginationData(symbol, granularity, start, end, callback);
    }
    async _getPaginationData(
        symbol: string,
        granularity: TGranularity,
        start: number,
        end: number,
        callback: TPaginationCallback
    ) {
        const isMainChart = this._stx.chart.symbol === symbol;
        // TODO There is no need to get historical data before startTime
        if (this.startEpoch /* && start < this.startEpoch */ || (this.endEpoch && end > this.endEpoch)) {
            callback({ moreAvailable: false, quotes: [] });
            if (isMainChart) {
                // ignore comparisons
                this._emitter.emit(Feed.EVENT_ON_PAGINATION, { start, end });
                this.setHasReachedEndOfData(true);
            }
            return;
        }
        const now = this._serverTime.getEpoch();
        // Tick history data only goes as far back as 3 years:
        const startLimit = now - Math.ceil(2.8 * 365 * 24 * 60 * 60); /* == 3 Years */
        let result: Partial<TQuoteResponse> = { quotes: [] };
        let firstEpoch: number | undefined;
        if (end > startLimit) {
            try {
                const response = await this._binaryApi.getTickHistory({
                    symbol,
                    granularity: granularity as TicksHistoryRequest['granularity'],
                    start: Math.floor(Math.max(start, startLimit)),
                    end: String(end),
                });
                if (response.error) {
                    const { message: text } = response.error as TError;
                    this.loader.hide();
                    this.paginationLoader.updateOnPagination(false);
                    this._mainStore.notifier.notify({
                        text: text as string,
                        type: 'error',
                        category: 'activesymbol',
                    });
                    callback({ error: response.error });
                    return;
                }
                firstEpoch = Feed.getFirstEpoch(response);
                if (firstEpoch === undefined || firstEpoch === end) {
                    const newStart = start - (end - start);
                    if (newStart <= startLimit) {
                        // Passed available range. Prevent anymore pagination requests:
                        callback({ moreAvailable: false, quotes: [] });
                        this.setHasReachedEndOfData(true);
                        return;
                    }
                    // Recursively extend the date range for more data until we exceed available range
                    await this._getPaginationData(symbol, granularity, newStart, end, callback);
                    return;
                }
                result.quotes = TickHistoryFormatter.formatHistory(response);
                if (firstEpoch <= startLimit) {
                    callback({ moreAvailable: false, quotes: [] });
                    this.setHasReachedEndOfData(true);
                }
            } catch (err) {
                console.error(err);
                result = { error: err };
            }
        }
        callback(result);
        if (isMainChart) {
            // ignore comparisons
            // prevent overlapping by setting pagination end as firstEpoch
            // if 'end' is greater than firstEpoch from feed
            const paginationEnd = firstEpoch && end > firstEpoch ? firstEpoch : end;
            this._emitter.emit(Feed.EVENT_ON_PAGINATION, { start, end: paginationEnd });
        }
    }
    setHasReachedEndOfData(hasReachedEndOfData: boolean) {
        this.paginationLoader.updateOnPagination(false);
        if (this._mainStore.state.hasReachedEndOfData !== hasReachedEndOfData) {
            this._mainStore.state.hasReachedEndOfData = hasReachedEndOfData;
        }
    }
    unsubscribeAll() {
        for (const key of Object.keys(this._activeStreams)) {
            this._forgetStream(key);
        }
    }
    _forgetIfEndEpoch(key: string) {
        const subscription = this._activeStreams[key];
        let result = true;
        if (!subscription) {
            return;
        }
        const lastEpoch = subscription.lastStreamEpoch;
        if (
            this.endEpoch &&
            lastEpoch !== undefined &&
            this.granularity !== undefined &&
            lastEpoch + this.granularity > this.endEpoch
        ) {
            if (
                this._activeStreams[key] &&
                this.granularity === 0 &&
                !this._mainStore.state.isStaticChart &&
                CIQ.strToDateTime(getUTCDate(this.endEpoch)).valueOf() >=
                    this._stx.chart.dataSet.slice(-1)[0]?.DT.valueOf()
            ) {
                result = false;
            }
            this._forgetStream(key);
        } else {
            result = false;
        }
        return result;
    }
    _appendChartData(quotes: TQuote[], key: string, comparisonChartSymbol?: string) {
        if (this._forgetIfEndEpoch(key) && !this._activeStreams[key]) {
            quotes = [];
            return;
        }
        if (
            this.endEpoch &&
            this._stx.chart.dataSet.slice(-1)[0] &&
            CIQ.strToDateTime(getUTCDate(this.endEpoch)).valueOf() !== this._stx.chart.dataSet.slice(-1)[0].DT.valueOf()
        ) {
            this._stx.updateChartData(
                [
                    {
                        DT: CIQ.strToDateTime(getUTCDate(this.endEpoch)),
                        Close: null,
                    },
                ],
                null,
                { fillGaps: true }
            );
            this._stx.createDataSet();
        }
        if (comparisonChartSymbol) {
            this._stx.updateChartData(quotes, null, {
                secondarySeries: comparisonChartSymbol,
                noCreateDataSet: true,
            });
        } else {
            this._stx.updateChartData(quotes, null, {
                allowReplaceOHL: true,
            });
            this._stx.createDataSet();
        }
        this._emitDataUpdate(quotes, comparisonChartSymbol);
    }
    _emitDataUpdate(quotes: TQuote[], comparisonChartSymbol?: string, isChartReinitialized = false) {
        const prev = quotes[quotes.length - 2];
        const prevClose = prev !== undefined ? prev.Close : undefined;
        const dataUpdate = {
            ...quotes[quotes.length - 1],
            prevClose,
        };
        if (!comparisonChartSymbol) {
            if (isChartReinitialized) {
                this._emitter.emit(Feed.EVENT_MASTER_DATA_REINITIALIZE);
                this._mainStore.chart.setChartAvailability(true);
            } else {
                this._emitter.emit(Feed.EVENT_MASTER_DATA_UPDATE, dataUpdate);
            }
        } else {
            this._emitter.emit(Feed.EVENT_COMPARISON_DATA_UPDATE, {
                symbol: comparisonChartSymbol,
                ...dataUpdate,
            });
        }
    }
    static getFirstEpoch({ candles, history }: TicksHistoryResponse) {
        if (candles && candles.length > 0) {
            return candles[0].epoch;
        }
        if (history && history.times && history.times.length > 0) {
            const { times } = history;
            return +times[0];
        }
    }
    onMasterDataUpdate(callback: Listener) {
        this._emitter.on(Feed.EVENT_MASTER_DATA_UPDATE, callback);
    }
    offMasterDataUpdate(callback: Listener) {
        this._emitter.off(Feed.EVENT_MASTER_DATA_UPDATE, callback);
    }
    onMasterDataReinitialize(callback: Listener) {
        this._emitter.on(Feed.EVENT_MASTER_DATA_REINITIALIZE, callback);
    }
    offMasterDataReinitialize(callback: Listener) {
        this._emitter.off(Feed.EVENT_MASTER_DATA_REINITIALIZE, callback);
    }
    onComparisonDataUpdate(callback: Listener) {
        this._emitter.on(Feed.EVENT_COMPARISON_DATA_UPDATE, callback);
    }
    onPagination(callback: Listener) {
        this._emitter.on(Feed.EVENT_ON_PAGINATION, callback);
    }
    offPagination(callback: Listener) {
        this._emitter.off(Feed.EVENT_ON_PAGINATION, callback);
    }
    onStartPagination(callback: Listener) {
        this._emitter.on(Feed.EVENT_START_PAGINATION, callback);
    }
    offStartPagination(callback: Listener) {
        this._emitter.off(Feed.EVENT_START_PAGINATION, callback);
    }
    onConnectionChanged() {
        const isOpened = this._mainStore.state.isConnectionOpened;
        if (isOpened === undefined || isOpened === this._isConnectionOpened) {
            return;
        }
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
        if (keys.length === 0) {
            return;
        }
        const { granularity } = this._unpackKey(keys[0]);
        const elapsedSeconds =
            ((((new Date() as unknown) as number) - ((this._connectionClosedDate as unknown) as number)) / 1000) | 0;
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
    _resumeStream(key: string) {
        const { symbol } = this._unpackKey(key);
        const comparisonChartSymbol = this._stx.chart.symbol !== symbol ? symbol : undefined;

        this._activeStreams[key].resume().then((params?: TQuoteResponse) => {
            const { quotes } = params as TQuoteResponse;
            if (this._stx.isDestroyed) return;
            this._appendChartData(quotes, key, comparisonChartSymbol);
        });
    }
    _getKey({ symbol, granularity }: { symbol: string; granularity: TGranularity }) {
        return `${symbol}-${granularity}`;
    }
    _unpackKey(key: string) {
        const [symbol, granularity] = key.split('-');
        return { symbol, granularity: +granularity };
    }
    _trimQuotes(quotes: TQuote[] = []) {
        let startTickIndex = null;
        let endTickIndex = null;
        let trimmedQuotes = quotes;
        if (!trimmedQuotes.length) return [];
        if (this.startEpoch && this.margin) {
            startTickIndex = trimmedQuotes.findIndex(
                tick => CIQ.strToDateTime(tick.Date) >= CIQ.strToDateTime(getUTCDate(this.startEpoch as number))
            );
            if (startTickIndex > -1) {
                trimmedQuotes = trimmedQuotes.slice(startTickIndex - 1);
            }
        }
        if (this.endEpoch && this.margin) {
            endTickIndex = trimmedQuotes.findIndex(
                tick => CIQ.strToDateTime(tick.Date) >= CIQ.strToDateTime(getUTCDate(this.endEpoch as number))
            );
            if (endTickIndex > -1) {
                const addon = trimmedQuotes[endTickIndex].Date === getUTCDate(this.endEpoch) ? 2 : 1;
                trimmedQuotes = trimmedQuotes.slice(0, endTickIndex + addon);
            }
        }
        return trimmedQuotes;
    }
}
export default Feed;
