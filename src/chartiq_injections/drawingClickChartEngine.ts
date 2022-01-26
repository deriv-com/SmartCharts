// @ts-nocheck
export const overrideDrawingClickChartEngine = () => {
    // overriding the method to avoid error in case 'this.controls.crossX.classList' is not a string.
    CIQ.ChartEngine.prototype.drawingClick = function (panel, x, y) {
        if (!CIQ.Drawing) return;
        if (!panel) return; // can be true if panel was closed in the middle of a drawing
        if (this.openDialog !== '') return; // don't register a drawing click if in modal mode
        if (!this.activeDrawing) {
            if (!this.activateDrawing(this.currentVectorParameters.vectorType, panel)) return;
        }
        if (this.activeDrawing) {
            if (this.userPointerDown && !this.activeDrawing.dragToDraw) {
                if (!CIQ.ChartEngine.drawingLine) this.activateDrawing(null);
                return;
            }

            const tick = this.tickFromPixel(x, panel.chart);
            const dpanel = this.panels[this.activeDrawing.panelName];
            let value = this.adjustIfNecessary(dpanel, tick, this.valueFromPixel(y, dpanel));
            if (this.magnetizedPrice) {
                value = this.adjustIfNecessary(dpanel, tick, this.magnetizedPrice);
            }
            if (this.activeDrawing.click(this.chart.tempCanvas.context, tick, value)) {
                if (this.activeDrawing) {
                    // Just in case the drawing aborted itself, such as measure
                    CIQ.ChartEngine.drawingLine = false;
                    CIQ.clearCanvas(this.chart.tempCanvas, this);
                    this.addDrawing(this.activeDrawing); // Save drawing
                    this.activateDrawing(null);
                    this.adjustDrawings();
                    this.draw();
                    this.changeOccurred('vector');
                    if (typeof this.controls.crossX.classList === 'string') {
                        this.controls.crossX.classList.replace('stx_crosshair_drawing', 'stx_crosshair');
                    } else {
                        this.controls.crossX.classList.toString().replace(/.+/gm, 'stx_crosshair');
                    }
                    if (typeof this.controls.crossY.classList === 'string') {
                        this.controls.crossY.classList.replace('stx_crosshair_drawing', 'stx_crosshair');
                    } else {
                        this.controls.crossY.classList.toString().replace(/.+/gm, 'stx_crosshair');
                    }
                }
            } else {
                this.changeOccurred('drawing');
                CIQ.ChartEngine.drawingLine = true;
                this.controls.crossX.classList.replace('stx_crosshair', 'stx_crosshair_drawing');
                this.controls.crossY.classList.replace('stx_crosshair', 'stx_crosshair_drawing');
            }
            return true;
        }
        return false;
    };
};
