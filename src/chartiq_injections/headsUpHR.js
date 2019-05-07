export const maintainHeadsUpHR = () => {
    CIQ.ChartEngine.prototype.prepend('headsUpHR', function () {
        if (this.currentPanel) {
            this.yaxisLabelStyle = 'rect';
            this.labelType = 'crosshair';
        }
    });
    CIQ.ChartEngine.prototype.append('headsUpHR', function () {
        this.yaxisLabelStyle = 'roundRectArrow';
        this.labelType = null;
    });
};
