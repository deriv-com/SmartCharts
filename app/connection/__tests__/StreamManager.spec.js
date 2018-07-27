import chai, { expect } from 'chai';
import { describe, it } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'chai-sinon';
import StreamManager from '../StreamManager';
import { dummyTickData, dummyOhlcData, dummyErrorResponse } from './dummyData';
import { DummyConnectionManager } from './DummyConnectionManager';

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

    const SPY_COUNT = 10;
    const subscriberSpies = Array.from(Array(SPY_COUNT), () => sinon.spy());

    it('subscribe should call send request, and callback passed to subscribe should be called', async () => {
        MAX_CACHE_TICKS = 16;
        sm.MAX_CACHE_TICKS = MAX_CACHE_TICKS;
        dcm.response = dummyTickData[0];
        await sm.subscribe(tickRequest, subscriberSpies[0]);
        expect(subscriberSpies[0]).to.have.callCount(1);
        expect(dcm.sendSpy).to.have.callCount(1);
    });

    it('tick emissions should trigger subscribe callback to be called', () => {
        dcm.emitTick(dummyTickData[1]);
        dcm.emitTick(dummyTickData[2]);
        expect(subscriberSpies[0]).to.have.callCount(3);
    });

    it('Second subcriber should get updated tick history without make additional send requests', async () => {
        await sm.subscribe(tickRequest, subscriberSpies[1]);
        const { history: { prices } } = subscriberSpies[1].getCall(0).args[0];
        expect(prices.length).to.be.equal(MAX_CACHE_TICKS);
        expect(prices[prices.length - 1]).to.be.equal(dummyTickData[2].tick.quote);
        expect(subscriberSpies[1]).to.have.callCount(1);
        expect(dcm.sendSpy).to.have.callCount(1);
    });

    it('tick emissions with multiple subscribers should trigger all subscribers with the same data', () => {
        dcm.emitTick(dummyTickData[3]);
        expect(subscriberSpies[0].lastCall.args[0]).to.deep.equal(subscriberSpies[1].lastCall.args[0]);
        expect(subscriberSpies[0]).to.have.callCount(4);
        expect(subscriberSpies[1]).to.have.callCount(2);
    });

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
        await sm.subscribe(ohlcRequest, subscriberSpies[2]);
        const { candles } = subscriberSpies[2].getCall(0).args[0];
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
        expect(subscriberSpies[2]).to.have.callCount(5);
        await sm.subscribe(ohlcRequest, subscriberSpies[3]);
        const { candles } = subscriberSpies[3].firstCall.args[0];
        expect(candles.length).to.be.equal(29);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[4].ohlc.close);
    });

    it('Sending candle data of newer open time will add to candle cache', async () => {
        sm.MAX_CACHE_TICKS = MAX_CACHE_TICKS;
        // last 4 ticks have open time of 1532593020
        for (let i = 5; i <= 8; i++) {
            dcm.emitTick(dummyOhlcData[i]);
        }
        expect(subscriberSpies[2]).to.have.callCount(9);
        await sm.subscribe(ohlcRequest, subscriberSpies[4]);
        const { candles } = subscriberSpies[4].firstCall.args[0];
        expect(candles.length).to.be.equal(30);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[8].ohlc.close);
    });

    it('Test MAX_CACHE_TICKS limit (hardcoded to 30 here)', async () => {
        dcm.emitTick(dummyOhlcData[9]);
        await sm.subscribe(ohlcRequest, subscriberSpies[5]);
        const { candles } = subscriberSpies[5].firstCall.args[0];
        expect(candles.length).to.be.equal(30);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[9].ohlc.close);
        const secondCandle = dummyOhlcData[0].candles[1];
        expect(candles[0].close).to.be.equal(secondCandle.close);
        expect(dcm.sendSpy).to.have.callCount(2);
    });

    function expectForgetRequestSent() {
        const expectedForgetRequest = { forget: 'ab6b802d-2fe7-f52f-c19a-557d7b757a1a' };
        const { request } = dcm.sendSpy.lastCall.args[0];
        expect(request).to.be.deep.equal(expectedForgetRequest);
    }

    it('Forgeting all subscribed streams to trigger a forget request', async () => {
        for (let i = 2; i <= 5; i++) {
            sm.forget(ohlcRequest, subscriberSpies[i]);
        }
        expect(dcm.sendSpy).to.have.callCount(3);
        expectForgetRequestSent();
    });

    it('If stream tick (which has stream ID for forgetting a stream), forget request is send immediately after a tick is received', async () => {
        await sm.subscribe(ohlcRequest, subscriberSpies[2]);
        const response = subscriberSpies[2].lastCall.args[0];
        expect(dcm.sendSpy).to.have.callCount(4);
        expect(response.msg_type).to.be.equal('candles');
        sm.forget(ohlcRequest, subscriberSpies[2]);
        expect(dcm.sendSpy).to.have.callCount(4); // No stream ID to forget
        // Now we pass a tick...
        dcm.emitTick(dummyOhlcData[5]);
        expect(dcm.sendSpy).to.have.callCount(5);
        expectForgetRequestSent();
    });

    it('If there is an error in tick_history request, we expect no ticks to be received by subscribers, and that any incoming ticks for that request will trigger a forget request', async () => {
        dcm.response = dummyErrorResponse;
        await sm.subscribe(ohlcRequest, subscriberSpies[6]);
        expect(subscriberSpies[6]).to.have.been.calledOnce;
        dcm.emitTick(dummyOhlcData[5]);
        expect(subscriberSpies[6]).to.have.been.calledOnce;
        expect(dcm.sendSpy).to.have.callCount(7);
        expectForgetRequestSent();
    });

    it('If connection is closed, we do not expect any ticks to be entering, and that no forget requests should be sent', async () => {
        dcm.response = dummyOhlcData[0];
        await sm.subscribe(ohlcRequest, subscriberSpies[7]);
        expect(subscriberSpies[7]).to.have.been.calledOnce;
        expect(dcm.sendSpy).to.have.callCount(8);
        dcm.close();
        expect(dcm.sendSpy).to.have.callCount(8);
        dcm.emitTick(dummyOhlcData[5]);
        expect(subscriberSpies[7]).to.have.been.calledOnce;
    });

    it('If >=2 subscribers are attached to a stream prior to receiving tick_history, upon receiving tick_history response they should both have the same response and incoming ticks', async () => {
        dcm.response = null;
        const spies = [8, 9].map(i => subscriberSpies[i]);
        spies.forEach(spy => sm.subscribe(ohlcRequest, spy));
        expect(dcm.sendSpy).to.have.callCount(9);
        spies.forEach(spy => expect(spy).to.have.not.been.called);
        dcm.response = dummyOhlcData[0];
        // Promises take time to resolve; use timeout to expect calls only after response is received
        setTimeout(() => {
            spies.forEach(spy => expect(spy).to.have.been.calledOnce);
            const candles = spies.map(spy => spy.lastCall.args[0].candles);
            expect(candles[0]).to.be.deep.equal(candles[1]);
        }, 0);
    });
});
