import { expect } from 'chai';
import { getYAxisScalingParams } from '..';

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
    it('should return an object with heightfactor only when yaxis_height is undefined', () => {
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
