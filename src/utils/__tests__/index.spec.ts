import { expect } from 'chai';
import { getCustomChartScaleParams } from '..';

describe('getCustomChartScaleParams', () => {
    const mocked_height_desktop = 700;
    const mocked_height_mobile = 400;
    const { height_factor } = getCustomChartScaleParams({ yaxis_height: mocked_height_desktop });

    it('should return an object with correct scale params for desktop', () => {
        expect(getCustomChartScaleParams({ yaxis_height: mocked_height_desktop })).to.deep.equal({
            height_factor,
            yaxis_margin: {
                top: 189,
                bottom: 189,
            },
        });
    });
    it('should return an object with correct scale params for mobile', () => {
        expect(
            getCustomChartScaleParams({
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
            getCustomChartScaleParams({
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
            getCustomChartScaleParams({
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
            getCustomChartScaleParams({
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
            getCustomChartScaleParams({
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
});
