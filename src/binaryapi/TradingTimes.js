import EventEmitter from 'event-emitter-es6';
import ServerTime from '../utils/ServerTime';
import PendingPromise from '../utils/PendingPromise';

class TradingTimes {
    static get EVENT_MARKET_OPEN_CLOSE_CHANGE() { return 'EVENT_MARKET_OPEN_CLOSE_CHANGE'; }
    static get FEED_UNAVAILABLE() { return 'chartonly'; }
    isInitialized = false;
    tradingTimesPromise = new PendingPromise();

    constructor(api, shouldFetchTradingTimes = true) {
        this._shouldFetchTradingTimes = shouldFetchTradingTimes;
        this._api = api;
        this._serverTime = ServerTime.getInstance();
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    destructor() {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
        }
    }

    async initialize() {
        await this._serverTime.init(this._api);

        if (this.isInitialized) { return this.tradingTimesPromise; }
        this.isInitialized = true;

        this.lastUpdateDate = this._serverTime.getLocalDate().toISOString().substring(0, 10);

        if (!this._tradingTimesMap && this._shouldFetchTradingTimes) {
            await this._updateTradeTimes();
            this.tradingTimesPromise.resolve();

            const periodicUpdate = async () => {
                const changed = this._updateMarketOpenClosed();
                if (Object.keys(changed).length > 0) {
                    this._emitter.emit(TradingTimes.EVENT_MARKET_OPEN_CLOSE_CHANGE, changed);
                }
                let nextUpdate = this._nextUpdateDate();

                if (!nextUpdate) {
                    const now = this._serverTime.getLocalDate();
                    // Get tomorrow's date (UTC) and set it as next update if no nextDate available
                    const nextUpdateDate = new Date(`${this.lastUpdateDate}T00:00:00Z`);
                    nextUpdateDate.setDate(nextUpdateDate.getDate() + 1);
                    // if somehow the next update date is in the past, use the current date
                    this.lastUpdateDate = ((now > nextUpdateDate) ? now : nextUpdateDate).toISOString().substring(0, 10);

                    // Retain the current market open close status, because the trade times
                    // will now be the following day:
                    const isOpenMap = {};
                    for (const key in this._tradingTimesMap) {
                        isOpenMap[key] = this._tradingTimesMap[key].isOpened;
                    }

                    await this._updateTradeTimes();

                    for (const key in this._tradingTimesMap) {
                        this._tradingTimesMap[key].isOpened = isOpenMap[key];
                    }

                    // next update date will be 00:00 hours (UTC) of the following day:
                    nextUpdate = nextUpdateDate;
                }

                const waitPeriod =  nextUpdate - this._serverTime.getLocalDate();
                this._updateTimer = setTimeout(periodicUpdate, waitPeriod);
            };

            await periodicUpdate();
        }
    }

    _updateMarketOpenClosed() {
        const changed = {};
        for (const symbol in this._tradingTimesMap) {
            const isOpened = this._calcIsMarketOpened(symbol);
            if (this._tradingTimesMap[symbol].isOpened !== isOpened) {
                this._tradingTimesMap[symbol].isOpened = isOpened;
                changed[symbol] = isOpened;
            }
        }

        return changed;
    }

    async _updateTradeTimes() {
        const response = await this._api.getTradingTimes(this.lastUpdateDate);

        if (response.error) {
            const { error } = response;
            console.error(`Error getting trading times on ${this.lastUpdateDate}: [${error.code}] "${error.message}"`);
            return;
        }

        const now = this._serverTime.getLocalDate();
        const dateStr = now.toISOString().substring(0, 11);
        const getUTCDate = hour => new Date(`${dateStr}${hour}Z`);

        this._tradingTimesMap = {};
        const { markets } = response.trading_times;
        for (const market of markets) {
            const { submarkets } = market;
            for (const submarket of submarkets) {
                const { symbols } = submarket;
                for (const symbolObj of symbols) {
                    const { times, symbol, feed_license, delay_amount } = symbolObj;
                    const { open, close } = times;
                    let _times;
                    const isOpenAllDay = open.length === 1
                        && open[0] === '00:00:00'
                        && close[0] === '23:59:59';
                    const isClosedAllDay = open.length === 1
                        && open[0] === '--'
                        && close[0] === '--';
                    if (!isOpenAllDay && !isClosedAllDay) {
                        _times = open.map((openTime, idx) => ({
                            open: getUTCDate(openTime),
                            close: getUTCDate(close[idx]),
                        }));
                    }
                    this._tradingTimesMap[symbol] = {
                        feed_license,
                        delay_amount: delay_amount || 0,
                        times: _times,
                        isOpenAllDay,
                        isClosedAllDay,
                    };
                }
            }
        }
    }

    isFeedUnavailable(symbol) {
        if (!this._tradingTimesMap) { return; }
        if (!(symbol in this._tradingTimesMap)) {
            console.error('Symbol not in _tradingTimesMap:', symbol, ' trading map:', this._tradingTimesMap);
            return false;
        }
        return this._tradingTimesMap[symbol].feed_license === TradingTimes.FEED_UNAVAILABLE;
    }

    getDelayedMinutes(symbol) {
        return this._tradingTimesMap[symbol].delay_amount;
    }

    isMarketOpened(symbol) {
        if (!this._tradingTimesMap) { return; }
        if (!(symbol in this._tradingTimesMap)) {
            console.error('Symbol not in _tradingTimesMap:', symbol, ' trading map:', this._tradingTimesMap);
            return false;
        }
        return this._tradingTimesMap[symbol].isOpened;
    }

    _calcIsMarketOpened(symbol) {
        const now = this._serverTime.getLocalDate();
        const {
            times, feed_license,
            isOpenAllDay, isClosedAllDay,
        } = this._tradingTimesMap[symbol];
        if (isClosedAllDay
            || feed_license === TradingTimes.FEED_UNAVAILABLE) return false;
        if (isOpenAllDay) return true;
        for (const session of times) {
            const { open, close } = session;
            if (now >= open && now < close) {
                return true;
            }
        }
        return false;
    }

    _nextUpdateDate() {
        const now = this._serverTime.getLocalDate();
        let nextDate;
        for (const key in this._tradingTimesMap) {
            const {
                times, feed_license,
                isOpenAllDay, isClosedAllDay,
            } = this._tradingTimesMap[key];
            if (isOpenAllDay
                || isClosedAllDay
                || feed_license === TradingTimes.FEED_UNAVAILABLE) continue;
            for (const session of times) {
                const { open, close } = session;
                if (open  > now && (!nextDate || open  < nextDate)) {
                    nextDate = open;
                }
                if (close > now && (!nextDate || close < nextDate)) {
                    nextDate = close;
                }
            }
        }

        return nextDate;
    }

    onMarketOpenCloseChanged(callback) {
        this._emitter.on(TradingTimes.EVENT_MARKET_OPEN_CLOSE_CHANGE, callback);
    }
}

export default TradingTimes;
