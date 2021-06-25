// @ts-nocheck
export const maintainHeadsUpHR = () => {
    CIQ.ChartEngine.prototype.prepend('headsUpHR', function () {
        if (this.currentPanel) {
            this.labelType = 'crosshair';
        }
    });
    CIQ.ChartEngine.prototype.append('headsUpHR', function () {
        this.labelType = undefined;
    });
};
