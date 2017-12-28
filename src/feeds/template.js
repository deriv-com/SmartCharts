import * as liveapi from './liveapi';
import * as utils from './utils';

const binaryFeed = {
	subscribe(obj) {
		console.warn(obj);
	},
	unsubscribe(obj) {
		console.warn('unsubscribe', obj);
	},
	async sendRequest({ symbol, period, interval, startEpoch, endEpoch, subscribe }) {
		const req = {
			"ticks_history": symbol,
			"start": startEpoch,
			"style": interval !== 'tick' ? "candles" : "ticks",
			"granularity": utils.calculateGranularity(period, interval),
		};
		endEpoch && (req.end = endEpoch);
		subscribe && (req.subscribe = 1);

		try {
			return await liveapi.send(req, 20 * 1000);
		} catch (up) {
			/* market is closed, try the same request without subscribing */
			if (req.subscribe && up.code === 'MarketIsClosed') {
				delete req.subscribe;
				return await liveapi.send(req, 20 * 1000);
			}
			throw up;
		}
	},
	async fetchInitialData(symbol, suggestedStartDate, suggestedEndDate, params, cb) {
		const startEpoch = suggestedStartDate.getTime() / 1000;
		const { period, interval } = params;

		console.warn(suggestedStartDate, suggestedEndDate);
		try {
			const data = await this.sendRequest({ symbol, period, interval, startEpoch, endEpoch: 'latest', subscribe: true });
			if (data.candles) {
				const newQuotes = utils.formatCandles(data.candles);
				cb({ quotes: newQuotes, attribution: { source: "simulator", exchange: "RANDOM" } });
			}
			else if (data.history) {
				const newQuotes = utils.formatHistory(data.history);
				cb({ quotes: newQuotes, attribution: { source: "simulator", exchange: "RANDOM" } });
			} else {
				throw new Error("Invalid tick_history response.");
			}
		} catch (err) {
			cb({ error: err });
		}
	},

	fetchPaginationData(symbol, suggestedStartDate, endDate, params, cb) {
		const startEpoch = suggestedStartDate.getTime() / 1000;
		const endEpoch = endDate.getTime() / 1000;
		const { period, interval } = params;

		console.warn(suggestedStartDate, endDate);
		this.sendRequest({ symbol, period, interval, startEpoch, endEpoch })
			.then(data => {
				if (data.candles) {
					if (+data.candles[0].epoch > endEpoch) {
						cb({ error: 404, moreAvailable: false });	// 404 means no more data.
						return;
					}
					const newQuotes = utils.formatCandles(data.candles);
					cb({ quotes: newQuotes, attribution: { source: "simulator", exchange: "RANDOM" } });
				}
				else if (data.history) {
					const newQuotes = utils.formatHistory(data.history);
					cb({ quotes: newQuotes, attribution: { source: "simulator", exchange: "RANDOM" } });
				} else {
					throw new Error("Invalid tick_history response.");
				}
			})
			.catch(err => {
				cb({ error: err });
			});
		return this.fetchInitialData(symbol, suggestedStartDate, endDate, params, cb);
	}
};

export default class ChartService {
	constructor() {
		liveapi.init({ appId: 11 });
	}

	makeFeed() {
		return binaryFeed;
	}
}
