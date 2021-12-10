export const overrideRenderChannel = () => {
    // overriding the method to avoid error in case this.p0 or this.p1 is undefined or null.
    CIQ.Drawing.channel.prototype.render = function (context: CanvasRenderingContext2D) {
        const panel = this.stx.panels[this.panelName];
        if (!panel || !this.p0 || !this.p1) return;
        const x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
        const x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
        const y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
        const y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
        let y = null;
        if (this.p2) {
            y = this.stx.pixelFromValueAdjusted(panel, this.p2[0], this.p2[1]);
        }

        const width = this.lineWidth;
        const color = this.getLineColor();

        const fillColor = this.fillColor;
        if (this.p2 && fillColor && !CIQ.isTransparent(fillColor) && fillColor !== 'auto') {
            context.beginPath();
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
            context.lineTo(x1, y);
            context.lineTo(x0, y0 + (y - y1));
            context.closePath();
            context.globalAlpha = 0.2;
            context.fillStyle = fillColor;
            context.fill();
            context.globalAlpha = 1;
        }

        const parameters = {
            pattern: this.pattern,
            lineWidth: width,
        };
        if ((this.penDown || this.highlighted) && this.pattern === 'none') parameters.pattern = 'dotted';
        this.stx.plotLine(x0, x1, y0, y1, color, 'segment', context, panel, parameters);
        if (this.p2) this.stx.plotLine(x0, x1, y0 + (y - y1), y, color, 'segment', context, panel, parameters);

        if (this.highlighted) {
            const p0Fill = this.highlighted === 'p0';
            const p1Fill = this.highlighted === 'p1';
            const p2Fill = this.highlighted === 'p2';
            this.littleCircle(context, x0, y0, p0Fill);
            this.littleCircle(context, x1, y1, p1Fill);
            this.littleCircle(context, x1, y, p2Fill);
        }
    };
};
