import { when, observable, action, computed } from 'mobx';

export default class LastDigitsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }
    get stx() { return this.context.stx; }

    onContextReady = () => {
    }

    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }

    @observable digits = [];
    @observable heights = [];

    @action.bound showLastDigits() {
        for (let i = 0; i < 10; i++) {
            this.digits.push(0);
            this.heights.push(0);
        }

        this.stx.masterData.forEach(row => this.updateHistogram(row));

        this.mainStore.chart.feed.onMasterDataUpdate(this.updateHistogram);
    }

    @action.bound updateHistogram({ Close }) {
        const lastDigit = Close.toFixed(this.decimalPlaces).slice(-1);
        this.digits[lastDigit]++;
        const lastDigits = this.digits[lastDigit];
        this.heights[lastDigit] = lastDigits * 5;
        this.heights = this.heights.slice(0); // force array update
    }
}
