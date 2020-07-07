export const  createXAxis = () => {
    CIQ.ChartEngine.prototype.append('createXAxis', function () {
        if (this.chart.xaxis && this.chart.xaxis.length && this.chart.xaxis[0].DT) {
            const first = this.chart.xaxis[0].DT.valueOf();
            const last  = this.chart.xaxis.slice(-1)[0].DT.valueOf();
            let xAxisInterval = Math.floor((last - first) / 5000);
            xAxisInterval = xAxisInterval > 5 ? xAxisInterval - (xAxisInterval % 5) : xAxisInterval;
            this.chart.xAxis.timeUnitMultiplier = xAxisInterval < 100 ? xAxisInterval : 1;
            this.chart.xAxis.timeUnit = xAxisInterval < 100 ? CIQ.SECOND : undefined;
        }
    });
    CIQ.ChartEngine.prototype.createYAxisLabel = function (panel, txt, y, backgroundColor, color, ctx, yAxis) {
        if (panel.yAxis.drawPriceLabels === false || panel.yAxis.noDraw) return;
        const yax = yAxis || panel.yAxis;
        if (yax.noDraw || !yax.width) return;
        const context = ctx || this.chart.context;
        // SmartChart Team: this prop modified
        const margin = 9;
        let height = 24;
        let radius;

        if (this.labelType === 'currentSpot') {
            this.canvasFont('stx_current_hr_up', context);
        } else {
            this.canvasFont('stx_price_label', context);
        }
        const tickWidth = this.drawBorders ? 3 : 0; // pixel width of tick off edge of border
        const textWidth = context.measureText(txt).width;
        let width;
        try {
            if (textWidth + margin > yax.width) {
                width = textWidth + tickWidth + margin * 2;
            } else {
                width = yax.width + margin;
            }
        } catch (e) { width = yax.width; } // Firefox doesn't like this in hidden iframe

        // some y-axis label has style of `roundRectArrow` and some has `rect`, we reduce
        // 14px which is about the `roundRectArrow` style arrow to make the label all fit
        width -= 14;
        if (this.chart.yAxis.width < width) {
            this.chart.yAxis.width = width;
            this.calculateYAxisPositions();
        } else  {
            width = this.chart.yAxis.width;
        }

        let x = this.width - this.chart.yAxis.width;
        let left = ((width - textWidth) / 2);

        if (yax.width < 0) x += (yax.width - width);
        const position = (yax.position === null ? panel.chart.yAxis.position : yax.position);
        if (position === 'left') {
            width *= -1;
            if (yax.width < 0) x -= (yax.width + width);
            radius = -3;
            context.textAlign = 'right';
        }
        if (y + (height / 2) > yax.bottom) y = yax.bottom - (height / 2);
        if (y - (height / 2) < yax.top) y = yax.top + (height / 2);

        if (typeof (CIQ[this.yaxisLabelStyle]) === 'undefined') {
            this.yaxisLabelStyle = 'roundRectArrow';  // in case of user error, set a default.
        }
        let yaxisLabelStyle = this.yaxisLabelStyle;
        if (yax.yaxisLabelStyle) yaxisLabelStyle = yax.yaxisLabelStyle;

        // as crosshair and countdown style is `rect`, so due to previous rule we should
        // increase there x position to fit the y-axis
        x += 1;
        if (this.labelType === 'currentSpot') {
            x += 13;
            left  -= 8;
            radius = 0;
        } else if (this.labelType === 'crosshair') {
            height = 30;
        }

        const params = {
            ctx:context,
            x,
            y,
            top: y - (height / 2),
            width,
            height,
            radius,
            backgroundColor,
            fill: true,
            stroke: false,
            margin:{ left, top: 1 },
            txt,
            color,
        };
        CIQ[yaxisLabelStyle](params);
    };
};
