import { TicksHistoryRequest, TicksHistoryResponse, ProposalOpenContract } from '@deriv/api-types';
import EventEmitter from 'event-emitter-es6';
import { reaction } from 'mobx';
import { BinaryAPI, TradingTimes } from 'src/binaryapi';
import { TCreateTickHistoryParams } from 'src/binaryapi/BinaryAPI';
import { Listener, TError, TGranularity, TMainStore, TPaginationCallback, TQuote } from 'src/types';
import { strToDateTime } from 'src/utils/date';
import { getUTCDate } from '../utils';
import { getSymbolDisplayName } from '../utils/displayNameUtils';
import ServerTime from '../utils/ServerTime';
import { DelayedSubscription, RealtimeSubscription } from './subscription';
import { TQuoteResponse } from './subscription/Subscription';
import { TickHistoryFormatter } from './TickHistoryFormatter';

type TPaginationParams = {
    granularity: TGranularity;
    symbolObject: {
        name: string;
        symbol: string;
    };
};

class Feed {
    _binaryApi: BinaryAPI;
    _connectionClosedDate?: Date;
    _emitter: EventEmitter;
    _mainStore: TMainStore;
    _serverTime: ServerTime;
    tickQueue: TQuote[] = [];
    _tradingTimes: TradingTimes;
    quotes: TQuote[] = [];

    static get EVENT_MASTER_DATA_UPDATE() {
        return 'EVENT_MASTER_DATA_UPDATE';
    }
    static get EVENT_MASTER_DATA_REINITIALIZE() {
        return 'EVENT_MASTER_DATA_REASSIGN';
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
    get allTicks() {
        return this._mainStore.state.allTicks;
    }
    get shouldFetchTickHistory() {
        return this._mainStore.state.shouldFetchTickHistory || false;
    }
    get contractInfo() {
        return this._mainStore.state.contractInfo;
    }
    get loader() {
        return this._mainStore.loader;
    }
    get margin() {
        return this._mainStore.state.margin;
    }
    get hasAlternativeSource() {
        return this._mainStore.state.shouldDrawTicksFromContractInfo;
    }
    get paginationLoader() {
        return this._mainStore.paginationLoader;
    }
    _activeStreams: Record<string, DelayedSubscription | RealtimeSubscription> = {};
    _isConnectionOpened = true;
    constructor(binaryApi: BinaryAPI, mainStore: TMainStore, tradingTimes: TradingTimes) {
        this._binaryApi = binaryApi;
        this._mainStore = mainStore;
        this._serverTime = ServerTime.getInstance();
        this._tradingTimes = tradingTimes;
        reaction(() => mainStore.state.isConnectionOpened, this.onConnectionChanged.bind(this));
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }
    onRangeChanged = () => {
        // TODO: load the range data

        this._mainStore.state.setChartIsReady(false);
        this._mainStore.state.saveLayout();
        this._mainStore.state.setChartIsReady(true);
    };

    // although not used, subscribe is overridden so that unsubscribe will be called by Chart Engine
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    subscribe() {}
    unsubscribe({ symbol, granularity }: { symbol: string; granularity: TGranularity }) {
        // the chart forgets the ticks_history of the main chart symbol before sending a new request in fetchInitialData function.
        const key = this._getKey({ symbol, granularity });
        this._forgetStream(key);
    }
    _forgetStream(key: string) {
        if (this._activeStreams[key]) {
            this._activeStreams[key].forget();
            delete this._activeStreams[key];
        }
    }

    processQuotes(quotes: TQuote[]) {
        quotes.forEach((quote: TQuote) => {
            quote.DT = new Date(`${quote.Date}Z`);
        });
    }

    updateQuotes(quotes: TQuote[], append: boolean) {
        this.processQuotes(quotes);
        if (append) {
            this.quotes.unshift(...quotes);
        } else {
            this.quotes = quotes;
        }
    }

    addQuote(quote: TQuote) {
        this.processQuotes([quote]);
        this.quotes.push(quote);
    }

    getQuoteForEpoch(epoch: number): TQuote | undefined {
        return this.quotes.find((q: TQuote) => {
            return q.DT?.getTime() == epoch;
        });
    }

    getQuoteIndexForEpoch(epoch: number): number | undefined {
        return this.quotes.findIndex((q: TQuote) => {
            return q.DT?.getTime() == epoch;
        });
    }

    getClosestValidEpoch(epoch: number, granularity: number) {
        return Math.round(epoch / granularity) * granularity;
    }

    getClosestQuoteForEpoch(epoch: number) {
        const index = this.findEpochIndex(epoch);

        if (index < 0) {
            return this.quotes[0];
        } else if (index > this.quotes.length - 1) {
            return this.quotes[this.quotes.length - 1];
        } else {
            const leftTick = this.quotes[Math.floor(index)];
            const rightTick = this.quotes[Math.ceil(index)];

            const distanceToLeft = epoch - leftTick.DT!.getTime();
            const distanceToRight = rightTick.DT!.getTime() - epoch;
            return distanceToLeft <= distanceToRight ? leftTick : rightTick;
        }
    }

    getClosestQuoteIndexForEpoch(epoch: number) {
        const index = this.findEpochIndex(epoch);

        if (index < 0) {
            return this.quotes[0];
        } else if (index > this.quotes.length - 1) {
            return this.quotes[this.quotes.length - 1];
        } else {
            const leftTick = this.quotes[Math.floor(index)];
            const rightTick = this.quotes[Math.ceil(index)];

            const distanceToLeft = epoch - leftTick.DT!.getTime();
            const distanceToRight = rightTick.DT!.getTime() - epoch;
            return distanceToLeft <= distanceToRight ? Math.floor(index) : Math.ceil(index);
        }
    }

    findEpochIndex(epoch: number): number {
        let left = -1;
        let right = this.quotes.length;

        while (right - left > 1) {
            const mid = Math.trunc((left + right) / 2);
            const pivot = this.quotes[mid].DT?.getTime();
            if (!pivot) {
                return mid;
            }
            if (epoch < pivot) {
                right = mid;
            } else if (epoch > pivot) {
                left = mid;
            } else {
                return mid;
            }
        }

        if (left >= 0 && epoch == this.quotes[left].DT?.getTime()) {
            return left;
        } else if (right < this.quotes.length && epoch == this.quotes[right].DT?.getTime()) {
            return right;
        } else {
            return (left + right) / 2;
        }
    }

    getQuotesInterval() {
        if (this.quotes.length <= 1) return 1;

        const cumulativeDelta = this.quotes.reduce((acc, val, index, array) => {
            const currentDT = val.DT?.getTime();
            const prevDT = array[index - 1]?.DT?.getTime();

            if (prevDT && currentDT) {
                const delta = (currentDT - prevDT) / 1000;
                return acc + delta;
            }

            return acc;
        }, 0);

        return Math.round(cumulativeDelta / (this.quotes.length - 1));
    }

    async fetchInitialData(symbol: string, params: TPaginationParams, callback: TPaginationCallback) {
        this.tickQueue = [];
        this.setHasReachedEndOfData(false);
        this.paginationLoader.updateOnPagination(true);
        const { granularity, symbolObject } = params;
        const key = this._getKey({ symbol, granularity });
        let start = this.margin && this.startEpoch ? this.startEpoch - this.margin : this.startEpoch;
        const end = this.margin && this.endEpoch ? this.endEpoch + this.margin : this.endEpoch;

        const symbolName = getSymbolDisplayName(symbolObject.symbol) || symbolObject.name;
        this.loader.setState('chart-data');
        if (this._tradingTimes.isFeedUnavailable(symbol)) {
            this._mainStore.notifier.notifyFeedUnavailable(symbolName);
            let dataCallback: {
                error?: string;
                suppressAlert?: boolean;
                quotes: TQuote[];
            } = { quotes: [] };

            this._mainStore.chart.setChartAvailability(false);
            callback(dataCallback);
            return;
        }
        const tickHistoryRequest: Partial<TCreateTickHistoryParams> = {
            symbol,
            granularity: granularity as TicksHistoryRequest['granularity'],
            start,
            count: this.endEpoch ? undefined : this._mainStore.lastDigitStats.count,
        };
        const validation_error = (this.contractInfo as ProposalOpenContract).validation_error_code;
        let getHistoryOnly = false;
        let quotes: TQuote[] | undefined;
        if (end) {
            // When there is end; no streaming required
            tickHistoryRequest.end = String(end);
            getHistoryOnly = true;
        } else if (validation_error !== 'MarketIsClosed' && validation_error !== 'MarketIsClosedTryVolatility') {
            let subscription: DelayedSubscription | RealtimeSubscription;
            const delay = this._tradingTimes.getDelayedMinutes(symbol);
            if (delay > 0) {
                this._mainStore.notifier.notifyDelayedMarket(symbolName, delay);
                subscription = new DelayedSubscription(
                    tickHistoryRequest as TCreateTickHistoryParams,
                    this._binaryApi,
                    delay,
                    this._mainStore
                );
            } else {
                subscription = new RealtimeSubscription(
                    tickHistoryRequest as TCreateTickHistoryParams,
                    this._binaryApi,
                    this._mainStore
                );
            }
            try {
                const { quotes: new_quotes, response } = await subscription.initialFetch();
                quotes = new_quotes;

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
                if (symbol === this._mainStore.chart.currentActiveSymbol?.symbol && !this.hasAlternativeSource) {
                    this._appendChartData(tickResponse, key);
                }
            });

            // if symbol is changed before request is completed, past request needs to be forgotten:
            if (
                this._mainStore.chart.isDestroyed ||
                (this._mainStore.state.symbol && this._mainStore.state.symbol !== symbol)
            ) {
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
            if (this.shouldFetchTickHistory || !(this.contractInfo as ProposalOpenContract).tick_stream) {
                const response: TicksHistoryResponse = await this._binaryApi.getTickHistory(
                    tickHistoryRequest as TCreateTickHistoryParams
                );
                quotes = TickHistoryFormatter.formatHistory(response);
            } else {
                // Passed all_ticks from Deriv-app store modules.contract_replay.contract_store.contract_info.audit_details.all_ticks
                // Waits for the flutter chart to unmount previous chart
                const allTicksContract: Feed['allTicks'] = await new Promise(resolve => {
                    setTimeout(() => resolve(this.allTicks), 50);
                });
                quotes = TickHistoryFormatter.formatAllTicks(allTicksContract);
            }
        }
        if (!quotes) {
            callback({ quotes: [] });
            return;
        }

        quotes = this._trimQuotes(quotes);
        callback({ quotes });
        this._emitDataUpdate(quotes, true);
        this.paginationLoader.updateOnPagination(false);
    }
    async fetchPaginationData(
        symbol: string,
        end: number,
        count: number,
        granularity: TGranularity,
        callback: TPaginationCallback
    ) {
        this.paginationLoader.updateOnPagination(true);

        // ignore comparisons
        this._emitter.emit(Feed.EVENT_START_PAGINATION, { end });

        await this._getPaginationData(symbol, granularity, count, end, callback);
        this.paginationLoader.updateOnPagination(false);
    }

    async _getPaginationData(
        symbol: string,
        granularity: TGranularity,
        count: number,
        end: number,
        callback: TPaginationCallback
    ) {
        if (this._mainStore.state.hasReachedEndOfData) {
            return;
        }

        const isMainChart = true;
        // TODO There is no need to get historical data before startTime
        if (this.startEpoch /* && start < this.startEpoch */ || (this.endEpoch && end > this.endEpoch)) {
            callback({ moreAvailable: false, quotes: [] });

            // ignore comparisons
            this._emitter.emit(Feed.EVENT_ON_PAGINATION, { end });
            this.setHasReachedEndOfData(true);
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
                    count: `${count}` as any,
                    end: String(end),
                });
                if (response.error) {
                    const { message: text } = response.error as TError;
                    this.loader.hide();
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
                    callback({ moreAvailable: false, quotes: [] });
                    this.setHasReachedEndOfData(true);
                    return;
                }
                result.quotes = TickHistoryFormatter.formatHistory(response);
                if (firstEpoch <= startLimit) {
                    callback({ moreAvailable: false, quotes: [] });
                    this.setHasReachedEndOfData(true);
                }

                if (result.quotes?.length && result.quotes.length < count) {
                    callback({ moreAvailable: false, quotes: result.quotes });
                    this.setHasReachedEndOfData(true);
                    return;
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
            this._emitter.emit(Feed.EVENT_ON_PAGINATION, { end: paginationEnd });
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
                strToDateTime(getUTCDate(this.endEpoch)).valueOf() >= this.quotes.slice(-1)[0]?.Date.valueOf()
            ) {
                result = false;
            }
            this._forgetStream(key);
        } else {
            result = false;
        }
        return result;
    }
    _appendChartData(quotes: TQuote[], key: string, fromAlternativeSource = false) {
        if (this._forgetIfEndEpoch(key) && !this._activeStreams[key]) {
            quotes = [];
            return;
        }
        if (!this.hasAlternativeSource || fromAlternativeSource) {
            if (fromAlternativeSource) {
                if (!this.tickQueue.length) {
                    this.tickQueue = [quotes[quotes.length - 1]];
                    return;
                }
                if (this.tickQueue[0].tick?.epoch === quotes[quotes.length - 1].tick?.epoch) return;
                this.tickQueue = [quotes[quotes.length - 1]];

                quotes = [quotes[quotes.length - 1]];
            }
        }
        this._emitDataUpdate(quotes);
    }
    appendChartDataFromPOCResponse(contract_info: ProposalOpenContract) {
        const ticks = TickHistoryFormatter.formatPOCTick(contract_info);
        if (ticks) {
            this._appendChartData(ticks, ticks[0].tick.symbol, true);
        }
    }
    _emitDataUpdate(quotes: TQuote[], isChartReinitialized = false) {
        const prev = quotes[quotes.length - 2];
        const prevClose = prev !== undefined ? prev.Close : undefined;
        const dataUpdate = {
            ...quotes[quotes.length - 1],
            prevClose,
        };
        if (isChartReinitialized) {
            this._emitter.emit(Feed.EVENT_MASTER_DATA_REINITIALIZE);
            this._mainStore.chart.setChartAvailability(true);
        } else {
            this._emitter.emit(Feed.EVENT_MASTER_DATA_UPDATE, dataUpdate);
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
        this._mainStore.chart.refreshChart();
        this._connectionClosedDate = undefined;
    }
    _resumeStream(key: string) {
        this._activeStreams[key].pause();
        this._activeStreams[key].resume().then((params?: TQuoteResponse) => {
            const { quotes } = params as TQuoteResponse;
            this._appendChartData(quotes, key);
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
                tick => strToDateTime(tick.Date) >= strToDateTime(getUTCDate(this.startEpoch as number))
            );
            if (startTickIndex > 0) {
                trimmedQuotes = trimmedQuotes.slice(startTickIndex - 1);
            }
        }
        if (this.endEpoch && this.margin) {
            endTickIndex = trimmedQuotes.findIndex(
                tick => strToDateTime(tick.Date) >= strToDateTime(getUTCDate(this.endEpoch as number))
            );
            if (endTickIndex > -1) {
                const addon =
                    strToDateTime(trimmedQuotes[endTickIndex].Date) === strToDateTime(getUTCDate(this.endEpoch))
                        ? 2
                        : 1;
                trimmedQuotes = trimmedQuotes.slice(0, endTickIndex + addon);
            }
        }
        return trimmedQuotes;
    }
}
export default Feed;
