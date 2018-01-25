function binarySearch(array, dt) {
    let minIndex = 0;
    let maxIndex = array.length - 1;
    let currentIndex;
    let currentElement;

    while (minIndex <= maxIndex) {
        currentIndex = (minIndex + maxIndex) / 2 | 0;
        currentElement = array[currentIndex];

        if (currentElement.DT < dt) {
            minIndex = currentIndex + 1;
        } else if (currentElement.DT > dt) {
            maxIndex = currentIndex - 1;
        } else {
            return currentElement;
        }
    }

    return null;
}
window.binarySearch = binarySearch;

class Feed {
    constructor(streamManager, cxx) {
        this._cxx = cxx;
        this._streamManager = streamManager;
        this._stream = null;
        this._cmpStreams = [];
    }

    unsubscribe() {
        if (this._stream) this._stream.forget();
        this._stream = null;
        this._cmpStreams.forEach(s => s.forget());
        this._cmpStreams = [];
    }

    _trackStream(stream, is_master) {
        stream.onStream(({ tick, ohlc }) => {
            const quotes = ohlc ? [{
                DT: new Date(+ohlc.open_time * 1000),
                Open: +ohlc.open,
                High: +ohlc.high,
                Low: +ohlc.low,
                Close: +ohlc.close,
            }] : [{
                DT: new Date(+tick.epoch * 1000),
                Close: +tick.quote,
            }];

            if (is_master) {
                this._cxx.appendMasterData(quotes);
            } else {
                setTimeout(() => {
                    const data = binarySearch(this._cxx.masterData, quotes[0].DT);
                    data[tick ? tick.symbol : ohlc.symbol] = quotes[0];
                    this._cxx.updateChartData([data]);
                }, 2000);
            }
        });
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        const { period, interval } = params;

        const stream = this._streamManager.subscribe({
            symbol,
            granularity: Feed.calculateGranularity(period, interval),
        });

        if (params.symbol === 'R_10' /* TODO: If it is a main symbol */) {
            this.unsubscribe();
            this._stream = stream;
            this._trackStream(stream, true);
        } else { /* R_100 */
            this._cmpStreams.push(stream);
            this._trackStream(stream, false);
        }

        try {
            const { candles, history } = await stream.response;
            const quotes = candles ? Feed.formatCandles(candles) : Feed.formatHistory(history);
            const attribution = { message: stream.isMarketClosed ? 'Market is presently closed' : '' };
            callback({ quotes, attribution });
        } catch (err) {
            console.error(err); // eslint-disable-line
            callback({ error: err });
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
                const { candles, history } = await this._streamManager.historicalData({
                    symbol,
                    granularity: Feed.calculateGranularity(period, interval),
                    start: Math.max(start, startLimit),
                    end,
                });
                result.quotes = candles ? Feed.formatCandles(candles) : Feed.formatHistory(history);
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
    static formatCandles(candles) {
        const quotes = candles.map(c => ({
            DT: new Date(+c.epoch * 1000),
            Open: +c.open,
            High: +c.high,
            Low: +c.low,
            Close: +c.close,
        }));
        return quotes;
    }
    static formatHistory(history) {
        const { times, prices } = history;
        const quotes = prices.map((p, idx) => ({
            DT: +times[idx] * 1000,
            Close: +p,
        }));
        return quotes;
    }
}


export default Feed;
