import { observable, action, computed, autorunAsync } from 'mobx';
import MenuStore from './MenuStore';
import AnimatedPriceStore from './AnimatedPriceStore';

export default class SymbolsCategoricalDisplayStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
    }

    @computed get activeSymbols() { return this.mainStore.chart.activeSymbols; }
    @computed get currentActiveSymbol() { return this.mainStore.chart.currentActiveSymbol; }
    @computed get categorizedSymbols() { return this._categorizeSymbols(this.activeSymbols); }

    _categorizeSymbols(activeSymbols) {
        let categorizedSymbols = [];
        if(activeSymbols.length > 0) {
            let first = activeSymbols[0].data;
            const getSubcategory = (d) => {
                return {
                    subcategoryName: d.submarket_display_name,
                    data: []
                };
            };
            const getCategory = (d) => {
                return {
                    categoryName: d.market_display_name,
                    categoryId: d.market,
                    hasSubcategory: true,
                    data: []
                };
            };
            let subcategory = getSubcategory(first);
            let category = getCategory(first);
            for (const { data } of activeSymbols) {
                if (category.categoryName !== data.market_display_name) {
                    category.data.push(subcategory);
                    categorizedSymbols.push(category);
                    subcategory = getSubcategory(data);
                    category = getCategory(data);
                }
                if (subcategory.subcategoryName !== data.submarket_display_name) {
                    category.data.push(subcategory);
                    subcategory = getSubcategory(data);
                }
                const selected = data.symbol === this.currentActiveSymbol.symbol;
                const enabled = selected ? false : data.exchange_is_open;
                subcategory.data.push({
                    enabled,
                    selected,
                    display: data.name,
                    symbolObj: data,
                });
            }

            category.data.push(subcategory);
            categorizedSymbols.push(category);
        }

        return categorizedSymbols;
    }
}
