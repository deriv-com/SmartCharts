class Feed {
    constructor(streamManager, cxx) {
        this._cxx = cxx;
        this._streamManager = streamManager;
        this._streams = {};
    }

    // although not used, subscribe is overriden so that unsubscribe will be called by ChartIQ
    subscribe() {}

    // Do not call explicitly! Method below is called by ChartIQ when unsubscribing symbols.
    unsubscribe({ symbol }) {
        this._streams[symbol].forget();
        delete this._streams[symbol];
    }

    _trackStream(stream, comparison_chart_symbol) {
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

            if (comparison_chart_symbol) {
                CIQ.addMemberToMasterdata({
                    stx: this._cxx,
                    label: comparison_chart_symbol,
                    data: quotes,
                    createObject: true,
                });
            } else {
                this._cxx.updateChartData(quotes);
            }
        });
    }

    async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, callback) {
        if (symbol in this._streams) {
            console.error(`Duplicate symbol "${symbol}" in Feed streams!`);
            return;
        }

        const { period, interval } = params;
        const isComparisonChart = !params.initializeChart;

        const stream = this._streamManager.subscribe({
            symbol,
            granularity: Feed.calculateGranularity(period, interval),
        });

        this._trackStream(stream, isComparisonChart ? symbol : undefined);
        this._streams[symbol] = stream;

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
