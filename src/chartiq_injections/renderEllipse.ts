export const overrideRenderEllipse = () => {
    // overriding the method to avoid error in case this.p0 or this.p1 is undefined or null.
    CIQ.Drawing.ellipse.prototype.render = function (context: CanvasRenderingContext2D) {
        const panel = this.stx.panels[this.panelName];
        if (!panel || !this.p0 || !this.p1) return;
        const x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
        const x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
        const y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
        const y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

        const left = x0 - (x1 - x0);
        const right = x1;
        const middle = y0;
        const bottom = y1;
        const top = y0 - (y1 - y0);
        const weight = (bottom - top) / 6;
        let lineWidth = this.lineWidth;
        if (!lineWidth) lineWidth = 1.1;
        let edgeColor = this.color;
        if (edgeColor === 'auto' || CIQ.isTransparent(edgeColor)) edgeColor = this.stx.defaultColor;
        if (this.highlighted) {
            edgeColor = this.stx.getCanvasColor('stx_highlight_vector');
            if (lineWidth === 0.1) lineWidth = 1.1;
        }

        const fillColor = this.fillColor;

        context.beginPath();
        context.moveTo(left, middle);
        context.bezierCurveTo(left, bottom + weight, right, bottom + weight, right, middle);
        context.bezierCurveTo(right, top - weight, left, top - weight, left, middle);

        if (fillColor && !CIQ.isTransparent(fillColor) && fillColor !== 'auto') {
            context.fillStyle = fillColor;
            context.globalAlpha = 0.2;
            context.fill();
            context.globalAlpha = 1;
        }

        if (edgeColor && this.pattern !== 'none') {
            context.strokeStyle = edgeColor;
            context.lineWidth = lineWidth;
            if (context.setLineDash) {
                context.setLineDash(CIQ.borderPatternToArray(lineWidth, this.pattern));
                context.lineDashOffset = 0; // start point in array
            }
            context.stroke();
        }
        context.closePath();
        if (this.highlighted) {
            const p1Fill = this.highlighted === 'p1';
            this.littleCircle(context, x1, y1, p1Fill);
        }
    };
};
