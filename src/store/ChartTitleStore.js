import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';

export default class ChartTitleStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route: 'chart-title' });
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
    @observable todayChangePercentage = 0;
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
        this.context.stx.append('createDataSet', this.update.bind(this));
        this.update();
    };

    update() {
        if (!this.currentSymbol) { return; }
        const stx = this.context.stx;
        const currentQuote = stx.currentQuote();
        const previousClose = currentQuote ? currentQuote.iqPrevClose : undefined;

        const hasData = (stx.chart.dataSet && stx.chart.dataSet.length) > 0;
        this.isVisible = hasData || !this.isShowChartPrice;
        if (!hasData) { return; }

        const internationalizer = stx.internationalizer;
        let priceChanged = false;

        let todaysChange = 0;
        let todaysChangePct = 0;
        let currentPrice = currentQuote ? currentQuote.Close : '';
        if (currentPrice) {
            currentPrice = currentPrice.toFixed(this.decimalPlaces);
            const oldPrice = this.animatedPrice.price;
            if (oldPrice !== currentPrice) {
                priceChanged = true;
            }
            this.animatedPrice.setPrice(currentPrice);
        }

        if (priceChanged) {
            if (currentQuote && previousClose) {
                todaysChange = CIQ.fixPrice(currentQuote.Close - previousClose);
                todaysChangePct = todaysChange / previousClose * 100;
                if (internationalizer) {
                    this.todayChangePercentage = internationalizer.percent2.format(todaysChangePct / 100);
                } else {
                    this.todayChangePercentage = `${todaysChangePct.toFixed(2)}%`;
                }
            }
            this.todayChange = Math.abs(todaysChange).toFixed(this.decimalPlaces);
        }

        if (todaysChangePct > 0) {
            this.isPriceUp = true;
        } else if (todaysChangePct < 0) {
            this.isPriceUp = false;
        }
    }
}
