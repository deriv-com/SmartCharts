import {
    action,
    observable,
    when }                 from 'mobx';


class HighestLowestStore {
    @observable highest;
    @observable lowest;

    get feed()    { return this.mainStore.chart.feed; }
    get context() { return this.mainStore.chart.context; }
    get stx()     { return this.mainStore.chart.stxx; }

    constructor(mainStore) {
        this.mainStore = mainStore;

        when(() => this.context, this.onContextReady);
    }

    @action.bound onContextReady = () => {
        // this.feed.onMasterDataUpdate(this.calculateHighestLowest);
        this.stx.append('draw', this.calculateHighestLowest);
    };

    @action.bound calculateHighestLowest = () => {
        if (this.stx.chart && this.stx.chart.dataSegment.length) {
            const firstItem = this.stx.chart.dataSegment[0];
            const lastItem  = this.stx.chart.dataSegment.slice(-1)[0];
            if (this.highest && this.lowest
                && this.firstItem && this.lastItem
                && this.highest.DT > firstItem.DT && this.lowest.DT > firstItem.DT
                && this.highest.Close > lastItem.Close && this.lowest.Close < lastItem.Close) {
                return;
            }

            this.highest = undefined;
            this.lowest  = undefined;
            this.stx.chart.dataSegment.forEach((tick) => {
                this.highest = this.highest && this.highest.Close > tick.Close ? this.highest : tick;
                this.lowest  = this.lowest && this.lowest.Close < tick.Close ? this.lowest : tick;
            });
        }
    };

    destroy() {
        // this.feed.offMasterDataUpdate(this.calculateHighestLowest);
    }
}


export default HighestLowestStore;
