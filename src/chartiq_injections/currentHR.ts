/* eslint-disable */
export const drawCurrentPriceLine = () => {
    CIQ.ChartEngine.prototype.drawCurrentHR = function () {
        if (this.runPrepend('drawCurrentHR', arguments)) return;
        this.labelType = 'currentSpot';
        this.yaxisLabelStyle = 'roundRectArrow';
        var backgroundColor, color;
        var mainSeriesRenderer = this.mainSeriesRenderer || {};
        if (mainSeriesRenderer.noCurrentHR) return;
        var highLowBars = mainSeriesRenderer.highLowBars;
        for (var chartName in this.charts) {
            var chart = this.charts[chartName];
            var panel = chart.panel;
            var yAxis = panel.yAxis;
            if (panel.hidden) continue;
            if (yAxis.drawCurrentPriceLabel === false || yAxis.noDraw) continue;
            if (!mainSeriesRenderer.params) continue;
            var whichSet = yAxis.whichSet;
            if (!whichSet) whichSet = 'dataSet';
            if (this.isHistoricalModeSet && whichSet !== 'dataSegment') continue;
            var l = chart[whichSet].length,
                cw = this.layout.candleWidth;
            if (whichSet == 'dataSegment') {
                //this crazy equation just to find the last bar displaying at least 50% on the screen
                while (l > (chart.width - this.micropixels + cw / 2 + 1) / cw) l--;
            }
            if (l && chart[whichSet][l - 1]) {
                var field = chart.defaultPlotField;
                if (!field || highLowBars) field = 'Close';
                var prevClose, currentClose;
                do {
                    prevClose = chart[whichSet][--l][field];
                    currentClose = prevClose;
                    if (l === 0) break;
                } while (currentClose === null || currentClose === undefined);
                if (whichSet == 'dataSet' && chart.currentQuote) {
                    currentClose = chart.currentQuote[field];
                } else if (chart[whichSet].length >= 2) {
                    var pquote = chart[whichSet][l - 1];
                    if (pquote) prevClose = pquote[field];
                }

                let currentQuote = this.getNearestCloseQuote();
                if (!currentClose) {
                    currentClose = currentQuote[field];
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
                var labelDecimalPlaces = Math.max(panel.yAxis.printDecimalPlaces, panel.chart.decimalPlaces);
                //  ... and never display more decimal places than the symbol is supposed to be quoting at
                if (yAxis.maxDecimalPlaces || yAxis.maxDecimalPlaces === 0)
                    labelDecimalPlaces = Math.min(labelDecimalPlaces, yAxis.maxDecimalPlaces);
                if (yAxis.priceFormatter) {
                    txt = yAxis.priceFormatter(this, panel, currentClose, labelDecimalPlaces);
                } else {
                    txt = this.formatYAxisPrice(currentClose, panel, labelDecimalPlaces);
                }

                var y = this.pixelFromTransformedValue(currentClose, panel);
                // Keep current price label position fot later when we want to show countdown
                chart.currentPriceLabelY = y;
                this.createYAxisLabel(panel, txt, y, backgroundColor, color);

                let x = panel.left;
                let endOfLine = panel.right;
                if (currentQuote) {
                    const tick = currentQuote.Close ? currentQuote.tick : currentQuote.tick - 1;
                    // Change the panel position to current spot position for drawing current price line
                    x = this.pixelFromTick(tick, chart) + (chart.lastTickOffset || 0);
                    endOfLine -= this.chart.context.measureText(txt).width * 0.4; // Draw the chart from the current spot to the beginning of the price label
                }
                endOfLine += 24; // we move the "x" psoition forward by 24 on createYAxisLabel in chartStore.js

                if (this.preferences.currentPriceLine === true && this.isHome()) {
                    this.plotLine(x, endOfLine, y, y, backgroundColor, 'segment', panel.chart.context, panel, {
                        pattern: 'dashed',
                        lineWidth: 1,
                        opacity: 0.8,
                        globalCompositeOperation: 'hard-light',
                    });
                }
            }
        }
        this.yaxisLabelStyle = 'roundRect';
        this.labelType = undefined;
        this.runAppend('drawCurrentHR', arguments);
    };
};
