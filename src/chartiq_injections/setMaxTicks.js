export const setMaxTicks = () => {
    /**
     * The setMaxTicks function has been completely overwrited because the original one doesn't work properly
     *  when the padding property is set in params.
     */
    // TODO Use the original one of the latest version of ChartIQ if the issue has been solved.
    CIQ.ChartEngine.prototype.setMaxTicks  =  function (ticks, params) {
        if (!params) params = {};
        ticks = Math.round(ticks);
        if (ticks < 2) ticks = 2;
        const pad = params.padding ? params.padding : 0;
        this.layout.candleWidth = (this.chart.width - pad) / ticks;
        if (!this.layout.candleWidth) this.layout.candleWidth = 8; // Zero candlewidth can only occur if the chart has no width. This might happen if the chart is in a hidden iframe

        // This line has been changed in the compare of the original function.
        this.chart.maxTicks = Math.round(((this.chart.width - pad) / this.layout.candleWidth) - 0.499);
        if (params.padding || params.padding === 0) this.chart.scroll = ticks + 1; // If padding, then by definition we're homing
    };
};
