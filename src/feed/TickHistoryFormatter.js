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
        }

        if (candles) {
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
                // Keep the origial value.
                // It'll be used to pass down to deriv.app in BottomWidgets.
                // TODO: use tick.epoch in RawMarker.jsx to speed up calculations.
                tick,
            };
        }

        if (ohlc) {
            return {
                Date: getUTCDate(+ohlc.open_time),
                Open: +ohlc.open,
                High: +ohlc.high,
                Low: +ohlc.low,
                Close: +ohlc.close,
                ohlc,
            };
        }
    }

    static formatProposalTick(response) {
        const { proposal, echo_req: request } = response;

        if (proposal) {
            return {
                Date: getUTCDate(+proposal.spot_time),
                Close: +proposal.spot,
                tick: {
                    epoch: proposal.spot_time,
                    quotes: proposal.spot,
                    symbol: request.symbol,
                },
            };
        }
        return null;
    }
}
