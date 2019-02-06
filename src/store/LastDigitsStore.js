import { observable, action, computed, reaction } from 'mobx';

export default class LastDigitsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        reaction(() => this.mainStore.state.showLastDigitStats, this.showLastDigitStats);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    minHeight = 5;
    maxHeight = 100;
    gradiantLine = this.maxHeight / 2;
    digits = [];
    latestData = [];
    @observable bars = [];

    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }

    @computed get isVisible() {
        return this.mainStore.state.showLastDigitStats;
    }

    @computed get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.name : '';
    }

    @action.bound showLastDigitStats() {
        if (!this.context) return;
        if (this.mainStore.state.showLastDigitStats) {
            for (let i = 0; i < 10; i++) {
                this.digits.push(0);
                this.bars.push({ height:0, cName:'' });
            }
            this.latestData = this.stx.masterData.slice(-1000);
            this.latestData.forEach(row => this.updateHistogram(row));
            this.mainStore.chart.feed.onMasterDataUpdate(this.updateHistogram);
        } else {
            this.digits = [];
            this.bars = [];
            this.latestData = [];
            this.mainStore.chart.feed.offMasterDataUpdate(this.updateHistogram);
        }
    }

    @action.bound updateHistogram(data) {
        const lastDigit = data.Close.toFixed(this.decimalPlaces).slice(-1);
        this.latestData.push(data);
        this.digits[lastDigit]++;

        if (this.latestData.length > 1000) {
            const firstDigit = this.latestData.shift();
            this.digits[firstDigit]--;
        }

        const min = Math.min(...this.digits);
        const max = Math.max(...this.digits);
        this.digits.forEach((digit, idx) => {
            this.bars[idx].height = Math.round(((this.maxHeight - this.minHeight) * (digit - min) / (max - min)) + this.minHeight);
            this.bars[idx].gradiantLine = this.bars[idx].height > this.gradiantLine ? ((this.bars[idx].height * this.gradiantLine) / this.maxHeight) : 0;
            if (digit === min) this.bars[idx].cName = 'min';
            else if (digit === max) this.bars[idx].cName = 'max';
            else this.bars[idx].cName = '';
        });
        this.bars = this.bars.slice(0); // force array update
    }
}
