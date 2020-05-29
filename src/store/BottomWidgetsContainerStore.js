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
        this.stx.append('drawPanels', () => this.updateChartHeight());
        this.isReadyToShow = true;
    }

    @action.bound updateChartHeight() {
        this.mainChartHeight      = this.stx.panels.chart.height;
        this.totalHeight          = Object.keys(this.stx.panels).reduce((acc, key) => (acc + (this.stx.panels[key].hidden ? 0 : this.stx.panels[key].height)), 0);
        const margin              = this.totalHeight > this.mainChartHeight ? 0 : 30;
        const panelPosition       = this.mainStore.chartSetting.position;
        const chartControlsHeight = panelPosition === 'bottom' && this.mainStore.state.chartControlsWidgets ? 40 : 0;
        this.top                  = this.mainChartHeight - margin - 200;
        this.bottom               = this.totalHeight - this.mainChartHeight + margin + chartControlsHeight;
    }

    updateChartMargin = (margin) => {
        if (this.context && this.stx) {
            let marginTop = 125;
            if (margin === 200) {
                if (this.stx.chart.yAxis.height < 325) {
                    margin = 100;
                    const marginTopDiff = 325 - margin - this.stx.chart.yAxis.height;
                    marginTop = marginTopDiff > 0 ? marginTopDiff : 0;
                } else if (Object.keys(this.stx.panels).length > 3) {
                    margin = 100;
                    marginTop = 10;
                }
            }

            this.stx.chart.yAxis.initialMarginTop = marginTop;
            this.stx.chart.yAxis.initialMarginBottom = margin;
            this.stx.calculateYAxisMargins(this.stx.chart.panel.yAxis);
            this.stx.draw();
            if (!this.mainStore.state.shouldMinimiseLastDigits) {
                this.mainStore.state.setShouldMinimiseLastDigit(this.stx.chart.panel.height < 460);
            }
        }
    }
}
