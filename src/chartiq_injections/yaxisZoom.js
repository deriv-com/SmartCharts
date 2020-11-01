export const yaxisZoom = () => {
    let old_zoom = 0;
    CIQ.ChartEngine.prototype.append('mousemove', function () {
        if (this.overYAxis && this.grabMode === 'zoom-y') {
            const yAxis = this.grabStartYAxis;
            if (yAxis) {
                if (
                    (yAxis.height < yAxis.zoom + 30)
                || (yAxis.zoom < 70)
                ) {
                    yAxis.zoom = old_zoom;
                }
                old_zoom = yAxis.zoom;
                this.draw();
            }
        }
    });
};
