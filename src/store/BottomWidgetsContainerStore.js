import {
    action,
    observable,
    when }     from 'mobx';

export default class BottomWidgetsContainerStore {
    @observable bottom          = 0;
    @observable isReadyToShow   = false;
    @observable mainChartHeight = 0;
    @observable top             = 0;
    @observable totalHeight     = 0;

    get context() {
        return this.mainStore.chart.context;
    }

    get stx() {
        return this.context.stx;
    }

    constructor(mainStore) {
        this.mainStore = mainStore;

        when(() => this.context, this.initial);
    }

    initial = () => {
        this.stx.append('drawPanels', this.updateChartHeight);
        this.isReadyToShow = true;
    }

    @action.bound updateChartHeight() {
        this.mainChartHeight      = this.stx.panels.chart.height;
        this.totalHeight          = Object.keys(this.stx.panels).reduce((acc, key) => (acc + (this.stx.panels[key].hidden ? 0 : this.stx.panels[key].height)), 0);
        const addedIndicatorsHeight = Object.keys(this.stx.panels)
            .reduce((sum, key) => (
                sum + ((this.stx.panels[key].hidden || key === 'chart') ? 0 : this.stx.panels[key].height)
            ), 0);
        const margin              = this.totalHeight > this.mainChartHeight ? 0 : 30;
        this.top                  = this.mainChartHeight - margin - 200;
        this.bottom               = addedIndicatorsHeight || 30;
    }

    updateChartMargin = (margin) => {
        if (this.context && this.stx) {
            let marginTop = 125;
            if (margin === 200) {
                if (this.stx.chart.yAxis.height < 325) {
                    margin = 100;
                    const marginTopDiff = this.stx.chart.yAxis.height - margin; // - this.stx.chart.yAxis.height;
                    // marginTop = marginTopDiff > 0 ? marginTopDiff : 0;
                    // marginTop = marginTopDiff > 125 ? 125 : marginTopDiff;
                    margin = marginTopDiff < margin + marginTop ? 5 : margin - marginTopDiff;
                } else if (Object.keys(this.stx.panels).length > 3) {
                    margin = 100;
                    marginTop = 10;
                }
            }

            const graphHeight = this.mainStore.chart.chartContainerHeight - marginTop - margin;

            if (graphHeight < 120) {
                marginTop = 85;
                margin = 10;
            }

            if (this.stx.chart.yAxis.initialMarginTop !== marginTop
                || this.stx.chart.yAxis.initialMarginBottom !== margin
            ) {
                this.stx.chart.yAxis.initialMarginTop = marginTop;
                this.stx.chart.yAxis.initialMarginBottom = margin;
                this.stx.draw();
            }
            if (!this.mainStore.state.shouldMinimiseLastDigits) {
                this.mainStore.state.setShouldMinimiseLastDigit(this.stx.chart.panel.height < 460);
            }
        }
    }
}
