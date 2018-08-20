import { action, computed, observable, when } from 'mobx';

class CurrectSpotStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    @observable top = 0;
    @observable left = 0;
    @observable show = false;
    @computed get pip() { return this.mainStore.chart.currentActiveSymbol.decimal_places; }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
        this.stx.append('draw', this.updateSpot);
    }

    @action.bound updateSpot() {
        const chart = this.stx.chart;
        const layout = this.stx.layout;
        const mainSeriesRenderer = this.stx.mainSeriesRenderer;
        let visible = true;

        if (chart.dataSet
            && chart.dataSet.length
            && mainSeriesRenderer
            && mainSeriesRenderer.supportsAnimation) {
            const panel = chart.panel;
            const currentQuote = this.stx.currentQuote();
            if (!currentQuote) { return; }
            const price = currentQuote.Close;
            const x = this.stx.pixelFromTick(currentQuote.tick, chart) + (chart.lastTickOffset || 0);
            const y = this.stx.pixelFromPrice(price, panel);
            if (chart.yAxis.left > x
                && chart.yAxis.top <= y
                && chart.yAxis.bottom >= y) {
                // Limit precision to reduce wobbly-ness in the spot:
                this.top = +y.toFixed(this.pip);
                if (Math.abs(this.left - x) >= 1) {
                    this.left = Math.round(x);
                }
            } else {
                visible = false;
            }
        }

        this.show = visible && (layout.chartType !== 'candle'
                && layout.chartType !== 'colored_bar'
                && layout.chartType !== 'hollow_candle');
    }
}

export default CurrectSpotStore;
