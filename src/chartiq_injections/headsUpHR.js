export const maintainHeadsUpHR = () => {
    CIQ.ChartEngine.prototype.prepend('headsUpHR', function () {
        if (this.currentPanel) {
            this.yaxisLabelStyle = 'roundRect';
            this.labelType = 'crosshair';
        }
    });
    CIQ.ChartEngine.prototype.append('headsUpHR', function () {
        this.yaxisLabelStyle = 'roundRectArrow';
        this.labelType = null;
    });
};
