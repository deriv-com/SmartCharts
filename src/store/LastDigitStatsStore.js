import { observable, action, computed, when } from 'mobx';

export default class LastDigitStatsStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        // since last digits stats is going to be rendered in deriv-app
        // we always keep track of the last digit stats.
        when(
            () => this.context,
            () => {
                this.lastSymbol = this.marketDisplayName;
                // TODO: call onMasterDataUpdate on symobl change.
                this.mainStore.chart.feed.onMasterDataUpdate(this.onMasterDataUpdate);
                this.mainStore.chart.feed.onMasterDataReinitialize(() => {
                    if (this.context && this.mainStore.chart.feed) {
                        this.mainStore.chart.feed.offMasterDataUpdate(this.onMasterDataUpdate);
                        this.mainStore.chart.feed.onMasterDataUpdate(this.onMasterDataUpdate);
                    }
                });
            }
        );
    }

    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.context.stx;
    }

    count = 1000;
    digits = [];
    latestData = [];
    lastSymbol = null;
    @observable bars = [];
    // api tick
    @observable lastTick = null;

    get api() {
        return this.mainStore.chart.api;
    }

    @computed get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol?.decimal_places || 2;
    }

    @computed get isVisible() {
        return this.mainStore.state.showLastDigitStats;
    }

    @computed get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.name : '';
    }

    @computed get shouldMinimiseLastDigits() {
        return this.mainStore.state.shouldMinimiseLastDigits;
    }

    @action.bound async updateLastDigitStats(response = {}) {
        if (!this.context || !this.mainStore.chart.currentActiveSymbol) return;

        this.digits = [];
        this.bars = [];
        this.latestData = [];

        for (let i = 0; i < 10; i++) {
            this.digits.push(0);
            this.bars.push({ height: 0, cName: '' });
        }

        if (this.stx.masterData && this.stx.masterData.length >= this.count) {
            this.latestData = this.stx.masterData.slice(-this.count).map(x => x.Close.toFixed(this.decimalPlaces));
        } else {
            const tickHistory =
                response ||
                (await this.api.getTickHistory({
                    symbol: this.mainStore.chart.currentActiveSymbol.symbol,
                    count: this.count,
                }));
            this.latestData = tickHistory && tickHistory.history ? tickHistory.history.prices : [];
        }
        if (!this.context || !this.mainStore.chart.currentActiveSymbol) return;

        this.latestData.forEach(price => {
            const lastDigit = (+price).toFixed(this.decimalPlaces).slice(-1);
            this.digits[lastDigit]++;
        });
        this.updateBars();
    }

    @action.bound onMasterDataUpdate({ Close, tick }) {
        if (!this.context || !this.mainStore.chart.currentActiveSymbol) return;

        this.lastTick = tick;
        if (this.marketDisplayName !== this.lastSymbol) {
            this.lastSymbol = this.marketDisplayName;
            // Symbol has changed
            this.updateLastDigitStats();
        } else if (this.latestData.length) {
            const firstDigit = (+this.latestData.shift()).toFixed(this.decimalPlaces).slice(-1);
            const price = (+Close).toFixed(this.decimalPlaces);
            const lastDigit = price.slice(-1);
            this.latestData.push(+price);
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
