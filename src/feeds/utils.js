export const calculateGranularity = (period, interval) => {
	const toSeconds = {
		tick: 0,
		day: 24 * 60 * 60,
		hour: 60 * 60,
		minute: 60,
	};

	return toSeconds[interval] * period;
};

export const formatCandles = (candles) => {
	const quotes = candles.map(c => ({
		DT: +c.epoch * 1000,
		Open: +c.open,
		High: +c.high,
		Low: +c.loww,
		Close: +c.close,
	}));
	return quotes;
};

export const formatHistory = (history) => {
	const { times, prices } = history;
	const quotes = prices.map((p, idx) => ({
		DT: +times[idx] * 1000,
		Close: +p
	}));
	return quotes;
};