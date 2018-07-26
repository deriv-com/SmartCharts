import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'chai-sinon';
import StreamManager from '../StreamManager';
import { DummyConnectionManager, dummyTickData, dummyOhlcData } from './dummies';

chai.use(sinonChai);

describe('Test StreamManager', () => {
    let MAX_CACHE_TICKS;
    const dcm = new DummyConnectionManager();
    const sm = new StreamManager(dcm);
    const tickRequest = {
        ticks_history: 'R_25',
        end: 'latest',
        adjust_start_time: 1,
        subscribe: 1,
        style: 'ticks',
        granularity: 0,
        start: 1532587905,
        req_id: 2,
    };
    const subscriberSpy1 = sinon.spy();

    it('subscribe should call send request, and callback passed to subscribe should be called', async () => {
        MAX_CACHE_TICKS = 16;
        sm.MAX_CACHE_TICKS = MAX_CACHE_TICKS;
        dcm.response = dummyTickData[0];
        await sm.subscribe(tickRequest, subscriberSpy1);
        expect(subscriberSpy1).to.have.callCount(1);
        expect(dcm.sendSpy).to.have.callCount(1);
    });

    it('tick emissions should trigger subscribe callback to be called', () => {
        dcm.emitTick(dummyTickData[1]);
        dcm.emitTick(dummyTickData[2]);
        expect(subscriberSpy1).to.have.callCount(3);
    });

    const subscriberSpy2 = sinon.spy();

    it('Second subcriber should get updated tick history without make additional send requests', async () => {
        await sm.subscribe(tickRequest, subscriberSpy2);
        const { history: { prices } } = subscriberSpy2.getCall(0).args[0];
        expect(prices.length).to.be.equal(MAX_CACHE_TICKS);
        expect(prices[prices.length - 1]).to.be.equal(dummyTickData[2].tick.quote);
        expect(subscriberSpy2).to.have.callCount(1);
        expect(dcm.sendSpy).to.have.callCount(1);
    });

    it('tick emissions with multiple subscribers should trigger all subscribers with the same data', () => {
        dcm.emitTick(dummyTickData[3]);
        expect(subscriberSpy1.lastCall.args[0]).to.deep.equal(subscriberSpy2.lastCall.args[0]);
        expect(subscriberSpy1).to.have.callCount(4);
        expect(subscriberSpy2).to.have.callCount(2);
    });

    const subscriberSpy3 = sinon.spy();
    const ohlcRequest = {
        ticks_history: 'R_25',
        end: 'latest',
        adjust_start_time: 1,
        subscribe: 1,
        style: 'candles',
        granularity: 60,
        start: 1532591280,
        req_id: 2,
    };

    it('Test send request for candle data', async () => {
        dcm.response = dummyOhlcData[0];
        await sm.subscribe(ohlcRequest, subscriberSpy3);
        const { candles } = subscriberSpy3.getCall(0).args[0];
        expect(candles.length).to.be.equal(29);
        expect(dcm.sendSpy).to.have.callCount(2);
    });

    it('Sending candle data of same open time will override the last candle cache', async () => {
        MAX_CACHE_TICKS = 30;
        sm.MAX_CACHE_TICKS = MAX_CACHE_TICKS;
        // first 4 ticks have open time of 1532592960
        for (let i = 1; i <= 4; i++) {
            dcm.emitTick(dummyOhlcData[i]);
        }
        expect(subscriberSpy3).to.have.callCount(5);
        let tempSpy = sinon.spy();
        await sm.subscribe(ohlcRequest, tempSpy);
        const { candles } = tempSpy.getCall(0).args[0];
        expect(candles.length).to.be.equal(29);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[4].ohlc.close);
    });

    it('Sending candle data of newer open time will add to candle cache', async () => {
        sm.MAX_CACHE_TICKS = MAX_CACHE_TICKS;
        // last 4 ticks have open time of 1532593020
        for (let i = 5; i <= 8; i++) {
            dcm.emitTick(dummyOhlcData[i]);
        }
        expect(subscriberSpy3).to.have.callCount(9);
        let tempSpy = sinon.spy();
        await sm.subscribe(ohlcRequest, tempSpy);
        const { candles } = tempSpy.getCall(0).args[0];
        expect(candles.length).to.be.equal(30);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[8].ohlc.close);
    });

    it('Test MAX_CACHE_TICKS limit (hardcoded to 30 here)', async () => {
        dcm.emitTick(dummyOhlcData[9]);
        let tempSpy = sinon.spy();
        await sm.subscribe(ohlcRequest, tempSpy);
        const { candles } = tempSpy.getCall(0).args[0];
        expect(candles.length).to.be.equal(30);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[9].ohlc.close);
        const secondCandle = dummyOhlcData[0].candles[1];
        expect(candles[0].close).to.be.equal(secondCandle.close);
        expect(dcm.sendSpy).to.have.callCount(2);
    });
});
