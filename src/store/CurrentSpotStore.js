import { action, observable, when } from 'mobx';

class CurrectSpotStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    @observable top = 0;
    @observable left = 0;
    @observable show = false;

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.stx.append('draw', this.updateSpot);
    }

    @action.bound updateSpot() {
        const chart = this.stx.chart;
        const layout = this.stx.layout;
        const mainSeriesRenderer = this.stx.mainSeriesRenderer;

        if (chart.dataSet
            && chart.dataSet.length
            && mainSeriesRenderer
            && mainSeriesRenderer.supportsAnimation) {
            const panel = chart.panel;
            const currentQuote = this.stx.currentQuote();
            if (!currentQuote) { return; }
            const price = currentQuote.Close;
            let x = this.stx.pixelFromTick(currentQuote.tick, chart) | 0;
            if (chart.lastTickOffset) { x += chart.lastTickOffset; }
            const y = this.stx.pixelFromPrice(price, panel) | 0;
            if (chart.yAxis.left > x
                && chart.yAxis.top <= y
                && chart.yAxis.bottom >= y) {
                this.top = y;
                this.left = (Math.abs(x - this.left) > 1) ? x : this.left;

                this.show = (layout.chartType !== 'candle'
                        && layout.chartType !== 'colored_bar'
                        && layout.chartType !== 'hollow_candle');
            } else {
                this.show = false;
            }
        }
    }
}

export default CurrectSpotStore;
