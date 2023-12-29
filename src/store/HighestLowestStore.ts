import Context from 'src/components/ui/Context';
import { TQuote, TRefData } from 'src/types';
import { strToDateTime } from 'src/utils/date';
import MainStore from '.';
import { getUTCEpoch } from '../utils';
import ChartStore from './ChartStore';

class HighestLowestStore {
    highestRef: TRefData | null = null;
    lowestRef: TRefData | null = null;
    mainStore: MainStore;
    highest: TQuote | null = null;
    lowest: TQuote | null = null;

    get feed(): ChartStore['feed'] {
        return this.mainStore.chart.feed;
    }
    get context(): Context | null {
        return this.mainStore.chart.context;
    }

    get isHighestLowestMarkerEnabled() {
        return this.mainStore.chartSetting.isHighestLowestMarkerEnabled;
    }
    get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol?.decimal_places || 2;
    }

    constructor(mainStore: MainStore) {
        this.mainStore = mainStore;
    }

    setHighestRef = (ref: TRefData | null) => {
        this.highestRef = ref;
        if (this.highestRef !== null && ref !== null) {
            this.highestRef.value = ref.div.querySelector('.spot__value');
        }
    };
    setLowestRef = (ref: TRefData | null) => {
        this.lowestRef = ref;

        if (this.lowestRef != null && ref !== null) {
            this.lowestRef.value = ref.div.querySelector('.spot__value');
        }
    };

    calculateHighestLowestByNewData = () => {
        if (!this.highestRef || !this.lowestRef) {
            return;
        }

        const dataSegment = this.mainStore.chart.feed?.quotes;

        if (dataSegment && dataSegment.length) {
            this.highest = null;
            this.lowest = null;

            dataSegment.forEach((tick: TQuote) => {
                if (!tick) {
                    return;
                }

                if (!this.highest || this.highest.Close <= tick.Close) {
                    this.highest = tick;
                }
                if (!this.lowest || this.lowest.Close >= tick.Close) {
                    this.lowest = tick;
                }
            });
        }

        if (!this.highest || !this.lowest || this.highest.Close === this.lowest.Close) {
            this.highestRef.setPosition({ epoch: null, price: null });
            this.lowestRef.setPosition({ epoch: null, price: null });
            return;
        }

        if (this.highest) {
            const price = this.highest.Close.toFixed(this.decimalPlaces);

            this.highestRef.setPosition({
                epoch: getUTCEpoch(strToDateTime(this.highest.Date)),
                price: +price,
            });

            (this.highestRef.value as HTMLElement).textContent = price;
        }
        if (this.lowest) {
            const price = this.lowest.Close.toFixed(this.decimalPlaces);
            this.lowestRef.setPosition({
                epoch: getUTCEpoch(strToDateTime(this.lowest.Date)),
                price: +price,
            });
            (this.lowestRef.value as HTMLElement).textContent = price;
        }
    };
}

export default HighestLowestStore;
