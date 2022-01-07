export const BackingStore = () => {
    CIQ.ChartEngine.prototype.disableBackingStore = function () {
        if (!this.useBackingStore) return;
        const canvases = [this.chart.canvas];
        if (this.useBackgroundCanvas) canvases.push(this.chart.backgroundCanvas);
        const backing = this.backing;
        canvases.forEach(function (canvas) {
            if (backing) {
                if (canvas.width === backing.styleWidth) return;

                canvas.width = backing.styleWidth;
                canvas.height = backing.styleHeight;
            }
            canvas.context.scale(1, 1);
        });
        this.adjustedDisplayPixelRatio = 1;
        this.draw();
    };

    CIQ.ChartEngine.prototype.reconstituteBackingStore = function () {
        // Added check for backing
        if (!this.useBackingStore || !this.backing) return;
        const canvases = [this.chart.canvas];
        if (this.useBackgroundCanvas) canvases.push(this.chart.backgroundCanvas);
        const backing = this.backing;
        canvases.forEach(function (canvas) {
            if (canvas.width === backing.width) return;

            canvas.width = backing.width;
            canvas.height = backing.height;

            canvas.context.scale(backing.ratio, backing.ratio);
        });
        this.adjustedDisplayPixelRatio = backing.ratio;
        this.draw();
    };
};
