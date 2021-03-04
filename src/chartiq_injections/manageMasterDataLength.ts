export const manageMasterDataLength = () => {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
    CIQ.ChartEngine.prototype.prepend('updateChartData', function(
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any,
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any,
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any,
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any,
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any,
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any,
        // @ts-expect-error ts-migrate(2300) FIXME: Duplicate identifier 'this'.
        this: any
    ) {
        if (
            this.chart.lockScroll &&
            this.chart.dataSegment &&
            this.chart.dataSegment[0] &&
            this.chart.dataSegment[0].DT.valueOf() === this.masterData[0].DT.valueOf()
        ) {
            this.maxMasterDataSize = 0;
        } else {
            this.maxMasterDataSize = 5000;
        }
    });
};
