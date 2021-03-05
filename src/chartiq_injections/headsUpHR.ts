export const maintainHeadsUpHR = () => {
    // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
    CIQ.ChartEngine.prototype.prepend('headsUpHR', function (this: any, this: any) {
        if (this.currentPanel) {
            this.labelType = 'crosshair';
        }
    });
    CIQ.ChartEngine.prototype.append('headsUpHR', function (this: any) {
        this.labelType = undefined;
    });
};
