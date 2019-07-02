import {
    action,
    observable,
    reaction,
    when }             from 'mobx';
import { getUTCEpoch } from '../utils';


class HighestLowestStore {
    @observable highestDate;
    @observable highestPrice;
    @observable lowestDate
    @observable lowestPrice;

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
            this.stx.chart.isScrollLocationChanged = false;
            this.highestPrice = undefined;
            this.lowestPrice  = undefined;
            this.stx.chart.dataSegment.forEach((tick) => {
                if (!tick) { return; }

                const highest = (+this.highestPrice > tick.Close && this.highestDate < tick.DT)
                    || (tick && tick.Close === null)  ? null : tick;
                const lowest  = (+this.lowestPrice < tick.Close && this.lowestDate < tick.DT)
                    || (tick && tick.Close === null)  ? null : tick;

                if (highest) {
                    this.highestDate  = getUTCEpoch(CIQ.strToDateTime(highest.Date));
                    this.highestPrice = highest.Close.toFixed(this.decimalPlaces);
                }
                if (lowest) {
                    this.lowestDate  = getUTCEpoch(CIQ.strToDateTime(lowest.Date));
                    this.lowestPrice = lowest.Close.toFixed(this.decimalPlaces);
                }
                this.stx.chart.isScrollLocationChanged = true;
            });
        }
    };
}


export default HighestLowestStore;
