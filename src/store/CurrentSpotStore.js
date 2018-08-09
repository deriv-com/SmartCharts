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
        const self = this;
        this.stx.append('draw', function () {
            if (this.chart.dataSet
                && this.chart.dataSet.length
                && this.mainSeriesRenderer
                && this.mainSeriesRenderer.supportsAnimation) {
                const panel = this.chart.panel;
                const currentQuote = this.currentQuote();
                if (!currentQuote) { return; }
                const price = currentQuote.Close;
                let x = this.pixelFromTick(currentQuote.tick, this.chart) | 0;
                if (this.chart.lastTickOffset) { x += this.chart.lastTickOffset; }
                const y = this.pixelFromPrice(price, panel) | 0;
                if (this.chart.yAxis.left > x &&
                    this.chart.yAxis.top <= y &&
                    this.chart.yAxis.bottom >= y &&
                    x > self.left) {
                    self.updateSpot(x, y);
                }
            }

            self.updateDisplay(this.layout.periodicity == 1
                && this.layout.timeUnit === 'second');
        });
    }

    @action.bound updateSpot(x, y) {
        this.left = x;
        this.top = y;
    }

    @action.bound updateDisplay(show) {
        this.show = show;
    }
}

export default CurrectSpotStore;
