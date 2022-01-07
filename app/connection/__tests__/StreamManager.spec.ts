// @ts-nocheck
import chai, { expect } from 'chai';
import { describe, it, beforeEach, afterEach } from 'mocha';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import StreamManager from '../StreamManager';
import { dummyTickData, dummyOhlcData, dummyErrorResponse } from './dummyData';
import { DummyConnectionManager } from './DummyConnectionManager';

chai.use(sinonChai);

describe('Test StreamManager (Tick)', function () {
    let dcm: DummyConnectionManager, sm: StreamManager;

    beforeEach(function () {
        dcm = new DummyConnectionManager();
        sm = new StreamManager(dcm);
        dcm.response = dummyTickData[0];
        sm.MAX_CACHE_TICKS = 16;
    });

    afterEach(function () {
        dcm.close();
    });

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

    it('subscribe should call send request, and callback passed to subscribe should be called', async function () {
        dcm.response = dummyTickData[0];
        const spy = sinon.spy();
        await sm.subscribe(tickRequest, spy);
        expect(spy).to.have.callCount(1);
        expect(dcm.send).to.have.callCount(1);
    });

    it('tick emissions should trigger subscribe callback to be called', async function () {
        dcm.response = dummyTickData[0];
        const spy = sinon.spy();
        await sm.subscribe(tickRequest, spy); // #1
        dcm.emitTick(dummyTickData[1]); // #2
        dcm.emitTick(dummyTickData[2]); // #3
        expect(spy).to.have.callCount(3);
    });

    it('Second subcriber should get updated tick history without make additional send requests', async function () {
        dcm.response = dummyTickData[0];
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        await sm.subscribe(tickRequest, spy1);
        dcm.emitTick(dummyTickData[1]);
        dcm.emitTick(dummyTickData[2]);

        await sm.subscribe(tickRequest, spy2);
        const {
            history: { prices },
        } = spy2.getCall(0).args[0];
        expect(prices.length).to.be.equal(16);
        expect(prices[prices.length - 1]).to.be.equal(dummyTickData[2].tick.quote);
        expect(spy2).to.have.callCount(1);
        expect(dcm.send).to.have.callCount(1);
    });

    it('tick emissions with multiple subscribers should trigger all subscribers with the same data', async function () {
        dcm.response = dummyTickData[0];
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        await sm.subscribe(tickRequest, spy1);
        await sm.subscribe(tickRequest, spy2);
        dcm.emitTick(dummyTickData[1]);

        expect(spy1.lastCall.args[0]).to.deep.equal(spy2.lastCall.args[0]);
        expect(spy1).to.have.callCount(2);
        expect(spy1).to.have.callCount(spy2.callCount);
    });

    it('Test send request for candle data', async function () {
        dcm.response = dummyOhlcData[0];
        const spy1 = sinon.spy();

        await sm.subscribe(ohlcRequest, spy1);
        const { candles } = spy1.getCall(0).args[0];
        expect(candles.length).to.be.equal(29);
        expect(dcm.send).to.have.callCount(1);
    });

    it('Sending candle data of same open time will override the last candle cache', async function () {
        dcm.response = dummyOhlcData[0];
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        await sm.subscribe(ohlcRequest, spy1);
        sm.MAX_CACHE_TICKS = 30;
        // first 4 ticks have open time of 1532592960
        for (let i = 1; i <= 4; i++) {
            dcm.emitTick(dummyOhlcData[i]);
        }
        expect(spy1).to.have.callCount(5);
        await sm.subscribe(ohlcRequest, spy2);
        const { candles } = spy2.firstCall.args[0];
        expect(candles.length).to.be.equal(29);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[4].ohlc.close);
    });

    it('Sending candle data of newer open time will add to candle cache', async function () {
        dcm.response = dummyOhlcData[0];
        sm.MAX_CACHE_TICKS = 30;
        const spy1 = sinon.spy();
        const spy2 = sinon.spy();
        await sm.subscribe(ohlcRequest, spy1);
        const { candles: spy1Candles } = spy1.firstCall.args[0];
        expect(spy1Candles.length).to.be.equal(29);
        // last 4 ticks have open time of 1532593020
        for (let i = 4; i <= 8; i++) {
            dcm.emitTick(dummyOhlcData[i]);
        }
        expect(spy1).to.have.callCount(6);
        await sm.subscribe(ohlcRequest, spy2);
        expect(spy2).to.have.callCount(1);
        const { candles: spy2Candles } = spy2.firstCall.args[0];
        expect(spy1Candles.length).to.be.equal(29); // Existing candles retrieved earlier should not be mutated
        expect(spy2Candles.length).to.be.equal(30);
        expect(spy2Candles[spy2Candles.length - 1].close).to.be.equal(dummyOhlcData[8].ohlc.close);
    });

    it('Test MAX_CACHE_TICKS limit (hardcoded to 29 here)', async function () {
        const tempSpy = sinon.spy();
        dcm.response = dummyOhlcData[0];
        sm.MAX_CACHE_TICKS = 29;
        await sm.subscribe(ohlcRequest, tempSpy);
        for (let i = 1; i <= 9; i++) {
            dcm.emitTick(dummyOhlcData[i]);
        }
        const spy = sinon.spy();
        await sm.subscribe(ohlcRequest, spy);
        const { candles } = spy.firstCall.args[0];
        expect(candles.length).to.be.equal(29);
        expect(candles[candles.length - 1].close).to.be.equal(dummyOhlcData[9].ohlc.close);
    });

    function expectForgetRequestSent() {
        const expectedForgetRequest = { forget: 'ab6b802d-2fe7-f52f-c19a-557d7b757a1a' };
        const request = dcm.send.lastCall.args[0];
        expect(request).to.be.deep.equal(expectedForgetRequest);
    }

    it('Forgeting all subscribed streams to trigger a forget request, if and only if stream ID is available', async function () {
        const SPY_COUNT = 10;
        dcm.response = dummyOhlcData[0];
        const subscriberSpies = Array.from(Array(SPY_COUNT), () => sinon.spy());

        for (let i = 0; i < SPY_COUNT; i++) {
            await sm.subscribe(ohlcRequest, subscriberSpies[i]);
        }

        expect(dcm.send).callCount(1);

        for (let i = 0; i < SPY_COUNT; i++) {
            sm.forget(ohlcRequest, subscriberSpies[i]);
        }

        expect(dcm.send).callCount(1); // no tick == no stream ID. No forget is sent
        dcm.emitTick(dummyOhlcData[4]); // ...tick now contains stream ID
        expect(dcm.send).callCount(2); // ...so forget request can be sent.

        expectForgetRequestSent();
    });

    it('If there is an error in tick_history request, we expect no ticks to be received by subscribers, and that any incoming ticks for that request will trigger a forget request', async function () {
        dcm.response = dummyErrorResponse;
        const spy = sinon.spy();

        await sm.subscribe(ohlcRequest, spy);
        expect(spy).to.have.been.calledOnce;
        dcm.emitTick(dummyOhlcData[5]);
        expectForgetRequestSent();
        expect(spy).to.have.been.calledOnce;
    });

    it('Test when connection closes, active streams are discarded and no forget requests should be sent', async function () {
        const spy = sinon.spy();
        dcm.response = dummyOhlcData[0];
        await sm.subscribe(ohlcRequest, spy);
        expect(spy).to.have.been.calledOnce;
        expect(dcm.send).to.have.callCount(1);
        dcm.close();
        expect(dcm.send).to.have.callCount(1);
        expect(spy).to.have.been.calledOnce;
    });

    it('If >=2 subscribers are attached to a stream prior to receiving tick_history, upon receiving tick_history response they should both have the same response and incoming ticks', async function () {
        const spies = [sinon.spy(), sinon.spy()];
        dcm.response = null;
        spies.forEach(spy => sm.subscribe(ohlcRequest, spy));
        expect(dcm.send).to.have.callCount(1);
        spies.forEach(spy => expect(spy).to.have.not.been.called);
        dcm.response = dummyOhlcData[0];
        // Promises take time to resolve; use timeout to expect calls only after response is received
        setTimeout(function () {
            spies.forEach(spy => expect(spy).to.have.been.calledOnce);
            const candles = spies.map(spy => spy.lastCall.args[0].candles);
            expect(candles[0]).to.be.deep.equal(candles[1]);
        }, 0);
    });
});
