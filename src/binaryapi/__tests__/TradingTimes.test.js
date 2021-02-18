import sinon from 'sinon';
import TradingTimes from '../TradingTimes';
import DummyBinaryAPI from './DummyBinaryAPI';

describe('TradingTimes test', () => {
    const unlicensedSymbols = ['SPC', 'DFMGI', 'AS51'];
    let dummy_binary_api;
    let spy_dummy_binary_api;
    let trading_time;
    let clock;

    beforeEach(async () => {
        clock = sinon.useFakeTimers({
            now: 1535068800000, // Friday, 2018-08-24
        });
        dummy_binary_api = new DummyBinaryAPI();
        spy_dummy_binary_api = jest.spyOn(dummy_binary_api, 'getTradingTimes');
        trading_time = new TradingTimes(dummy_binary_api);
        await trading_time.initialize();
    });

    afterEach(() => {
        dummy_binary_api = null;
        trading_time.destructor();
        trading_time = null;
    });

    it('Test isFeedUnavailable works', async () => {
        for (const s of unlicensedSymbols) {
            expect(trading_time.isFeedUnavailable(s)).toBe(true);
        }

        for (const s of ['R_100', 'frxEURAUD', 'frxXAGUSD']) {
            expect(trading_time.isFeedUnavailable(s)).toBe(false);
        }
    });

    it('Test getDelayedMinutes', function () {
        expect(trading_time.getDelayedMinutes('BSESENSEX30')).toEqual(10);
        expect(trading_time.getDelayedMinutes('R_50')).toEqual(0);
    });

    it('Unlicensed feed will also be marked as closed', function () {
        for (const s of unlicensedSymbols) {
            expect(trading_time.isMarketOpened(s)).toBe(false);
        }
    });

    it('Test if onMarketOpenCloseChanged event is fired correctly', function () {
        const spy = sinon.spy();
        trading_time.onMarketOpenCloseChanged(spy);
        // STI (Singapore Index) opens at 1:00 and closes at 9:00
        setTimeout(() => {
            clock.tick('00:59:00');
            expect(spy).toHaveBeenCalledTimes(0);
            expect(trading_time.isMarketOpened('STI')).toBe(false);

            clock.tick('00:01:00');
            expect(spy).toHaveBeenCalledTimes(1);
            expect(trading_time.isMarketOpened('STI')).toBe(true);

            clock.tick('07:59:00');
            expect(trading_time.isMarketOpened('STI')).toBe(true);

            clock.tick('00:01:00');
            expect(trading_time.isMarketOpened('STI')).toBe(false);
        }, 0);
    });

    it('Test onMarketOpenCloseChanged changed object is correct', function () {
        const spy = sinon.spy();
        let changes;
        trading_time.onMarketOpenCloseChanged(spy);
        setTimeout(() => {
            clock.tick('07:00:00'); // 7:00:00
            changes = spy.lastCall.args[0];
            for (const symbol of ['BFX', 'AEX', 'FCHI', 'OBX']) {
                expect(changes[symbol]).toBe(true);
            }

            clock.tick('07:30:00'); // 14:30:00

            changes = spy.lastCall.args[0];
            expect(changes['OBX']).toBe(false);

            clock.tick('01:00:00'); // 15:30:00

            changes = spy.lastCall.args[0];
            for (const symbol of ['BFX', 'AEX', 'FCHI']) {
                expect(changes[symbol]).toBe(false);
            }
        }, 0);
    });

    it('Test onMarketOpenCloseChanged changed object in multiple open close sessions', function () {
        const spy = sinon.spy();
        const OTC_HSI = 'OTC_HSI';
        let changes;
        trading_time.onMarketOpenCloseChanged(spy);

        setTimeout(() => {
            clock.tick('01:30:00'); // 1:30:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).toBe(true);

            clock.tick('02:30:00'); // 4:00:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).toBe(false);

            clock.tick('01:00:00'); // 5:00:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).toBe(true);

            clock.tick('03:00:00'); // 8:00:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).toBe(false);
        }, 0);
    });

    it('Trade request for the next day will be called if no available open/closing times are available for query', function () {
        expect(spy_dummy_binary_api).toHaveBeenCalled();
        const getCalledDate = () => dummy_binary_api.getTradingTimes.lastCall.args[0];

        // put a slight delay for async request to finish executing
        setTimeout(() => {
            expect(getCalledDate()).toEqual('2018-08-24');

            clock.tick('24:00:00');
            expect(getCalledDate()).toEqual('2018-08-25');

            clock.tick('24:00:00');
            expect(getCalledDate()).toEqual('2018-08-26');
        }, 0);
    });

    it('Test markets that closed on certain days of the week', function () {
        const frxAUDJPY = 'frxAUDJPY';

        expect(trading_time.isMarketOpened(frxAUDJPY)).toBe(true);

        clock.tick('24:00:00'); // Saturday, 00:00:00

        // put a slight delay for async request to finish executing
        setTimeout(() => {
            expect(trading_time.isMarketOpened(frxAUDJPY)).toBe(false);
            clock.tick('47:59:00'); // Sunday, 23:59:00
            expect(trading_time.isMarketOpened(frxAUDJPY)).toBe(false);
            clock.tick('00:01:00'); // Monday, 00:00:00
            expect(trading_time.isMarketOpened(frxAUDJPY)).toBe(true);
            clock.tick('00:01:00'); // Monday, 00:00:00
        }, 0);
    });
});
