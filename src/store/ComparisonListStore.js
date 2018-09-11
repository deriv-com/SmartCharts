import { observable, action, reaction } from 'mobx';
import AnimatedPriceStore from './AnimatedPriceStore';
import AnimatedPrice from '../components/AnimatedPrice.jsx';

export default class ComparisonListStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        reaction(() => this.comparisonSymbols.map(s => s.price), this.updatePrices);
    }

    @observable animatedPrices = [];
    animatedPriceStore = [];
    get comparisonSymbols() { return this.mainStore.comparison.comparisonSymbols; }
    get context() { return this.mainStore.chart.context; }

    syncAnimatedPricesWithComparisons() {
        let diff = this.comparisonSymbols.length - this.animatedPrices.length;
        if (diff > 0) {
            while (diff-- !== 0) {
                const store = new AnimatedPriceStore();
                this.animatedPriceStore.push(store);
                this.animatedPrices = this.animatedPrices.concat([store.connect(AnimatedPrice)]);
            }
        } else if (diff < 0) {
            while (diff++ !== 0) {
                this.animatedPrices.pop();
                this.animatedPriceStore.pop();
            }
        }
    }

    @action.bound updatePrices() {
        this.syncAnimatedPricesWithComparisons();
        this.comparisonSymbols.map(({ price, prevPrice }, i) => {
            const animatedPrice = this.animatedPriceStore[i];
            animatedPrice.setPrice(price, prevPrice);
        });
    }

    @action.bound onDeleteItem(symbolObject) {
        this.mainStore.comparison.removeComparison(symbolObject);
    }
}
