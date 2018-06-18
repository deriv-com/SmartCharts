import { observable, action, computed, when } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import { createElement } from '../components/ui/utils';
/* eslint-disable */
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

    @observable todayChange = null;
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
        this.chart.feed.onMasterDataUpdate(this.update);
        this.chart.feed.onMasterDataUpdate(() => {
            const { stxx: stx } = this.mainStore.chart;
            if (this.marker) return;
            this.marker = new CIQ.Marker({
                stx,
                xPositioner: 'date',
                yPositioner: "value",
                // y: 6000,
                x: new Date(stx.masterData[stx.masterData.length-4].DT),
                chartContainer: true,
                label: 'peanut',
                node: createElement('<div class="stx-marker"><div class="peanut"></div></div>'),
            });

            var l=stx.masterData.length;
            var standardType = 'circle';
            // An example of a data array to drive the marker creation
            var data=[
                {x:stx.masterData[l-75].DT, type:standardType, category:"news", headline:"This is a Marker for a News Item"},
                {x:stx.masterData[l-85].DT, type:standardType, category:"earningsUp", headline:"This is a Marker for Earnings (+)"},
                {x:stx.masterData[l-95].DT, type:standardType, category:"earningsDown", headline:"This is a Marker for Earnings (-)"},
                {x:stx.masterData[l-135].DT, type:standardType, category:"dividend", headline:"This is a Marker for Dividends"},
                {x:stx.masterData[l-145].DT, type:standardType, category:"filing", headline:"This is a Marker for a Filing"},
                {x:stx.masterData[l-155].DT, type:standardType, category:"split", headline:"This is a Marker for a Split"}
            ];
            var story="Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.";

            // Loop through the data and create markers
            for(var i=0;i<data.length;i++){
                var datum=data[i];
                datum.story=story;
                var params={
                    stx,
                    label:standardType,
                    xPositioner:"date",
                    x: datum.x,
                    //chartContainer: true, // Allow markers to float out of chart. Set css .stx-marker{ z-index:20}
                    node: new CIQ.Marker.Simple(datum)
                };

                var marker=new CIQ.Marker(params);
            }

            stx.draw();
        });

        this.update();
    };

    @action.bound update(quote) {
        if (!this.currentSymbol) { return; }

        this.isVisible = quote || !this.isShowChartPrice;
        if (!this.isVisible) { return; }

        let currentPrice = quote.Close;
        if (currentPrice) {
            currentPrice = currentPrice.toFixed(this.decimalPlaces);
            const oldPrice = quote.prevClose || this.animatedPrice.price;
            if (oldPrice !== currentPrice) {
                this.animatedPrice.setPrice(currentPrice);
                if (oldPrice) {
                    this.todayChange = Math.abs(currentPrice - oldPrice).toFixed(this.decimalPlaces);
                }
            }
        }
    }
}
