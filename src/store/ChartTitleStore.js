import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';

export default class ChartTitleStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore);
        this.animatedPrice = new AnimatedPriceStore();
        this.categoricalDisplay = new CategoricalDisplayStore({
            getCategoricalItems: () => this.mainStore.chart.categorizedSymbols,
            getIsShown: () => this.menu.open,
            onSelectItem: this.onSelectItem.bind(this),
            placeholderText: t.translate('Search...'),
            favoritesId: 'chartTitle&Comparison',
            mainStore,
        });
    }

    @observable todayChange = 0;
    @observable isVisible = false;

    get chart() { return this.mainStore.chart; }
    get context() { return this.mainStore.chart.context; }
    @computed get currentSymbol() { return this.mainStore.chart.currentActiveSymbol; }
    @computed get decimalPlaces() { return this.mainStore.chart.currentActiveSymbol.decimal_places; }
    @computed get isShowChartPrice() { return this.mainStore.chart.isChartAvailable; }

    @action.bound onSelectItem(symbolObject) {
        const currentSymbol = this.mainStore.chart.stxx.chart.symbol;
        if (symbolObject.symbol !== currentSymbol) {
            this.chart.changeSymbol(symbolObject);
        }
        this.menu.setOpen(false);
    }

    onContextReady = () => {
        this.mainStore.chart.feed.onMasterDataUpdate(this.update);
        this.update();
    };

    @action.bound update(quote) {
        if (!this.currentSymbol) { return; }

        this.isVisible = quote || !this.isShowChartPrice;
        if (!this.isVisible) { return; }

        let currentPrice = quote.Close;
        if (currentPrice) {
            currentPrice = currentPrice.toFixed(this.decimalPlaces);
            const oldPrice = this.animatedPrice.price;
            if (oldPrice !== currentPrice) {
                this.animatedPrice.setPrice(currentPrice);
                if (oldPrice) {
                    this.todayChange = Math.abs(currentPrice - oldPrice).toFixed(this.decimalPlaces);
                }
            }
        }
    }
}
