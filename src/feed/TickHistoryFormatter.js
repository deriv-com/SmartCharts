export class TickHistoryFormatter {
    static getUTCDate(epoch) {
        const UTCdate = new Date(epoch).toISOString();
        return UTCdate.substring(0, 19);
    }

    static formatHistory(response) {
        const { history, candles } = response;
        if (history) {
            const { times, prices } = history;
            const quotes = prices.map((p, idx) => ({
                Date: this.getUTCDate(+times[idx] * 1000),
                Close: +p,
            }));
            return quotes;
        } else if (candles) {
            const quotes = candles.map(c => ({
                Date: this.getUTCDate(+c.epoch * 1000),
                Open: +c.open,
                High: +c.high,
                Low: +c.low,
                Close: +c.close,
            }));
            return quotes;
        }
    }

    static formatTick(response) {
        const { tick, ohlc } = response;
        if (tick) {
            return {
                Date: this.getUTCDate(+tick.epoch * 1000),
                Close: +tick.quote,
            };
        } else if (ohlc) {
            return {
                Date: this.getUTCDate(+ohlc.open_time * 1000),
                Open: +ohlc.open,
                High: +ohlc.high,
                Low: +ohlc.low,
                Close: +ohlc.close,
            };
        }
    }
}
