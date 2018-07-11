export class TickHistoryFormatter {
    static convertDate = function(date) {
        function pad2(n) {  // always returns a string
            return (n < 10 ? '0' : '') + n;
        }

        let date = new Date(dt.getUTCFullYear(), dt.getUTCMonth(), dt.getUTCDate(), dt.getUTCHours(), dt.getUTCMinutes(), dt.getUTCSeconds());

        let strDate = date.getFullYear() + '/'+
               pad2(date.getMonth() + 1) + '/'+
               pad2(date.getDate()) + ' '+
               pad2(date.getHours()) + ':'+
               pad2(date.getMinutes()) +':'+
               pad2(date.getSeconds());

        return strDate;
    }

    static formatHistory(response) {
        const { history, candles } = response;
        if (history) {
            const { times, prices } = history;
            const quotes = prices.map((p, idx) => ({
                Date: this.convertDate(new Date (+times[idx] * 1000)),
                Close: +p,
            }));
            return quotes;
        } else if (candles) {
            const quotes = candles.map(c => ({
                Date: this.convertDate(new Date(+c.epoch * 1000)),
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
                Date: this.convertDate(new Date(+tick.epoch * 1000)),
                Close: +tick.quote,
            };
        } else if (ohlc) {
            return {
                Date: this.convertDate(new Date(+ohlc.open_time * 1000)),
                Open: +ohlc.open,
                High: +ohlc.high,
                Low: +ohlc.low,
                Close: +ohlc.close,
            };
        }
    }
}
