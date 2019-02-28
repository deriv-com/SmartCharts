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
        this.mainChartHeight = this.stx.panels.chart.height;
        this.totalHeight     = Object.keys(this.stx.panels).reduce((acc, key) => acc + this.stx.panels[key].height, 0);
        const margin         = this.totalHeight > this.mainChartHeight ? 0 : 30;
        this.top             = this.mainChartHeight - margin - 200;
        this.bottom          = this.totalHeight - this.mainChartHeight + margin + 40;
    }

    updateChartMargin = (margin) => {
        if (this.context && this.stx) {
            this.stx.chart.yAxis.initialMarginBottom = margin;
            this.stx.calculateYAxisMargins(this.stx.chart.panel.yAxis);
            this.stx.draw();
        }
    }
}
