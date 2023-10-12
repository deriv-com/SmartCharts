import { expect } from 'chai';
import { Intervals } from 'src/Constant';
import {
    calculateGranularity,
    getIntervalInSeconds,
    getSymbolMarketCategory,
    getTimeIntervalName,
    getYAxisScalingParams,
} from '..';

describe('getYAxisScalingParams', () => {
    const mocked_height_desktop = 700;
    const mocked_height_mobile = 400;
    const { height_factor } = getYAxisScalingParams({ yaxis_height: mocked_height_desktop });

    it('should return an object with correct scale params for desktop', () => {
        expect(getYAxisScalingParams({ yaxis_height: mocked_height_desktop })).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 189,
                bottom: 189,
            },
        });
    });
    it('should return an object with correct scale params for mobile', () => {
        expect(
            getYAxisScalingParams({
                is_mobile: true,
                yaxis_height: mocked_height_mobile,
            })
        ).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 132,
                bottom: 132,
            },
        });
    });
    it('should return an object with correct scale params for desktop contract chart when tick_passed < or > 5', () => {
        expect(
            getYAxisScalingParams({
                yaxis_height: mocked_height_desktop,
                is_contract_chart: true,
                ticks_length: 2,
            })
        ).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 189,
                bottom: 189,
            },
        });
        expect(
            getYAxisScalingParams({
                yaxis_height: mocked_height_desktop,
                is_contract_chart: true,
                ticks_length: 10,
            })
        ).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 189,
                bottom: 189,
            },
        });
    });
    it('should return an object with correct scale params for mobile contract chart when tick_passed < or > 5', () => {
        expect(
            getYAxisScalingParams({
                is_mobile: true,
                yaxis_height: mocked_height_mobile,
                is_contract_chart: true,
                ticks_length: 2,
            })
        ).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 120,
                bottom: 120,
            },
        });
        expect(
            getYAxisScalingParams({
                is_mobile: true,
                yaxis_height: mocked_height_mobile,
                is_contract_chart: true,
                ticks_length: 10,
            })
        ).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 100,
                bottom: 100,
            },
        });
    });
    it('should return an object with height_factor only when yaxis_height is undefined', () => {
        expect(
            getYAxisScalingParams({
                is_mobile: true,
                yaxis_height: undefined,
                is_contract_chart: true,
                ticks_length: 2,
            })
        ).to.deep.equal({ height_factor });
    });
});

describe('getSymbolMarketCategory', () => {
    const symbol_object_with_subgroup = {
        decimal_places: 3,
        exchange_is_open: true,
        market: 'synthetic_index',
        market_display_name: 'Derived',
        name: 'Volatility 10 Index',
        submarket: 'random_index',
        submarket_display_name: 'Continuous Indices',
        subgroup: 'synthetics',
        subgroup_display_name: 'Synthetics',
        symbol: 'R_10',
    };
    const symbol_object_without_subgroup = {
        decimal_places: 5,
        exchange_is_open: true,
        market: 'forex',
        market_display_name: 'Forex',
        name: 'GBP/AUD',
        submarket: 'major_pairs',
        submarket_display_name: 'Major Pairs',
        subgroup: 'none',
        subgroup_display_name: 'None',
        symbol: 'frxGBPAUD',
    };
    it('should return concatenated market + subgroup + submarket name when has a subgroup', () => {
        expect(getSymbolMarketCategory(symbol_object_with_subgroup)).to.equal('derived-synthetics-continuous_indices');
    });
    it('should return concatenated market + submarket name when has no subgroup', () => {
        expect(getSymbolMarketCategory(symbol_object_without_subgroup)).to.equal('forex-major_pairs');
    });
});

describe('getTimeIntervalName', () => {
    const intervals = [
        {
            single: 'minute',
            plural: 'minutes',
            items: [
                { interval: 60, num: 1 },
                { interval: 300, num: 5 },
            ],
        },
    ] as typeof Intervals;
    it('should return correct time interval name', () => {
        expect(getTimeIntervalName(60, intervals)).to.equal('1 minute');
        expect(getTimeIntervalName(300, intervals)).to.equal('5 minutes');
    });
});

describe('calculateGranularity', () => {
    it('should return correct granularity for 1 tick', () => {
        expect(calculateGranularity(1, 'second')).to.equal(0);
    });
    it('should return correct granularity for 1 minute', () => {
        expect(calculateGranularity(1, 'minute')).to.equal(60);
    });
    it('should return correct granularity for 2 minutes', () => {
        expect(calculateGranularity(2, 'minute')).to.equal(120);
    });
    it('should return correct granularity for 3 minutes', () => {
        expect(calculateGranularity(3, 'minute')).to.equal(180);
    });
    it('should return correct granularity for 5 minutes', () => {
        expect(calculateGranularity(5, 'minute')).to.equal(300);
    });
    it('should return correct granularity for 10 minutes', () => {
        expect(calculateGranularity(10, 'minute')).to.equal(600);
    });
    it('should return correct granularity for 15 minutes', () => {
        expect(calculateGranularity(15, 'minute')).to.equal(900);
    });
    it('should return correct granularity for 30 minutes', () => {
        expect(calculateGranularity(30, 'minute')).to.equal(1800);
    });
    it('should return correct granularity for 1 hour', () => {
        expect(calculateGranularity(60, 'minute')).to.equal(3600);
    });
    it('should return correct granularity for 2 hours', () => {
        expect(calculateGranularity(120, 'minute')).to.equal(7200);
    });
    it('should return correct granularity for 4 hours', () => {
        expect(calculateGranularity(240, 'minute')).to.equal(14400);
    });
    it('should return correct granularity for 8 hours', () => {
        expect(calculateGranularity(480, 'minute')).to.equal(28800);
    });
    it('should return correct granularity for 1 day', () => {
        expect(calculateGranularity(1, 'day')).to.equal(86400);
    });
    it('should return NaN if interval is incorrect', () => {
        (expect(calculateGranularity(1, 'tick')).to.be.NaN as unknown) as () => void;
    });
});

describe('getIntervalInSeconds', () => {
    it('should return correct number of seconds for 1-tick interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 1,
                timeUnit: 'second',
            })
        ).to.equal(1);
    });
    it('should return correct number of seconds for 1-minute interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 1,
                timeUnit: 'minute',
            })
        ).to.equal(60);
    });
    it('should return correct number of seconds for 2-minute interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 2,
                timeUnit: 'minute',
            })
        ).to.equal(120);
    });
    it('should return correct number of seconds for 3-minute interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 3,
                timeUnit: 'minute',
            })
        ).to.equal(180);
    });
    it('should return correct number of seconds for 5 minutes interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 5,
                timeUnit: 'minute',
            })
        ).to.equal(300);
    });
    it('should return correct number of seconds for 10 minutes interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 10,
                timeUnit: 'minute',
            })
        ).to.equal(600);
    });
    it('should return correct number of seconds for 15 minutes interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 15,
                timeUnit: 'minute',
            })
        ).to.equal(900);
    });
    it('should return correct number of seconds for 30 minutes interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 30,
                timeUnit: 'minute',
            })
        ).to.equal(1800);
    });
    it('should return correct number of seconds for 1-hour interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 60,
                timeUnit: 'minute',
            })
        ).to.equal(3600);
    });
    it('should return correct number of seconds for 2-hour interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 120,
                timeUnit: 'minute',
            })
        ).to.equal(7200);
    });
    it('should return correct number of seconds for 4-hour interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 240,
                timeUnit: 'minute',
            })
        ).to.equal(14400);
    });
    it('should return correct number of seconds for 8-hour interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 480,
                timeUnit: 'minute',
            })
        ).to.equal(28800);
    });
    it('should return correct number of seconds for 1-day interval', () => {
        expect(
            getIntervalInSeconds({
                interval: 'day',
                timeUnit: null,
            })
        ).to.equal(86400);
    });
    it('should return NaN if interval is incorrect', () => {
        (expect(
            getIntervalInSeconds({
                interval: 1,
                timeUnit: 'day',
            })
        ).to.be.NaN as unknown) as () => void;
    });
});
