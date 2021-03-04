import { action, observable, when } from 'mobx';

export default class BottomWidgetsContainerStore {
    @observable bottom = 0;
    @observable isReadyToShow = false;
    @observable mainChartHeight = 0;
    @observable top = 0;
    @observable totalHeight = 0;

    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }
    get state() {
        return this.mainStore.state;
    }

    constructor(mainStore) {
        this.mainStore = mainStore;

        when(() => this.context, this.initial);
    }

    initial = () => {
        this.stx.append('drawPanels', this.updateChartHeight);
        this.isReadyToShow = true;
    };

    @action.bound updateChartHeight() {
        this.mainChartHeight = this.stx.panels.chart.height;
        this.totalHeight = Object.keys(this.stx.panels).reduce(
            (acc, key) => acc + (this.stx.panels[key].hidden ? 0 : this.stx.panels[key].height),
            0
        );
        const addedIndicatorsHeight = Object.keys(this.stx.panels).reduce(
            (sum, key) => sum + (this.stx.panels[key].hidden || key === 'chart' ? 0 : this.stx.panels[key].height),
            0
        );
        const margin = this.totalHeight > this.mainChartHeight ? 0 : 30;
        this.top = this.mainChartHeight - margin - 200;
        this.bottom = addedIndicatorsHeight || 30;
    }

    updateChartMargin = hasBottomWidget => {
        if (this.context && this.stx) {
            const marginTop = this.state.yAxisMargin.top || 106;
            let marginBottom = this.state.yAxisMargin.bottom || 64;

            if (hasBottomWidget) {
                marginBottom += 64;
            }

            if (
                this.stx.chart.yAxis.initialMarginTop !== marginTop ||
                this.stx.chart.yAxis.initialMarginBottom !== marginBottom
            ) {
                this.stx.chart.yAxis.initialMarginTop = marginTop;
                this.stx.chart.yAxis.initialMarginBottom = marginBottom;
                this.stx.calculateYAxisMargins(this.stx.chart.panel.yAxis);
                this.stx.draw();
            }
            if (!this.mainStore.state.shouldMinimiseLastDigits) {
                this.mainStore.state.setShouldMinimiseLastDigit(this.stx.chart.panel.height < 460);
            }
        }
    };
}
