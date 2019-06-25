import {
    action,
    observable,
    reaction,
    when }                 from 'mobx';


class HighestLowestStore {
    @observable highest;
    @observable lowest;

    get feed()    { return this.mainStore.chart.feed; }
    get context() { return this.mainStore.chart.context; }
    get stx()     { return this.mainStore.chart.stxx; }

    get isHighestLowestMarkerEnabled() { return this.mainStore.chartSetting.isHighestLowestMarkerEnabled; }
    get decimalPlaces() { return this.mainStore.chart.currentActiveSymbol.decimal_places || 0; }

    constructor(mainStore) {
        this.mainStore = mainStore;

        when(() => this.context, this.onContextReady);
        reaction(() => this.isHighestLowestMarkerEnabled, this.enableMarker);
    }

    enableMarker = () => {
        if (this.isHighestLowestMarkerEnabled) {
            this.stx.append('createDataSegment', this.calculateHighestLowestByNewData);
        }
    }

    onContextReady = () => {
        this.enableMarker();
    };

    @action.bound calculateHighestLowestByNewData = () => {
        if (this.stx.chart && this.stx.chart.dataSegment.length) {
            this.highest = undefined;
            this.lowest  = undefined;
            this.stx.chart.isScrollLocationChanged = false;
            this.stx.chart.dataSegment.slice(1).forEach((tick) => {
                this.highest = (this.highest && this.highest.Close > tick.Close && this.highest.DT < tick.DT)
                    || (tick && tick.Close === null)  ? this.highest : tick;
                this.lowest  = (this.lowest && this.lowest.Close < tick.Close && this.lowest.DT < tick.DT)
                    || (tick && tick.Close === null)  ? this.lowest : tick;
                this.stx.chart.isScrollLocationChanged = true;
            });
        }
    };
}


export default HighestLowestStore;
