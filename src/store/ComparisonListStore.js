import { observable, action, computed, reaction } from 'mobx';
import AnimatedPriceStore from './AnimatedPriceStore';
import AnimatedPrice from '../components/AnimatedPrice.jsx';

export default class ComparisonListStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        reaction(() => this.comparisonSymbols, this.updatePrices);
    }

    @observable animatedPrices = [];
    animatedPriceStore = [];
    get comparisonSymbols() { return this.mainStore.chart.comparisonSymbols; }
    get context() { return this.mainStore.chart.context; }

    syncAnimatedPricesWithComparisons = () => {
        let diff = this.comparisonSymbols.length - this.animatedPrices.length;
        if (diff > 0) {
            while (diff--) {
                const store = new AnimatedPriceStore();
                this.animatedPrices.push(store.connect(AnimatedPrice));
                this.animatedPriceStore.push(store);
            }
        } else if (diff < 0) {
            this.animatedPrices.splice(diff, diff);
            this.animatedPriceStore.splice(diff, diff);
        }
    };

    updatePrices = () => {
        this.syncAnimatedPricesWithComparisons();
        this.comparisonSymbols.map((item, i) => {
            const animatedPrice = this.animatedPriceStore[i];
            animatedPrice.setPrice(item.price);
        });
    }

    @action.bound onDeleteItem(symbolObject) {
        this.context.stx.removeSeries(symbolObject.symbol);
    }
}
