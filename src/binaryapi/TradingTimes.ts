import EventEmitter from 'event-emitter-es6';
import ServerTime from '../utils/ServerTime';
import PendingPromise from '../utils/PendingPromise';
const DaysOfWeek = ['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'];
class TradingTimes {
    _api: any;
    _emitter: any;
    _params: any;
    _serverTime: any;
    _shouldFetchTradingTimes: any;
    _tradingTimesMap: any;
    _updateTimer: any;
    lastUpdateDate: any;
    static get EVENT_MARKET_OPEN_CLOSE_CHANGE() {
        return 'EVENT_MARKET_OPEN_CLOSE_CHANGE';
    }
    static get FEED_UNAVAILABLE() {
        return 'chartonly';
    }
    isInitialized = false;
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    tradingTimesPromise = new PendingPromise();
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'timeUpdateCallback' implicitly has an 'any... Remove this comment to see the full error message
    timeUpdateCallback;
    constructor(api: any, params: any) {
        this._params = params || {};
        this._shouldFetchTradingTimes = params?.shouldFetchTradingTimes || true;
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
        await this._serverTime.init(this._api, () => {
            if (typeof this.timeUpdateCallback === 'function') this.timeUpdateCallback();
        });
        if (this.isInitialized) {
            return this.tradingTimesPromise;
        }
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
                    this.lastUpdateDate = (now > nextUpdateDate ? now : nextUpdateDate).toISOString().substring(0, 10);
                    // Retain the current market open close status, because the trade times
                    // will now be the following day:
                    const isOpenMap = {};
                    for (const key in this._tradingTimesMap) {
                        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        isOpenMap[key] = this._tradingTimesMap[key].isOpened;
                    }
                    await this._updateTradeTimes();
                    for (const key in this._tradingTimesMap) {
                        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                        this._tradingTimesMap[key].isOpened = isOpenMap[key];
                    }
                    // next update date will be 00:00 hours (UTC) of the following day:
                    nextUpdate = nextUpdateDate;
                }
                const waitPeriod = nextUpdate - this._serverTime.getLocalDate();
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
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                changed[symbol] = isOpened;
            }
        }
        return changed;
    }
    async _updateTradeTimes() {
        let response = {};
        if (!this._tradingTimesMap && this._params.initialData) response = this._params.initialData;
        else if (this._params.enable !== false) response = await this._api.getTradingTimes(this.lastUpdateDate);
        else {
            console.error('TradingTimes feed is not enable nor has initial data!');
            return;
        }
        if ((response as any).error) {
            // @ts-expect-error ts-migrate(2339) FIXME: Property 'error' does not exist on type '{}'.
            const { error } = response;
            console.error(`Error getting trading times on ${this.lastUpdateDate}: [${error.code}] "${error.message}"`);
            return;
        }
        this._tradingTimesMap = {};
        const now = this._serverTime.getLocalDate();
        const dateStr = now.toISOString().substring(0, 11);
        const getUTCDate = (hour: any) => new Date(`${dateStr}${hour}Z`);
        const { markets } = (response as any).trading_times;
        for (const market of markets) {
            const { submarkets } = market;
            for (const submarket of submarkets) {
                const { symbols } = submarket;
                for (const symbolObj of symbols) {
                    const { events, times, symbol, feed_license, delay_amount } = symbolObj;
                    const { open, close } = times;
                    let isClosedToday = false;
                    const holidays: any = [];
                    const closes_early: any = [];
                    const opens_late: any = [];
                    events
                        .map((event: any) =>
                            event.dates.includes(',')
                                ? event.dates.split(',').map((date: any) => ({
                                      date: date.trim(),
                                      description: event.descrip,
                                  }))
                                : [{ date: event.dates, description: event.descrip }]
                        )
                        .reduce((ary: any, item: any) => ary.concat(item), [])
                        .forEach((event: any) => {
                            const lower_description = event.description.toLowerCase();
                            // Open Late
                            if (/^opens late \(at (\d{1,2}:\d{1,2})\)$/gm.test(event.description.toLowerCase())) {
                                const event_hour = `${lower_description
                                    .replace('opens late (at ', '')
                                    .replace(')', '')}:00`;
                                const event_date =
                                    event.date === 'today' || event.date === DaysOfWeek[now.getDay()]
                                        ? dateStr.substring(0, 10)
                                        : event.date;
                                opens_late.push({
                                    date: event_date,
                                    open: new Date(`${event_date}T${event_hour}Z`),
                                    close: new Date(`${event_date}T${close[0]}Z`),
                                });
                                // Close early
                            } else if (/^closes early \(at (\d{1,2}:\d{1,2})\)$/gm.test(lower_description)) {
                                const event_hour = `${lower_description
                                    .replace('closes early (at ', '')
                                    .replace(')', '')}:00`;
                                const event_date =
                                    event.date === 'today' || event.date === DaysOfWeek[now.getDay()]
                                        ? dateStr.substring(0, 10)
                                        : event.date;
                                closes_early.push({
                                    date: event_date,
                                    open: new Date(`${event_date}T${open[0]}Z`),
                                    close: new Date(`${event_date}T${event_hour}Z`),
                                });
                                // Special date
                            } else if (/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
                                holidays.push(event.date);
                            } else if (event.date === 'today') {
                                isClosedToday = true;
                            }
                        });
                    let _times;
                    const isOpenAllDay = open.length === 1 && open[0] === '00:00:00' && close[0] === '23:59:59';
                    const isClosedAllDay = open.length === 1 && open[0] === '--' && close[0] === '--';
                    if (!isOpenAllDay && !isClosedAllDay) {
                        _times = open.map((openTime: any, idx: any) => ({
                            open: getUTCDate(openTime),
                            close: getUTCDate(close[idx]),
                        }));
                    }
                    this._tradingTimesMap[symbol] = {
                        feed_license,
                        isClosedToday,
                        holidays,
                        closes_early,
                        opens_late,
                        delay_amount: delay_amount || 0,
                        times: _times,
                        isOpenAllDay,
                        isClosedAllDay,
                    };
                }
            }
        }
    }
    isFeedUnavailable(symbol: any) {
        if (!this._tradingTimesMap) {
            return;
        }
        if (!(symbol in this._tradingTimesMap)) {
            console.error('Symbol not in _tradingTimesMap:', symbol, ' trading map:', this._tradingTimesMap);
            return false;
        }
        return this._tradingTimesMap[symbol].feed_license === TradingTimes.FEED_UNAVAILABLE;
    }
    getDelayedMinutes(symbol: any) {
        return this._tradingTimesMap[symbol].delay_amount;
    }
    isMarketOpened(symbol: any) {
        if (!this._tradingTimesMap) {
            return;
        }
        if (!(symbol in this._tradingTimesMap)) {
            console.error('Symbol not in _tradingTimesMap:', symbol, ' trading map:', this._tradingTimesMap);
            return false;
        }
        return this._tradingTimesMap[symbol].isOpened;
    }
    _calcIsMarketOpened(symbol: any) {
        const now = this._serverTime.getLocalDate();
        const dateStr = now.toISOString().substring(0, 10);
        const {
            times,
            feed_license,
            isOpenAllDay,
            isClosedAllDay,
            holidays,
            closes_early,
            opens_late,
            isClosedToday,
        } = this._tradingTimesMap[symbol];
        if (
            isClosedAllDay ||
            feed_license === TradingTimes.FEED_UNAVAILABLE ||
            isClosedToday ||
            holidays.includes(dateStr)
        ) {
            return false;
        }
        const opens_late_date = opens_late.find((event: any) => event.date === dateStr);
        if (opens_late_date) {
            const { open, close } = opens_late_date;
            return !!(now >= open && now < close);
        }
        const closes_early_date = closes_early.find((event: any) => event.date === dateStr);
        if (closes_early_date) {
            const { open, close } = closes_early_date;
            return !!(now >= open && now < close);
        }
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
            const { times, feed_license, isOpenAllDay, isClosedAllDay } = this._tradingTimesMap[key];
            if (isOpenAllDay || isClosedAllDay || feed_license === TradingTimes.FEED_UNAVAILABLE) continue;
            for (const session of times) {
                const { open, close } = session;
                if (open > now && (!nextDate || open < nextDate)) {
                    nextDate = open;
                }
                if (close > now && (!nextDate || close < nextDate)) {
                    nextDate = close;
                }
            }
        }
        return nextDate;
    }
    onMarketOpenCloseChanged(callback: any) {
        this._emitter.on(TradingTimes.EVENT_MARKET_OPEN_CLOSE_CHANGE, callback);
    }
    onTimeChanged(callback: any) {
        this.timeUpdateCallback = callback;
    }
}
export default TradingTimes;
