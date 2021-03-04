import { reaction, when } from 'mobx';
import { getUTCEpoch } from '../utils';

class HighestLowestStore {
    highestRef: any;
    lowestRef: any;
    mainStore: any;
    highest = null;
    lowest = null;

    injectionId = null;

    get feed() {
        return this.mainStore.chart.feed;
    }
    get context() {
        return this.mainStore.chart.context;
    }
    get stx() {
        return this.mainStore.chart.stxx;
    }

    get isHighestLowestMarkerEnabled() {
        return this.mainStore.chartSetting.isHighestLowestMarkerEnabled;
    }
    get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places || 0;
    }

    constructor(mainStore: any) {
        this.mainStore = mainStore;

        when(() => this.context, this.onContextReady);
        reaction(() => this.isHighestLowestMarkerEnabled, this.enableMarker);
    }

    clearInjection = () => {
        if (this.injectionId) {
            this.highestRef = null;
            this.lowestRef = null;
            this.stx.removeInjection(this.injectionId);
            this.injectionId = null;
        }
    };

    enableMarker = () => {
        if (this.isHighestLowestMarkerEnabled) {
            this.injectionId = this.stx.append('createDataSegment', this.calculateHighestLowestByNewData);
        } else {
            this.clearInjection();
        }
    };

    setHighestRef = (ref: any) => {
        this.highestRef = ref;
        if (ref !== null) {
            this.highestRef.value = ref.div.querySelector('.spot__value');
        }
    };
    setLowestRef = (ref: any) => {
        this.lowestRef = ref;

        if (ref !== null) {
            this.lowestRef.value = ref.div.querySelector('.spot__value');
        }
    };

    onContextReady = this.enableMarker;

    calculateHighestLowestByNewData = () => {
        if (!this.highestRef || !this.lowestRef) {
            return;
        }

        if (this.stx.chart && this.stx.chart.dataSegment.length) {
            this.highest = null;
            this.lowest = null;

            this.stx.chart.dataSegment.forEach((tick: any) => {
                if (!tick) {
                    return;
                }

                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                if (!this.highest || this.highest.Close <= tick.Close) {
                    this.highest = tick;
                }
                // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
                if (!this.lowest || this.lowest.Close >= tick.Close) {
                    this.lowest = tick;
                }
            });
        }

        // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
        if (!this.highest || !this.lowest || this.highest.Close === this.lowest.Close) {
            this.highestRef.setPosition({ epoch: null, price: null });
            this.lowestRef.setPosition({ epoch: null, price: null });
            return;
        }

        if (this.highest) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const price = this.highest.Close.toFixed(this.decimalPlaces);

            this.highestRef.setPosition({
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                epoch: getUTCEpoch(CIQ.strToDateTime(this.highest.Date)),
                price,
            });

            this.highestRef.value.textContent = price;
        }
        if (this.lowest) {
            // @ts-expect-error ts-migrate(2531) FIXME: Object is possibly 'null'.
            const price = this.lowest.Close.toFixed(this.decimalPlaces);
            this.lowestRef.setPosition({
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 'CIQ'.
                epoch: getUTCEpoch(CIQ.strToDateTime(this.lowest.Date)),
                price,
            });
            this.lowestRef.value.textContent = price;
        }
    };
}

export default HighestLowestStore;
