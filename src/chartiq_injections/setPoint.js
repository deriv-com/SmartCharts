export const overrideSetPoint = () => {
    // overriding to prevent a console error that can appear when the value of 'd' is undefined.
    CIQ.Drawing.prototype.setPoint = function (point, x, y, chart) {
        let tick = null;
        let date = null;
        if (typeof x === 'number') tick = x;
        else if (x.length >= 8) date = x;
        else tick = Number(x);

        if (y || y === 0) this[`v${point}`] = y;
        let d;
        if (tick !== null) {
            d = this.stx.dateFromTick(tick, chart, true);
            this[`tzo${point}`] = d.getTimezoneOffset();
            this[`d${point}`] = CIQ.yyyymmddhhmmssmmm(d);
            this[`p${point}`] = [tick, y];
        } else if (date !== null) {
            d = CIQ.strToDateTime(date);
            if (!this[`tzo${point}`] && this[`tzo${point}`] !== 0) this[`tzo${point}`] = d.getTimezoneOffset();
            this[`d${point}`] = date;
            const adj = this[`tzo${point}`] - d.getTimezoneOffset();
            d.setMinutes(d.getMinutes() + adj);
            let forward = false;
            // if no match, we advance on intraday when there is a no time portion
            // except for free form which already handles time placement internally
            if (
                this.name !== 'freeform' &&
                !CIQ.ChartEngine.isDailyInterval(this.stx.layout.interval) &&
                d &&
                !d.getHours() &&
                !d.getMinutes() &&
                !d.getSeconds() &&
                !d.getMilliseconds()
            ) {
                forward = true;
            }
            this[`p${point}`] = [this.stx.tickFromDate(CIQ.yyyymmddhhmmssmmm(d), chart, null, forward), y];
        }
    };
};
