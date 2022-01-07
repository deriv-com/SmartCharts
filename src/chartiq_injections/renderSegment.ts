// @ts-ignore
import { timezoneJS } from '../../chartiq/development/js/chartiq.js';

export const overrideRenderSegment = () => {
    // overriding the method to avoid error in case this.p0 or this.p1 is null.
    CIQ.Drawing.segment.prototype.render = function (context: CanvasRenderingContext2D) {
        const panel = this.stx.panels[this.panelName];
        if (!panel || !this.p0 || !this.p1) return;
        const x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
        const x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
        const y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
        const y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

        const width = this.lineWidth;
        const color = this.getLineColor();

        const parameters = {
            pattern: this.pattern,
            lineWidth: width,
        };
        if (parameters.pattern === 'none') parameters.pattern = 'solid';
        this.stx.plotLine(x0, x1, y0, y1, color, this.name, context, panel, parameters);

        if (this.axisLabel && !this.repositioner) {
            if (this.name === 'horizontal') {
                this.stx.endClip();
                let txt = this.p0[1];
                if (panel.chart.transformFunc) {
                    txt = panel.chart.transformFunc(this.stx, panel.chart, txt);
                }
                if (panel.yAxis.priceFormatter) {
                    txt = panel.yAxis.priceFormatter(this.stx, panel, txt);
                } else txt = this.stx.formatYAxisPrice(txt, panel);
                this.stx.createYAxisLabel(panel, txt, y0, color);
                this.stx.startClip(panel.name);
            } else if (this.name === 'vertical' && this.p0[0] >= 0 && !this.stx.chart.xAxis.noDraw) {
                // don't try to compute dates from before dataSet
                let dt, newDT;
                dt = this.stx.dateFromTick(this.p0[0], panel.chart, true);
                if (!CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval)) {
                    const milli = dt.getSeconds() * 1000 + dt.getMilliseconds();
                    if (timezoneJS.Date && this.stx.displayZone) {
                        // this converts from the quote feed timezone to the chart specified time zone
                        newDT = new timezoneJS.Date(dt.getTime(), this.stx.displayZone);
                        dt = new Date(
                            newDT.getFullYear(),
                            newDT.getMonth(),
                            newDT.getDate(),
                            newDT.getHours(),
                            newDT.getMinutes()
                        );
                        dt = new Date(dt.getTime() + milli);
                    }
                } else {
                    dt.setHours(0, 0, 0, 0);
                }
                let myDate = CIQ.mmddhhmm(CIQ.yyyymmddhhmm(dt));

                if (panel.chart.xAxis.formatter) {
                    myDate = panel.chart.xAxis.formatter(dt, this.name, null, null, myDate);
                } else if (this.stx.internationalizer) {
                    let str;
                    if (dt.getHours() !== 0 || dt.getMinutes() !== 0) {
                        str = this.stx.internationalizer.monthDay.format(dt);
                        str += ` ${this.stx.internationalizer.hourMinute.format(dt)}`;
                    } else {
                        str = this.stx.internationalizer.yearMonthDay.format(dt);
                    }
                    myDate = str;
                }

                this.stx.endClip();
                this.stx.createXAxisLabel({
                    panel,
                    txt: myDate,
                    x: x0,
                    backgroundColor: color,
                    color: null,
                    pointed: true,
                    padding: 2,
                });
                this.stx.startClip(panel.name);
            }
        }
        if (this.highlighted && this.name !== 'horizontal' && this.name !== 'vertical') {
            const p0Fill = this.highlighted === 'p0';
            const p1Fill = this.highlighted === 'p1';
            this.littleCircle(context, x0, y0, p0Fill);
            this.littleCircle(context, x1, y1, p1Fill);
        }
    };
};
