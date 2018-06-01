import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';

export default class ChartTitleStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore({ getContext: () => this.context });
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
    @observable isPriceUp = false;
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
        this.context.stx.append('createDataSet', this.update);
        this.update();
    };

    update = () => {
        if (!this.currentSymbol) { return; }
        const { stx } = this.context;
        const hasData = (stx.chart.dataSet && stx.chart.dataSet.length) > 0;

        this.isVisible = hasData || !this.isShowChartPrice;
        if (!hasData) { return; }

        const currentQuote = stx.currentQuote();
        let currentPrice = currentQuote ? currentQuote.Close : '';
        if (currentPrice) {
            currentPrice = currentPrice.toFixed(this.decimalPlaces);
            const oldPrice = this.animatedPrice.price;
            if (oldPrice !== currentPrice) {
                this.animatedPrice.setPrice(currentPrice);
                const previousClose = currentQuote ? currentQuote.iqPrevClose : undefined;
                if (currentQuote && previousClose) {
                    const todaysChange = currentQuote.Close - previousClose;
                    if (todaysChange > 0) {
                        this.isPriceUp = true;
                    } else if (todaysChange < 0) {
                        this.isPriceUp = false;
                    }
                    this.todayChange = Math.abs(todaysChange).toFixed(this.decimalPlaces);
                }
            }
        }
    }
}
