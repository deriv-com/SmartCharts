// @ts-nocheck
export const createXAxis = () => {
    CIQ.ChartEngine.prototype.append('createXAxis', function () {
        if (this.chart.xaxis && this.chart.xaxis.length && this.chart.xaxis[0].DT) {
            const first = this.chart.xaxis[0].DT.valueOf();
            const last = this.chart.xaxis.slice(-1)[0].DT.valueOf();
            let xAxisInterval = Math.floor((last - first) / 5000);
            xAxisInterval = xAxisInterval > 5 ? xAxisInterval - (xAxisInterval % 5) : xAxisInterval;
            this.chart.xAxis.timeUnitMultiplier = xAxisInterval < 100 ? xAxisInterval : 1;
            this.chart.xAxis.timeUnit = xAxisInterval < 100 ? CIQ.SECOND : undefined;
        }
    });
};
