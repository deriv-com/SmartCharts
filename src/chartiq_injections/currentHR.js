export const drawCurrentPriceLine = () => {
    CIQ.ChartEngine.prototype.prepend('drawCurrentHR', function () {
        const mainSeriesRenderer = this.mainSeriesRenderer || {};
        if (mainSeriesRenderer.noCurrentHR) return;
        for (const chartName in this.charts) {
            const chart = this.charts[chartName];
            const panel = chart.panel;
            const currentQuote = this.currentQuote();
            if (currentQuote) {
                const x = this.pixelFromTick(currentQuote.tick, chart) + (chart.lastTickOffset || 0);
                // Change the panel position to current spot position for drawing current price line
                panel.left = x;
            }
            panel.right -= 16;
        }
    });
    CIQ.ChartEngine.prototype.append('drawCurrentHR', function () {
        const mainSeriesRenderer = this.mainSeriesRenderer || {};
        if (mainSeriesRenderer.noCurrentHR) return;
        for (const chartName in this.charts) {
            const chart = this.charts[chartName];
            const panel = chart.panel;
            // Set the panel position to its original value
            panel.left = 0;
            panel.right += 16;
        }
    });
};
