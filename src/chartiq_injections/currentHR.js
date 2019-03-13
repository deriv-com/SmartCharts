/* eslint-disable */
export const drawCurrentPriceLine = () => {
CIQ.ChartEngine.prototype.drawCurrentHR = function () {
    if (this.runPrepend('drawCurrentHR', arguments)) return;
    let backgroundColor, color;
    const mainSeriesRenderer = this.mainSeriesRenderer || {};
    if (mainSeriesRenderer.noCurrentHR) return;
    const highLowBars = mainSeriesRenderer.highLowBars || this.highLowBars[this.layout.chartType];
    for (const chartName in this.charts) {
        const chart = this.charts[chartName];
        const panel = chart.panel;
        const yAxis = panel.yAxis;
        if (panel.hidden) continue;
        if (yAxis.drawCurrentPriceLabel === false || yAxis.noDraw) continue;
        if (!mainSeriesRenderer.params) continue;
        let whichSet = yAxis.whichSet;
        if (!whichSet) whichSet = 'dataSet';
        if (this.isHistoricalModeSet && whichSet !== 'dataSegment') continue;
        let l = chart[whichSet].length, cw = this.layout.candleWidth;
        if (whichSet == 'dataSegment') {
            // this crazy equation just to find the last bar displaying at least 50% on the screen
            while (l > (chart.width - this.micropixels + (cw) / 2 + 1) / cw) l--;
        }
        if (l && chart[whichSet][l - 1]) {
            let field = chart.defaultPlotField;
            if (!field || highLowBars) field = 'Close';
            var prevClose, currentClose;
            do {
                prevClose = chart[whichSet][--l][field];
                currentClose = prevClose;
                if (l === 0) break;
            } while (currentClose === null);
            if (whichSet == 'dataSet' && chart.currentQuote) {
                currentClose = chart.currentQuote[field];
            } else if (chart[whichSet].length >= 2) {
                const pquote = chart[whichSet][l - 1];
                if (pquote) prevClose = pquote[field];
            }
            if (currentClose < prevClose) {
                backgroundColor = this.canvasStyle('stx_current_hr_down').backgroundColor;
                color = this.canvasStyle('stx_current_hr_down').color;
            } else {
                backgroundColor = this.canvasStyle('stx_current_hr_up').backgroundColor;
                color = this.canvasStyle('stx_current_hr_up').color;
            }
            if (chart.transformFunc) currentClose = chart.transformFunc(this, chart, currentClose);
            var txt;
            // If a chart panel, then always display at least the number of decimal places as calculated by masterData (panel.chart.decimalPlaces)
            // but if we are zoomed to high granularity then expand all the way out to the y-axis significant digits (panel.yAxis.printDecimalPlaces)
            let labelDecimalPlaces = Math.max(panel.yAxis.printDecimalPlaces, panel.chart.decimalPlaces);
            //	... and never display more decimal places than the symbol is supposed to be quoting at
            if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0) labelDecimalPlaces = Math.min(labelDecimalPlaces, yAxis.maxDecimalPlaces);
            if (yAxis.priceFormatter) {
                txt = yAxis.priceFormatter(this, panel, currentClose, labelDecimalPlaces);
            } else {
                txt = this.formatYAxisPrice(currentClose, panel, labelDecimalPlaces);
            }

            const y = this.pixelFromTransformedValue(currentClose, panel);
            // Keep current price label position fot later when we want to show countdown
            chart.currentPriceLabelY = y;
            this.createYAxisLabel(panel, txt, y, backgroundColor, color);

            let x = panel.left;
            const currentQuote = this.currentQuote();
            if (currentQuote) {
                // Change the panel position to current spot position for drawing current price line
                 x = this.pixelFromTick(currentQuote.tick, chart) + (chart.lastTickOffset || 0);
            }
            if (this.preferences.currentPriceLine === true && this.isHome()) {
                this.plotLine(x, panel.right-80, y, y, backgroundColor, 'segment', panel.chart.context, panel, {
                    pattern: 'dashed',
                    lineWidth: 1,
                    opacity: 0.8,
                });
            }
        }
    }
    this.runAppend('drawCurrentHR', arguments);
};
};