export const overrideRenderGartley = () => {
    // overriding the method to avoid error in case this.p0 or this.p1 is undefined or null.
    CIQ.Drawing.gartley.prototype.render = function (context: CanvasRenderingContext2D) {
        const panel = this.stx.panels[this.panelName];
        if (!panel || !this.p0 || !this.p1) return;
        const x0 = this.stx.pixelFromTick(this.p0[0], panel.chart);
        const x1 = this.stx.pixelFromTick(this.p1[0], panel.chart);
        const y0 = this.stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
        const y1 = this.stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);

        if (this.segment === 2) {
            this.drawDropZone(
                context,
                0.618 * this.points[0][1] + 0.382 * this.p0[1],
                0.786 * this.points[0][1] + 0.214 * this.p0[1],
                this.p0[0]
            );
        } else if (this.segment === 3) {
            this.drawDropZone(
                context,
                0.618 * this.points[1][1] + 0.382 * this.p0[1],
                0.786 * this.points[1][1] + 0.214 * this.p0[1],
                this.p0[0]
            );
        } else if (this.segment === 4) {
            let bound = 1.618 * this.points[2][1] - 0.618 * this.points[1][1];
            if (this.shape === 'M') bound = Math.max(bound, this.points[0][1]);
            else bound = Math.min(bound, this.points[0][1]);
            this.drawDropZone(context, bound, 1.27 * this.points[2][1] - 0.27 * this.points[1][1], this.p0[0]);
        }

        const width = this.lineWidth;
        const color = this.getLineColor();

        const parameters = {
            pattern: this.pattern,
            lineWidth: width,
        };
        if ((this.penDown || this.highlighted) && this.pattern === 'none') parameters.pattern = 'dotted';
        if (this.segment <= this.maxSegments) {
            this.stx.plotLine(x0, x1, y0, y1, color, this.name, context, panel, parameters);
        }

        const fillColor = this.fillColor;
        const coords = [];
        if (this.points.length) {
            context.beginPath();
            for (let fp = 1; fp < this.points.length && fp <= 4; fp++) {
                const xx0 = this.stx.pixelFromTick(this.points[fp - 1][0], panel.chart);
                const xx1 = this.stx.pixelFromTick(this.points[fp][0], panel.chart);
                const yy0 = this.stx.pixelFromValueAdjusted(panel, this.points[fp - 1][0], this.points[fp - 1][1]);
                const yy1 = this.stx.pixelFromValueAdjusted(panel, this.points[fp][0], this.points[fp][1]);
                if (fp === 1) coords.push(xx0, yy0);
                coords.push(xx1, yy1);
                this.stx.plotLine(xx0, xx1, yy0, yy1, color, this.name, context, panel, parameters);
            }
            if (this.points.length === 2 || this.points.length === 4) {
                coords.push(x1, y1);
            }
            if (this.points[2]) {
                coords.push(
                    this.stx.pixelFromTick(this.points[2][0], panel.chart),
                    this.stx.pixelFromValueAdjusted(panel, this.points[2][0], this.points[2][1])
                );
            }
            if (fillColor && fillColor !== 'auto' && !CIQ.isTransparent(fillColor)) {
                for (let c = 0; c < coords.length; c += 2) {
                    if (c === 0) context.moveTo(coords[0], coords[1]);
                    context.lineTo(coords[c], coords[c + 1]);
                }
                context.fillStyle = fillColor;
                context.globalAlpha = 0.2;
                context.closePath();
                context.fill();
                context.globalAlpha = 1;
            }
        }

        /* if(this.highlighted){
			var p0Fill=this.highlighted=="p0"?true:false;
			var p1Fill=this.highlighted=="p1"?true:false;
			this.littleCircle(context, x0, y0, p0Fill);
			this.littleCircle(context, x1, y1, p1Fill);
		} */
    };
};
