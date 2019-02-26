import { observable, action, computed } from 'mobx';

export default class LastDigitStatsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    count = 1000;
    digits = [];
    latestData = [];
    symbolChanged=false;
    @observable bars = [];

    get api() {
        return this.mainStore.chart.api;
    }

    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }

    @computed get isVisible() {
        return this.mainStore.state.showLastDigitStats;
    }

    @computed get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.name : '';
    }

    @action.bound changeSymbol() {
        this.symbolChanged = true;
    }

    @action.bound async showLastDigitStats() {
        this.digits = [];
        this.bars = [];
        this.latestData = [];
        this.updateChartMargin(50);
        if (this.mainStore.chart && this.mainStore.chart.feed) {
            this.mainStore.chart.feed.offMasterDataUpdate(this.onMasterDataUpdate);
        }

        if (this.mainStore.state.showLastDigitStats) {
            for (let i = 0; i < 10; i++) {
                this.digits.push(0);
                this.bars.push({ height:0, cName:'' });
            }

            this.updateChartMargin(150);

            if (this.context && this.stx.masterData && this.stx.masterData.length >= this.count) {
                this.latestData  = this.stx.masterData.slice(-this.count).map(x => x.Close.toFixed(this.decimalPlaces));
            } else {
                const tickHistory = await this.api.getTickHistory({ symbol :this.mainStore.chart.currentActiveSymbol.symbol, count:this.count });
                this.latestData = tickHistory && tickHistory.history ? tickHistory.history.prices : [];
            }

            this.latestData.forEach((price) => {
                const lastDigit = price.slice(-1);
                this.digits[lastDigit]++;
            });
            this.updateBars();
            this.mainStore.chart.feed.onMasterDataUpdate(this.onMasterDataUpdate);
        }
    }

    updateChartMargin =(margin) => {
        if(!this.context || !this.stx) return;
        this.stx.chart.yAxis.initialMarginBottom = margin;
        this.stx.calculateYAxisMargins(this.stx.chart.panel.yAxis);
        this.stx.draw();
    }

    @action.bound onMasterDataUpdate({ Close }) {
        if (this.symbolChanged) {
            // Symbol has changed
            this.showLastDigitStats();
            this.symbolChanged = false;
        } else {
            const firstDigit = this.latestData.shift().slice(-1);
            const price =  Close.toFixed(this.decimalPlaces);
            const lastDigit = price.slice(-1);
            this.latestData.push(price);
            this.digits[lastDigit]++;
            this.digits[firstDigit]--;
            this.updateBars();
        }
    }

    @action.bound updateBars() {
        const min = Math.min(...this.digits);
        const max = Math.max(...this.digits);
        this.digits.forEach((digit, idx) => {
            this.bars[idx].height = (digit * 100) / this.count;
            if (digit === min) this.bars[idx].cName = 'min';
            else if (digit === max) this.bars[idx].cName = 'max';
            else this.bars[idx].cName = '';
        });
        this.bars = this.bars.slice(0); // force array update
    }
}
