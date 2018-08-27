import { observable, action, computed } from 'mobx';
import { stableSort } from '../utils';

export default class ActiveSymbols {
    @observable changes = {};
    @observable categorizedSymbols = [];
    symbolMap = {};

    constructor(api, tradingTimes) {
        this._api = api;
        tradingTimes.onMarketOpenCloseChanged(action((changes) => {
            if (this.categorizedSymbols.length === 0) return;
            for (const symbol in changes) {
                this.symbolMap[symbol].exchange_is_open = changes[symbol];
            }
            this.changes = changes;
        }));
    }

    @action.bound async retrieveActiveSymbols() {
        const { active_symbols } = await this._api.getActiveSymbols();
        this.processedSymbols = this._processSymbols(active_symbols);
        this.categorizedSymbols = this._categorizeActiveSymbols(this.processedSymbols);
        for (const symbolObj of this.processedSymbols) {
            this.symbolMap[symbolObj.symbol] = symbolObj;
        }
        return this.activeSymbols;
    }

    @computed get activeSymbols() {
        const categorized = [];
        for (const category of this.categorizedSymbols) {
            const categoryData = [];
            const categoryCopy = { ...category, data: categoryData };
            for (const subcategory of category.data) {
                const subcategoryData = [];
                const subcategoryCopy = { ...subcategory, data: subcategoryData };
                for (const symbolObj of subcategory.data) {
                    const exchange_is_open = (symbolObj.symbol in this.changes) ? this.changes[symbolObj.symbol] : symbolObj.exchange_is_open;
                    subcategoryData.push({
                        ...symbolObj,
                        exchange_is_open,
                    });
                }
                categoryData.push(subcategoryCopy);
            }
            categorized.push(categoryCopy);
        }

        return categorized;
    }

    getSymbolObj(symbol) {
        return this.symbolMap[symbol];
    }

    _processSymbols(symbols) {
        const processedSymbols = [];

        // Stable sort is required to retain the order of the symbol name
        stableSort(symbols, (a, b) => a.submarket_display_name.localeCompare(b.submarket_display_name));

        for (const s of symbols) {
            processedSymbols.push({
                symbol: s.symbol,
                name: s.display_name,
                market: s.market,
                market_display_name: s.market_display_name,
                submarket_display_name: s.submarket_display_name,
                exchange_is_open: s.exchange_is_open,
                decimal_places: s.pip.length - 2,
            });
        }


        // Categorize symbols in order defined by another array; there's probably a more
        // efficient algo for this, but for just ~100 items it's not worth the effort
        const order = ['forex', 'indices', 'stocks', 'commodities', 'volidx'];
        const orderedSymbols = [];
        for (const o of order) {
            for (const p of processedSymbols) {
                if (o === p.market) {
                    orderedSymbols.push(p);
                }
            }
        }

        return orderedSymbols;
    }

    _categorizeActiveSymbols(activeSymbols) {
        const categorizedSymbols = [];
        const first = activeSymbols[0];
        const getSubcategory = d => ({
            subcategoryName: d.submarket_display_name,
            data: [],
        });
        const getCategory = d => ({
            categoryName: d.market_display_name,
            categoryId: d.market,
            hasSubcategory: true,
            data: [],
        });
        let subcategory = getSubcategory(first);
        let category = getCategory(first);
        for (const symbol of activeSymbols) {
            if (category.categoryName !== symbol.market_display_name) {
                category.data.push(subcategory);
                categorizedSymbols.push(category);
                subcategory = getSubcategory(symbol);
                category = getCategory(symbol);
            }
            if (subcategory.subcategoryName !== symbol.submarket_display_name) {
                category.data.push(subcategory);
                subcategory = getSubcategory(symbol);
            }
            subcategory.data.push({
                enabled: true,
                itemId: symbol.symbol,
                display: symbol.name,
                dataObject: symbol,
                exchange_is_open: !!symbol.exchange_is_open,
            });
        }

        category.data.push(subcategory);
        categorizedSymbols.push(category);

        return categorizedSymbols;
    }
}
