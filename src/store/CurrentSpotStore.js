import { when } from 'mobx';

class CurrentSpotStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }
    get state() { return this.mainStore.state; }

    onContextReady = () => {
        if (this.mainStore.state.isAnimationEnabled) this.stx.append('draw', this.updateSpot);
    }

    updateSpot = () => {
        const stx = this.stx;
        const cq_spot = this.context.topNode.querySelector('.cq-spot');

        if (this.state.endEpoch) {
            cq_spot.style.display = 'none';
            return;
        }
        const chart = stx.chart;
        const layout = stx.layout;
        const mainSeriesRenderer = stx.mainSeriesRenderer;

        let top = 0,
            left = 0,
            show = true;

        if (chart.dataSet
            && chart.dataSet.length
            && mainSeriesRenderer
        ) {
            const panel = chart.panel;
            const currentQuote = stx.currentQuote();
            if (!currentQuote) { return; }
            const price = currentQuote.Close;
            const x = stx.pixelFromTick(currentQuote.tick, chart) + (chart.lastTickOffset || 0);
            const y = stx.pixelFromPrice(price, panel);

            if (chart.yAxis.left > x
                && chart.yAxis.top <= y
                && chart.yAxis.bottom >= y) {
                // Limit precision to reduce wobbly-ness in the spot:
                top = +y;
                left = Math.round(x);
            } else {
                show = false;
            }
        }
        show = show && (
            layout.chartType !== 'candle'
                && layout.chartType !== 'colored_bar'
                && layout.chartType !== 'hollow_candle'
        ) && !this.state.endEpoch;

        // YES! we are manually patching DOM, Because we don't want to pay
        // for react reconciler & mox tracking observables.
        cq_spot.style.transform = `translate(${left}px, ${top}px)`;
        cq_spot.style.display = show ? 'initial' : 'none';
    }
}

export default CurrentSpotStore;
