export const overrideDateFromTick = () => {
    // fix for the 'Cannot read getTime() of undefined' error that appears when chart.dataSet is an array of null data, e.g. [null, null, null, {candleWidth: null}].
    CIQ.ChartEngine.prototype.dateFromTick = function (tick, chart, nativeDate, tickSource = 'dataSet') {
        if (!chart) chart = this.chart;
        const tickArray = chart[tickSource];
        let data_len = tickArray.filter(ds => (ds && ds.candleWidth) || (ds && ds.candleWidth === undefined)).length;
        let dt;
        let iter;
        let result;
        let addedTempDate = false;

        // if empty chart then add current date so this function supports initializing an empty chart in quotefeed
        if (data_len === 0) {
            tickArray.unshift({});
            tickArray[0].DT = new Date();
            data_len = tickArray.length;
            addedTempDate = true;
        }

        if (tick < 0) {
            iter = this.standardMarketIterator(tickArray[0].DT);
            if (iter) dt = iter.previous(Math.abs(tick));
            else dt = tickArray[0].DT;
        } else if (tick >= data_len) {
            iter = this.standardMarketIterator(tickArray[data_len - 1].DT);
            if (iter) dt = iter.next(tick - (data_len - 1));
            else dt = tickArray[data_len - 1].DT;
        } else {
            dt = tickArray[tick].DT;
        }

        if (nativeDate && dt) {
            result = new Date(dt.getTime());
        } else {
            result = CIQ.yyyymmddhhmmssmmm(dt).substr(0, 12);
        }

        if (addedTempDate) {
            delete tickArray[0].DT;
        }
        return result;
    };
};
