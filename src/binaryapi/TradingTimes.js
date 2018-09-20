import EventEmitter from 'event-emitter-es6';
import { getLocalDate } from '../utils';

class TradingTimes {
    static get EVENT_MARKET_OPEN_CLOSE_CHANGE() { return 'EVENT_MARKET_OPEN_CLOSE_CHANGE'; }
    static get FEED_UNAVAILABLE() { return 'chartonly'; }

    constructor(api, serverTime) {
        this._api = api;
        this._serverTime = serverTime;
        this._emitter = new EventEmitter({ emitDelay: 0 });
    }

    destructor() {
        if (this._updateTimer) {
            clearTimeout(this._updateTimer);
        }
    }

    async initialize() {
        let serverTime = await this._serverTime.get();
        this.lastUpdateDate = getLocalDate(serverTime).toISOString().substring(0, 10);

        if (!this._tradingTimesMap) {
            await this._updateTradeTimes();

            const periodicUpdate = async () => {
                const changed = this._updateMarketOpenClosed(serverTime);
                if (Object.keys(changed).length > 0) {
                    this._emitter.emit(TradingTimes.EVENT_MARKET_OPEN_CLOSE_CHANGE, changed);
                }
                let nextUpdate = await this._nextUpdateDate();

                if (!nextUpdate) {
                    serverTime = await this._serverTime.get();
                    const now = getLocalDate(serverTime);
                    // Get tomorrow's date (UTC) and set it as next update if no nextDate available
                    const nextUpdateDate = new Date(`${this.lastUpdateDate}Z`);
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

                    nextUpdate = new Date(`${this.lastUpdateDate}Z`);
                }

                serverTime = await this._serverTime.get();
                const waitPeriod =  nextUpdate - getLocalDate(serverTime);
                this._updateTimer = setTimeout(periodicUpdate, waitPeriod);
            };

            await periodicUpdate();
        }
    }

    _updateMarketOpenClosed(serverTime) {
        const changed = {};
        /* eslint-disable no-await-in-loop */
        const now = getLocalDate(serverTime);
        for (const symbol in this._tradingTimesMap) {
            const isOpened = this._calcIsMarketOpened(symbol, now);
            if (this._tradingTimesMap[symbol].isOpened !== isOpened) {
                this._tradingTimesMap[symbol].isOpened = isOpened;
                changed[symbol] = isOpened;
            }
        }

        return changed;
    }

    async _updateTradeTimes() {
        const response = await this._api.getTradingTimes(this.lastUpdateDate);
        const serverTime = await this._serverTime.get();
        const now = getLocalDate(serverTime);
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
        return this._tradingTimesMap[symbol].feed_license === TradingTimes.FEED_UNAVAILABLE;
    }

    getDelayedMinutes(symbol) {
        return this._tradingTimesMap[symbol].delay_amount;
    }

    isMarketOpened(symbol) {
        return this._tradingTimesMap[symbol].isOpened;
    }

    _calcIsMarketOpened(symbol, now) {
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

    async _nextUpdateDate() {
        const serverTime = await this._serverTime.get();
        const now = getLocalDate(serverTime);
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
