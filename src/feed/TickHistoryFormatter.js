import { getUTCDate } from '../utils';

export class TickHistoryFormatter {
    static formatHistory(response) {
        const { history, candles } = response;
        if (history) {
            const { times, prices } = history;
            const quotes = prices.map((p, idx) => ({
                Date: getUTCDate(+times[idx]),
                Close: +p,
            }));
            return quotes;
        } if (candles) {
            const quotes = candles.map(c => ({
                Date: getUTCDate(+c.epoch),
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
                Date: getUTCDate(+tick.epoch),
                Close: +tick.quote,
            };
        } if (ohlc) {
            return {
                Date: getUTCDate(+ohlc.open_time),
                Open: +ohlc.open,
                High: +ohlc.high,
                Low: +ohlc.low,
                Close: +ohlc.close,
            };
        }
    }
}
