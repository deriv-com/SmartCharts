import { expect } from 'chai';
import { Intervals } from 'src/Constant';
import { calculateGranularity, getSymbolMarketCategory, getTimeIntervalName, getYAxisScalingParams } from '..';

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
    it('should return correct granularity', () => {
        expect(calculateGranularity(1, 'second')).to.equal(0);
        expect(calculateGranularity(2, 'minute')).to.equal(120);
        expect(calculateGranularity(5, 'minute')).to.equal(300);
        expect(calculateGranularity(60, 'minute')).to.equal(3600);
        expect(calculateGranularity(1, 'day')).to.equal(86400);
        (expect(calculateGranularity(1, 'tick')).to.be.NaN as unknown) as () => void;
    });
});
