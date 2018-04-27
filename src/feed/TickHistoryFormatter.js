export class TickHistoryFormatter {
    static formatHistory(response) {
        const { history, candles } = response;
        if (history) {
            const { times, prices } = history;
            const quotes = prices.map((p, idx) => ({
                DT: +times[idx] * 1000,
                Close: +p,
            }));
            return quotes;
        } else if (candles) {
            const quotes = candles.map(c => ({
                DT: new Date(+c.epoch * 1000),
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
                DT: new Date(+tick.epoch * 1000),
                Close: +tick.quote,
            };
        } else if (ohlc) {
            return {
                DT: new Date(+ohlc.open_time * 1000),
                Open: +ohlc.open,
                High: +ohlc.high,
                Low: +ohlc.low,
                Close: +ohlc.close,
            };
        }
    }
}
