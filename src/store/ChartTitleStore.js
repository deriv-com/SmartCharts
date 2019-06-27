import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import Menu from '../components/Menu.jsx';
import { CategoricalDisplay } from '../components/categoricaldisplay';
import AnimatedPrice from '../components/AnimatedPrice.jsx';
import { ChartPrice, SymbolSelectButton } from '../components/SymbolSelectButton.jsx';
import { connect } from './Connect';
import ServerTime from '../utils/ServerTime';

export default class ChartTitleStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route: 'chart-title' });
        this.animatedPrice = new AnimatedPriceStore();
        this.categoricalDisplay = new CategoricalDisplayStore({
            getCategoricalItems: () => this.mainStore.chart.categorizedSymbols,
            getIsShown: () => this.menu.open,
            placeholderText: t.translate('Search...'),
            favoritesId: 'chartTitle&Comparison',
            mainStore,
            id: 'market_dropdown',
            getCurrentActiveCategory: () => (this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.market : 'favorite'),
            getCurrentActiveSubCategory: () => (this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.symbol : ''),
            searchInputClassName: () => this.searchInputClassName,
        });
        this.serverTime = ServerTime.getInstance();

        this.ChartTitleMenu = this.menu.connect(Menu);
        this.MarketSelector = this.categoricalDisplay.connect(CategoricalDisplay);
        const SpotPrice = this.animatedPrice.connect(AnimatedPrice);

        const PriceDisplay = connect(() => ({
            isVisible: this.isVisible && this.isShowChartPrice,
            status: this.animatedPrice.status,
            todayChange: this.todayChange,
            todayChangePercent: this.todayChangePercent,
            SpotPrice,
        }))(ChartPrice);

        this.SymbolSelectButton = connect(() => ({
            symbol: this.currentSymbol,
            ChartPrice: PriceDisplay,
            isSymbolOpen: this.isSymbolOpen,
            symbolOpenTime: this.symbolOpenTime,
        }))(SymbolSelectButton);
    }

    @observable todayChange = null;
    @observable todayChangePercent = null;
    @observable isVisible = false;
    searchInputClassName;

    get chart() { return this.mainStore.chart; }
    get context() { return this.mainStore.chart.context; }
    @computed get currentSymbol() { return this.mainStore.chart.currentActiveSymbol; }
    @computed get isSymbolOpen() { return this.currentSymbol.exchange_is_open; }
    @computed get decimalPlaces() { return this.mainStore.chart.currentActiveSymbol.decimal_places; }
    @computed get isShowChartPrice() { return this.mainStore.chart.isChartAvailable; }
    @computed get tradingTimes() { return this.mainStore.chart.tradingTimes; }
    @computed get symbolOpenTime() {
        const times = this.tradingTimes._tradingTimesMap && this.tradingTimes._tradingTimesMap.length ? this.tradingTimes._tradingTimesMap[this.currentSymbol.symbol].times : [];
        const now = this.serverTime.getLocalDate().getTime();
        let openTime = times ? times.find(time => time.open.getTime() > now) : null;

        if (!(openTime instanceof Date)) {
            openTime = null;
        }

        return { openTime };
    }

    onContextReady = () => {
        this.chart.feed.onMasterDataUpdate(this.update);
        this.update();

        this.tradingTimes.onMarketOpenCloseChanged(action((changes) => {
            for (const symbol in changes) {
                if (this.currentSymbol.symbol === symbol) {
                    this.currentSymbol.exchange_is_open = changes[symbol];
                }
            }
        }));
    };

    @action.bound updateProps(searchInputClassName) {
        this.searchInputClassName = searchInputClassName;
    }

    @action.bound setSymbol(symbolObj) {
        if (this.mainStore.state.symbol !== undefined) {
            console.error('Changing symbol does nothing because symbol prop is being set. Consider overriding the onChange prop in <ChartTitle />');
            return;
        }

        this.chart.changeSymbol(symbolObj);
    }

    @action.bound update(quote) {
        if (!this.currentSymbol) { return; }

        this.isVisible = quote || !this.isShowChartPrice;
        if (!this.isVisible) { return; }


        let currentPrice = quote.Close;
        if (currentPrice) {
            currentPrice = currentPrice.toFixed(this.decimalPlaces);
            const oldPrice = quote.prevClose || this.animatedPrice.price;
            this.animatedPrice.setPrice(currentPrice, oldPrice);
            if (oldPrice) {
                this.todayChange = Math.abs(currentPrice - oldPrice).toFixed(this.decimalPlaces);
                this.todayChangePercent = ((this.todayChange / oldPrice) * 100).toFixed(2);
            }
        }
    }
}
