import { observable, action, computed, runInAction } from 'mobx';
import { stableSort, cloneCategories } from '../utils';
import PendingPromise from '../utils/PendingPromise';

const DefaultSymbols = ['forex', 'indices', 'stocks', 'commodities', 'synthetic_index'];

export default class ActiveSymbols {
    _api: any;
    _params: any;
    _tradingTimes: any;
    processedSymbols: any;
    @observable changes = {};
    @observable categorizedSymbols = [];
    symbolMap = {};
    // @ts-expect-error ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
    symbolsPromise = new PendingPromise();
    isRetrievingSymbols = false;

    constructor(api: any, tradingTimes: any, params: any) {
        this._api = api;
        this._tradingTimes = tradingTimes;
        this._params = params;
    }

    @action.bound async retrieveActiveSymbols(retrieveNewActiveSymbols = false) {
        if (this.isRetrievingSymbols && !retrieveNewActiveSymbols) {
            await this.symbolsPromise;
            return this.activeSymbols;
        }

        this.isRetrievingSymbols = true;

        let active_symbols: any = [];
        if (this._params.initialData && !this.processedSymbols) {
            active_symbols = this._params.initialData;
        } else if (this._params.enable !== false) {
            const response = await this._api.getActiveSymbols();
            active_symbols = response.active_symbols;
        } else {
            console.error('ActiveSymbols feed is not enable nor has initial data!');
            return;
        }

        runInAction(() => {
            this.processedSymbols = this._processSymbols(active_symbols);
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ categoryName: any; categoryId: any; hasSub... Remove this comment to see the full error message
            this.categorizedSymbols = this._categorizeActiveSymbols(this.processedSymbols);
        });
        for (const symbolObj of this.processedSymbols) {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            this.symbolMap[symbolObj.symbol] = symbolObj;
        }
        this._tradingTimes.onMarketOpenCloseChanged(
            action((changes: any) => {
                for (const symbol in changes) {
                    // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    const symObj = this.symbolMap[symbol];
                    if (symObj) {
                        symObj.exchange_is_open = changes[symbol];
                    }
                }
                this.changes = changes;
            })
        );
        this.symbolsPromise.resolve();
        return this.activeSymbols;
    }

    @computed get activeSymbols() {
        const categorized = cloneCategories(this.categorizedSymbols, item => {
            const { symbol } = item.dataObject;
            if (symbol in this.changes) {
                // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                item.dataObject.exchange_is_open = this.changes[symbol];
            }
            return { ...item };
        });
        return categorized;
    }

    getSymbolObj(symbol: any) {
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return this.symbolMap[symbol];
    }

    _processSymbols(symbols: any) {
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
        const orderedMarkets =
            typeof this._params.getMarketsOrder === 'function' ? this._params.getMarketsOrder(symbols) : DefaultSymbols;
        const orderedSymbols = [];
        for (const o of orderedMarkets) {
            for (const p of processedSymbols) {
                if (o === p.market) {
                    orderedSymbols.push(p);
                }
            }
        }

        return orderedSymbols;
    }

    _categorizeActiveSymbols(activeSymbols: any) {
        const categorizedSymbols = [];
        const first = activeSymbols[0];
        const getSubcategory = (d: any) => ({
            subcategoryName: d.submarket_display_name,
            data: [],
        });
        const getCategory = (d: any) => ({
            categoryName: d.market_display_name,
            categoryId: d.market,
            hasSubcategory: true,
            data: [],
        });
        let subcategory = getSubcategory(first);
        let category = getCategory(first);
        for (const symbol of activeSymbols) {
            if (category.categoryName !== symbol.market_display_name) {
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ subcategoryName: any; data: ne... Remove this comment to see the full error message
                category.data.push(subcategory);
                categorizedSymbols.push(category);
                subcategory = getSubcategory(symbol);
                category = getCategory(symbol);
            }
            if (subcategory.subcategoryName !== symbol.submarket_display_name) {
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ subcategoryName: any; data: ne... Remove this comment to see the full error message
                category.data.push(subcategory);
                subcategory = getSubcategory(symbol);
            }
            subcategory.data.push({
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'boolean' is not assignable to type 'never'.
                enabled: true,
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
                itemId: symbol.symbol,
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
                display: symbol.name,
                // @ts-expect-error ts-migrate(2322) FIXME: Type 'any' is not assignable to type 'never'.
                dataObject: symbol,
            });
        }

        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ subcategoryName: any; data: ne... Remove this comment to see the full error message
        category.data.push(subcategory);
        categorizedSymbols.push(category);

        return categorizedSymbols;
    }
}
