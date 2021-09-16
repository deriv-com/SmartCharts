export const overrideCreateXAxis = () => {
    // overriding to fix the 'Cannot read 'getSeconds'(or 'getMinutes') of undefined' error that appears
    // when chart.dataSegment is an array of null data, e.g. [null, null, null, {candleWidth: null}].
    CIQ.ChartEngine.prototype.createXAxis = function (chart) {
        if (
            chart.dataSegment.filter(ds => (ds && ds.candleWidth) || (ds && ds.candleWidth === undefined)).length <= 0
        ) {
            return null;
        }
        if (chart.xAxis.noDraw) return null;
        const arguments$ = [chart];
        let axisRepresentation = this.runPrepend('createXAxis', arguments$);
        if (axisRepresentation) return axisRepresentation;
        if (this.mainSeriesRenderer && this.mainSeriesRenderer.createXAxis) {
            axisRepresentation = this.mainSeriesRenderer.createXAxis(chart);
        } else {
            axisRepresentation = this.createTickXAxisWithDates(chart);
        }
        this.headsUpHR();
        this.runAppend('createXAxis', arguments$);
        return axisRepresentation;
    };
};
