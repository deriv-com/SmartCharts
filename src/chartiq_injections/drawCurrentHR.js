export const maintainDrawCurrentHR = () => {
    CIQ.ChartEngine.prototype.prepend('drawCurrentHR', function () {
        if (this.currentPanel) {
            this.labelType = 'currentSpot';
        }
    });
    CIQ.ChartEngine.prototype.append('drawCurrentHR', function () {
        this.labelType = null;
    });
};
