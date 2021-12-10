export const overrideRenderPitchfork = () => {
    // overriding the method to avoid error in case this.p0 or this.p1 is undefined or null.
    CIQ.Drawing.pitchfork.prototype.render = function (context: CanvasRenderingContext2D) {
        const panel = this.stx.panels[this.panelName];
        if (!panel || !this.p0 || !this.p1) return;
        const stx = this.stx;
        let p2 = this.p2;
        if (!p2) p2 = this.p1;
        const x0 = stx.pixelFromTick(this.p0[0], panel.chart);
        const x1 = stx.pixelFromTick(this.p1[0], panel.chart);
        const x2 = stx.pixelFromTick(p2[0], panel.chart);
        const y0 = stx.pixelFromValueAdjusted(panel, this.p0[0], this.p0[1]);
        const y1 = stx.pixelFromValueAdjusted(panel, this.p1[0], this.p1[1]);
        const y2 = stx.pixelFromValueAdjusted(panel, p2[0], p2[1]);

        const width = this.lineWidth;
        const color = this.getLineColor();

        const parameters = {
            pattern: this.pattern,
            lineWidth: width,
        };
        let z = 50;
        let yp = 2 * y0 - y1 - y2;
        const denom = 2 * x0 - x1 - x2;
        if (denom < 0) z *= -1;
        yp *= z / denom;
        this.rays = [
            [
                [x1, y1],
                [x2, y2],
            ],
            [
                [x0, y0],
                [(x1 + x2) / 2, (y1 + y2) / 2],
            ],
        ];
        if (!(x1 === x2 && y1 === y2)) {
            this.rays.push(
                [
                    [x1, y1],
                    [x1 - z, y1 - yp],
                ],
                [
                    [x2, y2],
                    [x2 - z, y2 - yp],
                ]
            );
        }
        for (let i = 0; i < this.rays.length; i++) {
            const ray = this.rays[i],
                type = i ? 'ray' : 'segment';
            stx.plotLine(ray[0][0], ray[1][0], ray[0][1], ray[1][1], color, type, context, panel, parameters);
        }
        if (this.highlighted) {
            const p0Fill = this.highlighted === 'p0';
            const p1Fill = this.highlighted === 'p1';
            const p2Fill = this.highlighted === 'p2';
            this.littleCircle(context, x0, y0, p0Fill);
            this.littleCircle(context, x1, y1, p1Fill);
            this.littleCircle(context, x2, y2, p2Fill);
        }
    };
};
