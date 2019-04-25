export const maintainHeadsUpHR = () => {
    CIQ.ChartEngine.prototype.prepend('headsUpHR', function () {
        if (this.currentPanel) this.yaxisLabelStyle = 'rect';
    });
    CIQ.ChartEngine.prototype.append('headsUpHR', function () {
        this.yaxisLabelStyle = 'roundRectArrow';
    });
};
