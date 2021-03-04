import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/Menu.jsx' was resolved to '/... Remove this comment to see the full error message
import Menu from '../components/Menu.jsx';
import { CategoricalDisplay } from '../components/categoricaldisplay';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/AnimatedPrice.jsx' was resol... Remove this comment to see the full error message
import AnimatedPrice from '../components/AnimatedPrice.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/SymbolSelectButton.jsx' was ... Remove this comment to see the full error message
import { ChartPrice, SymbolSelectButton } from '../components/SymbolSelectButton.jsx';
import { connect } from './Connect';
import ServerTime from '../utils/ServerTime';
export default class ChartTitleStore {
    ChartTitleMenu: any;
    MarketSelector: any;
    SymbolSelectButton: any;
    animatedPrice: any;
    categoricalDisplay: any;
    mainStore: any;
    menu: any;
    serverTime: any;
    constructor(mainStore: any) {
        this.mainStore = mainStore;
        when(() => this.context, this.onContextReady);
        this.menu = new MenuStore(mainStore, { route: 'chart-title' });
        this.animatedPrice = new AnimatedPriceStore();
        this.categoricalDisplay = new CategoricalDisplayStore({
            getCategoricalItems: () => this.mainStore.chart.categorizedSymbols,
            getIsShown: () => this.menu.open,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            placeholderText: t.translate('Search...'),
            favoritesId: 'chartTitle&Comparison',
            mainStore,
            id: 'market_dropdown',
            getCurrentActiveCategory: () => this.currentActiveCategory,
            getCurrentActiveSubCategory: () => this.currentActiveSubCategory,
            getCurrentActiveMarket: () => this.currentActiveMarket,
            searchInputClassName: () => this.searchInputClassName,
        });
        this.serverTime = ServerTime.getInstance();
        this.ChartTitleMenu = this.menu.connect(Menu);
        this.MarketSelector = this.categoricalDisplay.connect(CategoricalDisplay);
        const SpotPrice = this.animatedPrice.connect(AnimatedPrice);
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        const PriceDisplay = connect(() => ({
            isVisible: this.isVisible && this.isShowChartPrice,
            status: this.animatedPrice.status,
            todayChange: this.todayChange,
            todayChangePercent: this.todayChangePercent,
            SpotPrice,
        }))(ChartPrice);
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        this.SymbolSelectButton = connect(() => ({
            symbol: this.currentSymbol,
            ChartPrice: PriceDisplay,
            isSymbolOpen: this.isSymbolOpen,
            symbolOpenTime: this.symbolOpenTime,
        }))(SymbolSelectButton);
    }
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    todayChange = null;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    todayChangePercent = null;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    isVisible = false;
    @observable
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    openMarket = {};
    enableShowPrice = false;
    // @ts-expect-error ts-migrate(7008) FIXME: Member 'searchInputClassName' implicitly has an 'a... Remove this comment to see the full error message
    searchInputClassName;
    get chart() {
        return this.mainStore.chart;
    }
    get context() {
        return this.mainStore.chart.context;
    }
    get crosshairStore() {
        return this.mainStore.crosshair;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get currentSymbol() {
        return this.mainStore.chart.currentActiveSymbol;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get isSymbolOpen() {
        return this.currentSymbol?.exchange_is_open;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get decimalPlaces() {
        return this.mainStore.chart.currentActiveSymbol.decimal_places;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get isShowChartPrice() {
        return this.mainStore.chart.isChartAvailable;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get tradingTimes() {
        return this.mainStore.chart.tradingTimes;
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get symbolOpenTime() {
        const times = this.tradingTimes._tradingTimesMap && this.tradingTimes._tradingTimesMap.length
            ? this.tradingTimes._tradingTimesMap[this.currentSymbol.symbol].times
            : [];
        const now = this.serverTime.getLocalDate().getTime();
        let openTime = times ? times.find((time: any) => time.open.getTime() > now) : null;
        if (!(openTime instanceof Date)) {
            openTime = null;
        }
        return { openTime };
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get currentActiveCategory() {
        if ((this.openMarket as any).category) {
            return (this.openMarket as any).category;
        }
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.market : 'favorite';
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get currentActiveSubCategory() {
        if ((this.openMarket as any).subcategory) {
            return (this.openMarket as any).subcategory;
        }
        return this.mainStore.chart.currentActiveSymbol ? this.mainStore.chart.currentActiveSymbol.symbol : '';
    }
    @computed
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    get currentActiveMarket() {
        if ((this.openMarket as any).market) {
            return (this.openMarket as any).market;
        }
        return null;
    }
    onContextReady = () => {
        this.chart.feed.onMasterDataUpdate(this.update);
        // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
        this.update();
        this.tradingTimes.onMarketOpenCloseChanged(action((changes: any) => {
            for (const symbol in changes) {
                if (this.currentSymbol.symbol === symbol) {
                    this.currentSymbol.exchange_is_open = changes[symbol];
                }
            }
        }));
    };
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    setSymbol(symbolObj: any) {
        if (this.mainStore.state.symbol !== undefined) {
            console.error('Changing symbol does nothing because symbol prop is being set. Consider overriding the onChange prop in <ChartTitle />');
            return;
        }
        this.chart.changeSymbol(symbolObj);
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    update(quote: any) {
        if (!this.currentSymbol) {
            return;
        }
        const isVisible = quote || !this.isShowChartPrice;
        if (!isVisible) {
            return;
        }
        let currentPrice = quote.Close;
        if (currentPrice) {
            currentPrice = currentPrice.toFixed(this.decimalPlaces);
            const oldPrice = quote.prevClose || this.animatedPrice.price;
            this.animatedPrice.setPrice(currentPrice, oldPrice);
            if (oldPrice) {
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'null'.
                this.todayChange = Math.abs(currentPrice - oldPrice).toFixed(this.decimalPlaces);
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'string' is not assignable to type 'null'.
                this.todayChangePercent = ((this.todayChange / oldPrice) * 100).toFixed(2);
            }
        }
        // `todayChange` and `todayChangePercent` has problem on
        // changing symbol, if two symbol have great difference
        // in their values, it has a jumb in showing the correct
        // values, with this code, we simply ignore the first update
        // of these tow value and show the second data and it fix the
        // above issue
        if (!this.isVisible && isVisible && !this.enableShowPrice) {
            this.enableShowPrice = true;
            return;
        }
        this.isVisible = isVisible;
    }
    onMouseEnter = () => this.crosshairStore.updateVisibility(false);
    onMouseLeave = () => this.crosshairStore.updateVisibility(true);
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    hidePrice() {
        this.isVisible = false;
        this.enableShowPrice = false;
    }
    @action.bound
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    updateProps({ open_market, open }: any) {
        if (open_market) {
            this.openMarket = open_market;
        }
        if (open) {
            this.menu.setOpen(true);
        }
    }
}
