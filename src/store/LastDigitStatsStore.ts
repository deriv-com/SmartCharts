import { observable, action, computed, when } from 'mobx';
export default class LastDigitStatsStore {
    mainStore: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
        // since last digits stats is going to be rendered in deriv-app
        // we always keep track of the last digit stats.
        when(() => this.context, () => {
            this.lastSymbol = this.marketDisplayName;
            this.updateLastDigitStats();
            // TODO: call onMasterDataUpdate on symobl change.
            this.mainStore.chart.feed.onMasterDataUpdate(this.onMasterDataUpdate);
            this.mainStore.chart.feed.onMasterDataReinitialize(() => {
                if (this.context && this.mainStore.chart.feed) {
                    this.mainStore.chart.feed.offMasterDataUpdate(this.onMasterDataUpdate);
                    this.mainStore.chart.feed.onMasterDataUpdate(this.onMasterDataUpdate);
                }
            });
        });
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
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    bars = [];
    // api tick
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    lastTick = null;
    get api() {
        return this.mainStore.chart.api;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol?.decimal_places || 2;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get isVisible() {
        return this.mainStore.state.showLastDigitStats;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get marketDisplayName() {
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.name : '';
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get shouldMinimiseLastDigits() {
        return this.mainStore.state.shouldMinimiseLastDigits;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    async updateLastDigitStats() {
        if (!this.context || !this.mainStore.chart.currentActiveSymbol)
            return;
        this.digits = [];
        this.bars = [];
        this.latestData = [];
        for (let i = 0; i < 10; i++) {
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            this.digits.push(0);
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'never'.
            this.bars.push({ height: 0, cName: '' });
        }
        if (this.stx.masterData && this.stx.masterData.length >= this.count) {
            this.latestData = this.stx.masterData.slice(-this.count).map((x: any) => x.Close.toFixed(this.decimalPlaces));
        }
        else {
            const tickHistory = await this.api.getTickHistory({
                symbol: this.mainStore.chart.currentActiveSymbol.symbol,
                count: this.count,
            });
            this.latestData = tickHistory && tickHistory.history ? tickHistory.history.prices : [];
        }
        if (!this.context || !this.mainStore.chart.currentActiveSymbol)
            return;
        this.latestData.forEach(price => {
            const lastDigit = (+price).toFixed(this.decimalPlaces).slice(-1);
            // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            this.digits[lastDigit]++;
        });
        this.updateBars();
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    onMasterDataUpdate({ Close, tick }: any) {
        if (!this.context || !this.mainStore.chart.currentActiveSymbol)
            return;
        this.lastTick = tick;
        if (this.marketDisplayName !== this.lastSymbol) {
            this.lastSymbol = this.marketDisplayName;
            // Symbol has changed
            this.updateLastDigitStats();
        }
        else if (this.latestData.length) {
            // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
            const firstDigit = (+this.latestData.shift()).toFixed(this.decimalPlaces).slice(-1);
            const price = (+Close).toFixed(this.decimalPlaces);
            const lastDigit = price.slice(-1);
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            this.latestData.push(+price);
            // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            this.digits[lastDigit]++;
            // @ts-expect-error ts-migrate(7015) FIXME: Element implicitly has an 'any' type because index... Remove this comment to see the full error message
            this.digits[firstDigit]--;
            this.updateBars();
        }
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateBars() {
        const min = Math.min(...this.digits);
        const max = Math.max(...this.digits);
        this.digits.forEach((digit, idx) => {
            (this.bars[idx] as any).height = (digit * 100) / this.count;
            if (digit === min)
                (this.bars[idx] as any).cName = 'min';
            else if (digit === max)
                (this.bars[idx] as any).cName = 'max';
            else
                (this.bars[idx] as any).cName = '';
        });
        this.bars = this.bars.slice(0); // force array update
    }
}
