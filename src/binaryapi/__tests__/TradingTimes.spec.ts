import { afterEach, beforeEach, describe, it } from 'mocha';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import TradingTimes from '../TradingTimes';
import DummyBinaryAPI from './DummyBinaryAPI';

chai.use(sinonChai);

describe('TradingTimes test', async function () {
    const unlicensedSymbols = ['SPC', 'DFMGI', 'AS51'];

    beforeEach(async function () {
        this.clock = sinon.useFakeTimers({
            now: 1535068800000, // Friday, 2018-08-24
        });
        this.dummyBinaryApi = new DummyBinaryAPI();
        this.tt = new TradingTimes(this.dummyBinaryApi);
        await this.tt.initialize();
    });

    afterEach(function () {
        this.tt.destructor();
        this.clock.restore();
    });

    it('Test isFeedUnavailable works', function () {
        for (const s of unlicensedSymbols) {
            expect(this.tt.isFeedUnavailable(s)).to.be.true;
        }

        for (const s of ['R_100', 'frxEURAUD', 'frxXAGUSD']) {
            expect(this.tt.isFeedUnavailable(s)).to.be.false;
        }
    });

    it('Test getDelayedMinutes', function () {
        expect(this.tt.getDelayedMinutes('BSESENSEX30')).to.be.equal(10);
        expect(this.tt.getDelayedMinutes('R_50')).to.be.equal(0);
    });

    it('Unlicensed feed will also be marked as closed', function () {
        for (const s of unlicensedSymbols) {
            expect(this.tt.isMarketOpened(s)).to.be.false;
        }
    });

    it('Test if onMarketOpenCloseChanged event is fired correctly', function () {
        const spy = sinon.spy();
        this.tt.onMarketOpenCloseChanged(spy);
        // STI (Singapore Index) opens at 1:00 and closes at 9:00
        setTimeout(() => {
            this.clock.tick('00:59:00');
            expect(spy).to.have.callCount(0);
            expect(this.tt.isMarketOpened('STI')).to.be.false;
            this.clock.tick('00:01:00');
            expect(spy).to.have.callCount(1);
            expect(this.tt.isMarketOpened('STI')).to.be.true;
            this.clock.tick('07:59:00');
            expect(this.tt.isMarketOpened('STI')).to.be.true;
            this.clock.tick('00:01:00');
            expect(this.tt.isMarketOpened('STI')).to.be.false;
        }, 0);
    });

    it('Test onMarketOpenCloseChanged changed object is correct', function () {
        const spy = sinon.spy();
        let changes;
        this.tt.onMarketOpenCloseChanged(spy);
        setTimeout(() => {
            this.clock.tick('07:00:00'); // 7:00:00
            changes = spy.lastCall.args[0];
            for (const symbol of ['BFX', 'AEX', 'FCHI', 'OBX']) {
                expect(changes[symbol]).to.be.true;
            }

            this.clock.tick('07:30:00'); // 14:30:00

            changes = spy.lastCall.args[0];
            expect(changes['OBX']).to.be.false;

            this.clock.tick('01:00:00'); // 15:30:00

            changes = spy.lastCall.args[0];
            for (const symbol of ['BFX', 'AEX', 'FCHI']) {
                expect(changes[symbol]).to.be.false;
            }
        }, 0);
    });

    it('Test onMarketOpenCloseChanged changed object in multiple open close sessions', function () {
        const spy = sinon.spy();
        const OTC_HSI = 'OTC_HSI';
        let changes;
        this.tt.onMarketOpenCloseChanged(spy);

        setTimeout(() => {
            this.clock.tick('01:30:00'); // 1:30:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).to.be.true;

            this.clock.tick('02:30:00'); // 4:00:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).to.be.false;

            this.clock.tick('01:00:00'); // 5:00:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).to.be.true;

            this.clock.tick('03:00:00'); // 8:00:00

            changes = spy.lastCall.args[0];
            expect(changes[OTC_HSI]).to.be.false;
        }, 0);
    });

    it('Trade request for the next day will be called if no available open/closing times are available for query', function () {
        expect(this.dummyBinaryApi.getTradingTimes).to.be.calledOnce;
        const getCalledDate = () => this.dummyBinaryApi.getTradingTimes.lastCall.args[0];

        // put a slight delay for async request to finish executing
        setTimeout(() => {
            expect(getCalledDate()).to.equal('2018-08-24');
            this.clock.tick('24:00:00');
            expect(getCalledDate()).to.equal('2018-08-25');
            this.clock.tick('24:00:00');
            expect(getCalledDate()).to.equal('2018-08-26');
        }, 0);
    });

    it('Test markets that closed on certain days of the week', function () {
        const frxAUDJPY = 'frxAUDJPY';

        expect(this.tt.isMarketOpened(frxAUDJPY)).to.be.true;

        this.clock.tick('24:00:00'); // Saturday, 00:00:00

        // put a slight delay for async request to finish executing
        setTimeout(() => {
            expect(this.tt.isMarketOpened(frxAUDJPY)).to.be.false;
            this.clock.tick('47:59:00'); // Sunday, 23:59:00
            expect(this.tt.isMarketOpened(frxAUDJPY)).to.be.false;
            this.clock.tick('00:01:00'); // Monday, 00:00:00
            expect(this.tt.isMarketOpened(frxAUDJPY)).to.be.true;
            this.clock.tick('00:01:00'); // Monday, 00:00:00
        }, 0);
    });
});
