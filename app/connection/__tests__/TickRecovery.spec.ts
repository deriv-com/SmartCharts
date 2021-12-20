// @ts-nocheck
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { mergeTickHistory } from '../tickUtils';

describe('Test mergeTickHistory (Ticks)', () => {
    const fullTickHistoryResponse = {
        echo_req: {
            adjust_start_time: 1,
            end: 1532340080,
            granularity: 0,
            start: 1532340061,
            style: 'ticks',
            ticks_history: 'R_50',
        },
        history: {
            prices: [
                '184.7895',
                '184.7663',
                '184.7995',
                '184.7967',
                '184.8159',
                '184.7690',
                '184.7956',
                '184.8107',
                '184.7957',
                '184.7942',
            ],
            times: [
                '1532340062',
                '1532340064',
                '1532340066',
                '1532340068',
                '1532340070',
                '1532340072',
                '1532340074',
                '1532340076',
                '1532340078',
                '1532340080',
            ],
        },
        msg_type: 'history',
    };

    const partA = {
        echo_req: {
            adjust_start_time: 1,
            end: 1532340070,
            granularity: 0,
            start: 1532340061,
            style: 'ticks',
            ticks_history: 'R_50',
        },
        history: {
            prices: ['184.7895', '184.7663', '184.7995', '184.7967', '184.8159'],
            times: ['1532340062', '1532340064', '1532340066', '1532340068', '1532340070'],
        },
        msg_type: 'history',
    };

    const partB = {
        echo_req: {
            adjust_start_time: 1,
            end: 1532340080,
            granularity: 0,
            start: 1532340068,
            style: 'ticks',
            ticks_history: 'R_50',
        },
        history: {
            prices: ['184.7967', '184.8159', '184.7690', '184.7956', '184.8107', '184.7957', '184.7942'],
            times: ['1532340068', '1532340070', '1532340072', '1532340074', '1532340076', '1532340078', '1532340080'],
        },
        msg_type: 'history',
    };
    it('Merge 2 cleanly divided tick arrays', () => {
        const b = {
            history: {
                prices: ['184.7690', '184.7956', '184.8107', '184.7957', '184.7942'],
                times: ['1532340072', '1532340074', '1532340076', '1532340078', '1532340080'],
            },
        };
        expect(() => mergeTickHistory(partA, b)).to.throw('Cannot merge tick data with no overlaps!');
    });

    it('Merge 2 overlapping tick data arrays', () => {
        const merged = mergeTickHistory(partA, partB);
        expect(merged.history).to.deep.equal(fullTickHistoryResponse.history);
    });

    it('Merge 2 overlapping tick data arrays, swap order but result must be the same', () => {
        const merged = mergeTickHistory(partB, partA);
        expect(merged.history).to.deep.equal(fullTickHistoryResponse.history);
    });
});

describe('Test mergeTickHistory (Candles)', () => {
    const full = {
        candles: [
            {
                close: '185.9794',
                epoch: 1532310420,
                high: '185.9872',
                low: '185.8511',
                open: '185.8941',
            },
            {
                close: '185.9287',
                epoch: 1532310480,
                high: '186.0250',
                low: '185.8975',
                open: '185.9583',
            },
            {
                close: '185.9904',
                epoch: 1532310540,
                high: '185.9904',
                low: '185.8018',
                open: '185.9160',
            },
            {
                close: '186.0959',
                epoch: 1532310600,
                high: '186.0996',
                low: '185.9749',
                open: '185.9937',
            },
            {
                close: '186.2465',
                epoch: 1532310660,
                high: '186.2704',
                low: '186.1104',
                open: '186.1215',
            },
            {
                close: '186.2334',
                epoch: 1532310720,
                high: '186.3422',
                low: '186.2178',
                open: '186.3180',
            },
            {
                close: '186.3577',
                epoch: 1532310780,
                high: '186.3614',
                low: '186.1599',
                open: '186.2273',
            },
            {
                close: '186.5384',
                epoch: 1532310840,
                high: '186.5744',
                low: '186.3494',
                open: '186.3494',
            },
            {
                close: '186.4903',
                epoch: 1532310900,
                high: '186.5286',
                low: '186.4118',
                open: '186.5286',
            },
            {
                close: '186.4574',
                epoch: 1532310960,
                high: '186.4574',
                low: '186.4574',
                open: '186.4574',
            },
        ],
        echo_req: {
            adjust_start_time: 1,
            end: 1532310960,
            granularity: 60,
            start: 1532310420,
            style: 'candles',
            ticks_history: 'R_50',
        },
        msg_type: 'candles',
    };

    it('Merge 2 overlapping candle data arrays; patch past', () => {
        const partA = {
            candles: [
                {
                    close: '185.9794',
                    epoch: 1532310420,
                    high: '185.9872',
                    low: '185.8511',
                    open: '185.8941',
                },
                {
                    close: '185.9287',
                    epoch: 1532310480,
                    high: '186.0250',
                    low: '185.8975',
                    open: '185.9583',
                },
                {
                    close: '185.9904',
                    epoch: 1532310540,
                    high: '185.9904',
                    low: '185.8018',
                    open: '185.9160',
                },
                {
                    close: '185.9937',
                    epoch: 1532310600,
                    high: '185.9937',
                    low: '185.9937',
                    open: '185.9937',
                },
            ],
            echo_req: {
                adjust_start_time: 1,
                end: 1532310600,
                granularity: 60,
                start: 1532310420,
                style: 'candles',
                ticks_history: 'R_50',
            },
            msg_type: 'candles',
        };
        const partB = {
            candles: [
                {
                    close: '185.9287',
                    epoch: 1532310500,
                    high: '186.0250',
                    low: '185.8975',
                    open: '186.0114',
                },
                {
                    close: '185.9904',
                    epoch: 1532310540,
                    high: '185.9904',
                    low: '185.8018',
                    open: '185.9160',
                },
                {
                    close: '186.0959',
                    epoch: 1532310600,
                    high: '186.0996',
                    low: '185.9749',
                    open: '185.9937',
                },
                {
                    close: '186.2465',
                    epoch: 1532310660,
                    high: '186.2704',
                    low: '186.1104',
                    open: '186.1215',
                },
                {
                    close: '186.2334',
                    epoch: 1532310720,
                    high: '186.3422',
                    low: '186.2178',
                    open: '186.3180',
                },
                {
                    close: '186.3577',
                    epoch: 1532310780,
                    high: '186.3614',
                    low: '186.1599',
                    open: '186.2273',
                },
                {
                    close: '186.5384',
                    epoch: 1532310840,
                    high: '186.5744',
                    low: '186.3494',
                    open: '186.3494',
                },
                {
                    close: '186.4903',
                    epoch: 1532310900,
                    high: '186.5286',
                    low: '186.4118',
                    open: '186.5286',
                },
                {
                    close: '186.4574',
                    epoch: 1532310960,
                    high: '186.4574',
                    low: '186.4574',
                    open: '186.4574',
                },
            ],
            echo_req: {
                adjust_start_time: 1,
                end: 1532310960,
                granularity: 60,
                start: 1532310500,
                style: 'candles',
                ticks_history: 'R_50',
            },
            msg_type: 'candles',
        };
        const merged = mergeTickHistory(partA, partB);
        expect(merged.candles).to.deep.equal(full.candles);
    });

    it('Merge 2 overlapping candle data arrays; patch future', () => {
        const partA = {
            candles: [
                {
                    close: '185.9794',
                    epoch: 1532310420,
                    high: '185.9872',
                    low: '185.8511',
                    open: '185.8941',
                },
                {
                    close: '185.9287',
                    epoch: 1532310480,
                    high: '186.0250',
                    low: '185.8975',
                    open: '185.9583',
                },
                {
                    close: '185.9904',
                    epoch: 1532310540,
                    high: '185.9904',
                    low: '185.8018',
                    open: '185.9160',
                },
                {
                    close: '186.0959',
                    epoch: 1532310600,
                    high: '186.0996',
                    low: '185.9749',
                    open: '185.9937',
                },
                {
                    close: '186.2465',
                    epoch: 1532310660,
                    high: '186.2704',
                    low: '186.1104',
                    open: '186.1215',
                },
                {
                    close: '186.2334',
                    epoch: 1532310720,
                    high: '186.3422',
                    low: '186.2178',
                    open: '186.3180',
                },
                {
                    close: '186.2273',
                    epoch: 1532310780,
                    high: '186.2273',
                    low: '186.2273',
                    open: '186.2273',
                },
            ],
            echo_req: {
                adjust_start_time: 1,
                end: 1532310780,
                granularity: 60,
                start: 1532310420,
                style: 'candles',
                ticks_history: 'R_50',
            },
            msg_type: 'candles',
        };
        const partB = {
            candles: [
                {
                    close: '186.2465',
                    epoch: 1532310660,
                    high: '186.2704',
                    low: '186.1104',
                    open: '186.1215',
                },
                {
                    close: '186.2334',
                    epoch: 1532310720,
                    high: '186.3422',
                    low: '186.2178',
                    open: '186.3180',
                },
                {
                    close: '186.3577',
                    epoch: 1532310780,
                    high: '186.3614',
                    low: '186.1599',
                    open: '186.2273',
                },
                {
                    close: '186.5384',
                    epoch: 1532310840,
                    high: '186.5744',
                    low: '186.3494',
                    open: '186.3494',
                },
                {
                    close: '186.4903',
                    epoch: 1532310900,
                    high: '186.5286',
                    low: '186.4118',
                    open: '186.5286',
                },
                {
                    close: '186.4574',
                    epoch: 1532310960,
                    high: '186.4574',
                    low: '186.4574',
                    open: '186.4574',
                },
            ],
            echo_req: {
                adjust_start_time: 1,
                end: 1532310960,
                granularity: 60,
                start: 1532310660,
                style: 'candles',
                ticks_history: 'R_50',
            },
            msg_type: 'candles',
        };
        const merged = mergeTickHistory(partB, partA);
        expect(merged.candles).to.deep.equal(full.candles);
    });

    const smallGapPartA = {
        candles: [
            {
                close: '185.9794',
                epoch: 1532310420,
                high: '185.9872',
                low: '185.8511',
                open: '185.8941',
            },
            {
                close: '185.9287',
                epoch: 1532310480,
                high: '186.0250',
                low: '185.8975',
                open: '185.9583',
            },
            {
                close: '185.9904',
                epoch: 1532310540,
                high: '185.9904',
                low: '185.8018',
                open: '185.9160',
            },
            {
                close: '186.0959',
                epoch: 1532310600,
                high: '186.0996',
                low: '185.9749',
                open: '185.9937',
            },
            {
                close: '186.2025',
                epoch: 1532310660,
                high: '186.2280',
                low: '186.1104',
                open: '186.1215',
            },
        ],
        echo_req: {
            adjust_start_time: 1,
            end: 1532310690,
            granularity: 60,
            start: 1532310420,
            style: 'candles',
            ticks_history: 'R_50',
        },
        msg_type: 'candles',
    };
    const smallGapPartB = {
        candles: [
            {
                close: '186.2465',
                epoch: 1532310660,
                high: '186.2704',
                low: '186.1104',
                open: '186.1215',
            },
            {
                close: '186.2334',
                epoch: 1532310720,
                high: '186.3422',
                low: '186.2178',
                open: '186.3180',
            },
            {
                close: '186.3577',
                epoch: 1532310780,
                high: '186.3614',
                low: '186.1599',
                open: '186.2273',
            },
            {
                close: '186.5384',
                epoch: 1532310840,
                high: '186.5744',
                low: '186.3494',
                open: '186.3494',
            },
            {
                close: '186.4903',
                epoch: 1532310900,
                high: '186.5286',
                low: '186.4118',
                open: '186.5286',
            },
            {
                close: '186.4574',
                epoch: 1532310960,
                high: '186.4574',
                low: '186.4574',
                open: '186.4574',
            },
        ],
        echo_req: {
            adjust_start_time: 1,
            end: 1532310960,
            granularity: 60,
            start: 1532310660,
            style: 'candles',
            ticks_history: 'R_50',
        },
        msg_type: 'candles',
    };

    it('Merge 2 overlapping candle data arrays; patch future (1 overlap, PartB takes precedence)', () => {
        const merged = mergeTickHistory(smallGapPartA, smallGapPartB);
        expect(merged.candles).to.deep.equal(full.candles);
    });

    it('Merge 2 overlapping candle data arrays; patch future (1 overlap, PartA takes precedence)', () => {
        const otherFull = [
            {
                close: '185.9794',
                epoch: 1532310420,
                high: '185.9872',
                low: '185.8511',
                open: '185.8941',
            },
            {
                close: '185.9287',
                epoch: 1532310480,
                high: '186.0250',
                low: '185.8975',
                open: '185.9583',
            },
            {
                close: '185.9904',
                epoch: 1532310540,
                high: '185.9904',
                low: '185.8018',
                open: '185.9160',
            },
            {
                close: '186.0959',
                epoch: 1532310600,
                high: '186.0996',
                low: '185.9749',
                open: '185.9937',
            },
            {
                close: '186.2025',
                epoch: 1532310660,
                high: '186.2280',
                low: '186.1104',
                open: '186.1215',
            },
            {
                close: '186.2334',
                epoch: 1532310720,
                high: '186.3422',
                low: '186.2178',
                open: '186.3180',
            },
            {
                close: '186.3577',
                epoch: 1532310780,
                high: '186.3614',
                low: '186.1599',
                open: '186.2273',
            },
            {
                close: '186.5384',
                epoch: 1532310840,
                high: '186.5744',
                low: '186.3494',
                open: '186.3494',
            },
            {
                close: '186.4903',
                epoch: 1532310900,
                high: '186.5286',
                low: '186.4118',
                open: '186.5286',
            },
            {
                close: '186.4574',
                epoch: 1532310960,
                high: '186.4574',
                low: '186.4574',
                open: '186.4574',
            },
        ];
        // second parameter will always take precedence over first!
        const merged = mergeTickHistory(smallGapPartB, smallGapPartA);
        expect(merged.candles).to.deep.equal(otherFull);
    });

    it('Cannot merge candle data with no overlaps', () => {
        const incompleteB = {
            candles: [
                {
                    close: '186.2465',
                    epoch: 1532310690,
                    high: '186.2704',
                    low: '186.1645',
                    open: '186.2025',
                },
                {
                    close: '186.2334',
                    epoch: 1532310720,
                    high: '186.3422',
                    low: '186.2178',
                    open: '186.3180',
                },
                {
                    close: '186.3577',
                    epoch: 1532310780,
                    high: '186.3614',
                    low: '186.1599',
                    open: '186.2273',
                },
                {
                    close: '186.5384',
                    epoch: 1532310840,
                    high: '186.5744',
                    low: '186.3494',
                    open: '186.3494',
                },
                {
                    close: '186.4903',
                    epoch: 1532310900,
                    high: '186.5286',
                    low: '186.4118',
                    open: '186.5286',
                },
                {
                    close: '186.4574',
                    epoch: 1532310960,
                    high: '186.4574',
                    low: '186.4574',
                    open: '186.4574',
                },
            ],
            echo_req: {
                adjust_start_time: 1,
                end: 1532310960,
                granularity: 60,
                start: 1532310690,
                style: 'candles',
                ticks_history: 'R_50',
            },
            msg_type: 'candles',
        };
        expect(() => mergeTickHistory(smallGapPartA, incompleteB)).to.throw('Candle data cannot be merged!');
    });
});
