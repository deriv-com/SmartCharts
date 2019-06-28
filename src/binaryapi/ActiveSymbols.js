import { observable, action, computed, runInAction } from 'mobx';
import { stableSort, cloneCategories } from '../utils';
import PendingPromise from '../utils/PendingPromise';

export default class ActiveSymbols {
    @observable changes = {};
    @observable categorizedSymbols = [];
    symbolMap = {};
    symbolsPromise = new PendingPromise();
    isRetrievingSymbols = false;

    constructor(api, tradingTimes) {
        this._api = api;
        this._tradingTimes = tradingTimes;
    }

    @action.bound async retrieveActiveSymbols(retrieveNewActiveSymbols = false) {
        if (this.isRetrievingSymbols && !retrieveNewActiveSymbols) {
            await this.symbolsPromise;
            return this.activeSymbols;
        }

        this.isRetrievingSymbols = true;
        const { active_symbols } = await this._api.getActiveSymbols();
        runInAction(() => {
            this.processedSymbols = this._processSymbols(active_symbols);
            this.categorizedSymbols = this._categorizeActiveSymbols(this.processedSymbols);
        });
        for (const symbolObj of this.processedSymbols) {
            this.symbolMap[symbolObj.symbol] = symbolObj;
        }
        this._tradingTimes.onMarketOpenCloseChanged(action((changes) => {
            for (const symbol in changes) {
                const symObj = this.symbolMap[symbol];
                if (symObj) {
                    symObj.exchange_is_open = changes[symbol];
                }
            }
            this.changes = changes;
        }));
        this.symbolsPromise.resolve();
        return this.activeSymbols;
    }

    @computed get activeSymbols() {
        const categorized = cloneCategories(this.categorizedSymbols, (item) => {
            const { symbol } = item.dataObject;
            if (symbol in this.changes) {
                item.dataObject.exchange_is_open = this.changes[symbol];
            }
            return { ...item };
        });
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
                exchange_is_open: !!s.exchange_is_open,
                decimal_places: s.pip.toString().length - 2,
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
            });
        }

        category.data.push(subcategory);
        categorizedSymbols.push(category);

        return categorizedSymbols;
    }
}
