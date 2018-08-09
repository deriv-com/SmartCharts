import { action, observable, when } from 'mobx';
import debounce from 'lodash.debounce';

class CurrectSpotStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    resizing = false;
    @observable top = 0;
    @observable left = 0;
    @observable show = false;

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onScreenResize = debounce(() => {
        this.resizing = false;
    }, 10);

    onContextReady = () => {
        const self = this;

        window.addEventListener('resize', () => {
            self.resizing = true;
            self.onScreenResize();
        });

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
                if (this.chart.yAxis.left > x
                    && this.chart.yAxis.top <= y
                    && this.chart.yAxis.bottom >= y) {
                    self.updateSpot(x, y);
                }
            }

            self.updateDisplay(this.layout.periodicity === 1
                && this.layout.timeUnit === 'second');
        });
    }

    @action.bound updateSpot(x, y) {
        this.top = y;
        this.left = (x > this.left || this.resizing) ? x : this.left;
    }

    @action.bound updateDisplay(show) {
        this.show = show;
    }
}

export default CurrectSpotStore;
