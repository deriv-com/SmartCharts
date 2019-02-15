export const maintainSpanSize = () => {
    CIQ.ChartEngine.prototype.prepend('resizeChart', function () {
        if (this.chart.xaxis && this.chart.xaxis.length) {
            this.customCandleWidth = this.layout.candleWidth;
            this.customChartWidth = this.chart.width;
            this.customScroll = this.chart.scroll;
        }
    });

    CIQ.ChartEngine.prototype.append('resizeChart', function () {
        if (this.customChartWidth) {
            const ratio = this.customChartWidth / this.customCandleWidth;
            this.layout.candleWidth = this.chart.width / ratio;
            this.chart.scroll = this.customScroll;
            this.draw();
        }
    });
};
