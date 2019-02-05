import { observable, action, computed, reaction } from 'mobx';

export default class LastDigitsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        reaction(() => this.mainStore.state.showLastDigits, this.showLastDigits);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }

    @computed get isVisible() {
        return this.mainStore.state.showLastDigits;
    }


    @computed get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.name : '';
    }

    digits = [];
    @observable bars = [];

    @action.bound showLastDigits() {
        if (!this.context) return;
        if (this.mainStore.state.showLastDigits) {
            for (let i = 0; i < 10; i++) {
                this.digits.push(0);
                this.bars.push({ height:0, cName:'' });
            }
            this.stx.masterData.forEach(row => this.updateHistogram(row));
            this.mainStore.chart.feed.onMasterDataUpdate(this.updateHistogram);
        } else {
            this.mainStore.chart.feed.offMasterDataUpdate(this.updateHistogram);
            this.digits = [];
            this.bars = [];
        }
    }

    minHeight = 5;
    maxHeight =100;
    @action.bound updateHistogram({ Close }) {
        const lastDigit = Close.toFixed(this.decimalPlaces).slice(-1);
        this.digits[lastDigit]++;
        const min = Math.min(...this.digits);
        const max = Math.max(...this.digits);
        this.digits.forEach((digit, idx) => {
            this.bars[idx].height = Math.round(((this.maxHeight - this.minHeight) * (digit - min) / (max - min)) + this.minHeight);
            this.bars[idx].gradiant = this.bars[idx].height > 50 ? ((this.bars[idx].height * 50) / this.maxHeight) : 0;
            if (digit === min) this.bars[idx].cName = 'min';
            else if (digit === max) this.bars[idx].cName = 'max';
            else this.bars[idx].cName = '';
        });
        this.bars = this.bars.slice(0); // force array update
    }
}
