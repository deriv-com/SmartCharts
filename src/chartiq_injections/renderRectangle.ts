export const overrideRenderRectangle = () => {
    // overriding the method to avoid error in case this.p0 or this.p1 is null.
    CIQ.Drawing.rectangle.prototype.render = function (context: CanvasRenderingContext2D) {
        const panel = this.stx.panels[this.panelName];
        if (!panel || !this.p0 || !this.p1) return;
        const x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
        const x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
        const y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
        const y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

        const x = Math.round(Math.min(x0, x1)) + 0.5;
        const y = Math.min(y0, y1);
        const width = Math.max(x0, x1) - x;
        const height = Math.max(y0, y1) - y;
        let edgeColor = this.color;
        if (this.highlighted) {
            edgeColor = this.stx.getCanvasColor('stx_highlight_vector');
        }

        const fillColor = this.fillColor;
        if (fillColor && !CIQ.isTransparent(fillColor) && fillColor !== 'auto') {
            context.beginPath();
            context.rect(x, y, width, height);
            context.fillStyle = fillColor;
            context.globalAlpha = 0.2;
            context.fill();
            context.closePath();
            context.globalAlpha = 1;
        }

        const parameters = {
            pattern: this.pattern,
            lineWidth: this.lineWidth,
        };
        if (this.highlighted && parameters.pattern === 'none') {
            parameters.pattern = 'solid';
            if (parameters.lineWidth === 0.1) parameters.lineWidth = 1;
        }

        // We extend the vertical lines by .5 to account for displacement of the horizontal lines
        // HTML5 Canvas exists *between* pixels, not on pixels, so draw on .5 to get crisp lines
        this.stx.plotLine(x0, x1, y0, y0, edgeColor, 'segment', context, panel, parameters);
        this.stx.plotLine(x1, x1, y0 - 0.5, y1 + 0.5, edgeColor, 'segment', context, panel, parameters);
        this.stx.plotLine(x1, x0, y1, y1, edgeColor, 'segment', context, panel, parameters);
        this.stx.plotLine(x0, x0, y1 + 0.5, y0 - 0.5, edgeColor, 'segment', context, panel, parameters);
        if (this.highlighted) {
            const p0Fill = this.highlighted === 'p0';
            const p1Fill = this.highlighted === 'p1';
            this.littleCircle(context, x0, y0, p0Fill);
            this.littleCircle(context, x1, y1, p1Fill);
        }
    };
};
