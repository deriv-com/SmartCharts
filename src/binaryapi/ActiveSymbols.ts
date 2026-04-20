import { ActiveSymbols as TActiveSymbols, ActiveSymbolsResponse } from '@deriv/api-types';
import { action, computed, observable, runInAction, makeObservable } from 'mobx';
import { TChanges, TChartProps, TInitialChartData } from 'src/types';
import BinaryAPI from './BinaryAPI';
import TradingTimes from './TradingTimes';
import { cloneCategories, stableSort } from '../utils';
import PendingPromise from '../utils/PendingPromise';
import { isDeepEqual } from '../utils/object';
import {
    getCachedDisplayNames
} from '../utils/displayNameUtils';

const DefaultSymbols = [
    'synthetic_index',
    'basket_index',
    'forex',
    'indices',
    'stocks',
    'cryptocurrency',
    'commodities',
];

export type TProcessedSymbolItem = {
    symbol: string;
    name: string;
    market: string;
    subgroup: string;
    submarket: string;
    exchange_is_open: boolean;
    decimal_places: number;
    // Display names for UI
    displayName: string;
    marketDisplayName: string;
    submarketDisplayName: string;
    subgroupDisplayName: string;
};

type TProcessedSymbols = TProcessedSymbolItem[];

export type TSubCategoryDataItem = {
    enabled: boolean;
    itemId: string;
    display: string;
    dataObject: TProcessedSymbolItem;
    selected?: boolean;
};

export type TSubCategoryData = TSubCategoryDataItem[];

export type TSubCategory = {
    subcategoryName: string;
    data: TSubCategoryDataItem[];
};

export type TCategorizedSymbolItem<T = TSubCategory> = {
    categoryName: string;
    categoryId: string;
    hasSubcategory: boolean;
    hasSubgroup: boolean;
    subgroups: TCategorizedSymbolItem[];
    data: T[];
    active?: boolean;
    emptyDescription?: string;
    categorySubtitle?: string;
    categoryNamePostfixShowIfActive?: string;
    categoryNamePostfix?: string;
};

export type TCategorizedSymbols = TCategorizedSymbolItem[];

type ActiveSymbolsParam = {
    enable?: boolean;
    getMarketsOrder?: TChartProps['getMarketsOrder'];
    activeSymbols?: ActiveSymbolsResponse['active_symbols'];
    chartData?: TInitialChartData;
};

export default class ActiveSymbols {
    _api: BinaryAPI;
    _params: ActiveSymbolsParam;
    _tradingTimes: TradingTimes;
    processedSymbols?: TProcessedSymbols;
    changes: TChanges = {};
    categorizedSymbols: TCategorizedSymbols = [];
    symbolMap: Record<string, TProcessedSymbolItem> = {};
    symbolsPromise = PendingPromise<void, void>();
    isRetrievingSymbols = false;

    constructor(api: BinaryAPI, tradingTimes: TradingTimes, params: ActiveSymbolsParam) {
        makeObservable(this, {
            categorizedSymbols: observable,
            changes: observable,
            retrieveActiveSymbols: action.bound,
            computeActiveSymbols: action.bound,
            activeSymbols: computed,
        });
        this._api = api;
        this._tradingTimes = tradingTimes;
        this._params = params;
    }

    async retrieveActiveSymbols(retrieveNewActiveSymbols = false) {
        if (this.isRetrievingSymbols && !retrieveNewActiveSymbols) {
            await this.symbolsPromise;
            return this.activeSymbols;
        }
        const response = await this._api.getActiveSymbols();
        this.isRetrievingSymbols = true;

        let active_symbols: TActiveSymbols | undefined = [];
        if (this._params.activeSymbols && !this.processedSymbols) {
            active_symbols = this._params.activeSymbols;
        } else if (this._params.enable !== false || !isDeepEqual(response.active_symbols, this._params.activeSymbols)) {
            active_symbols = response.active_symbols;
            this._params.activeSymbols = response.active_symbols;
        } else if (this._params.chartData && this._params.enable === false) {
            // Do not need to do anything, the chartData handle the staff
            console.log('ActiveSymbols would render through chartData.');
            return;
        } else {
            console.error('ActiveSymbols feed is not enable nor has initial data!');
            return;
        }

        if (active_symbols !== undefined) {
            this.computeActiveSymbols(active_symbols);
        }
        this.symbolsPromise.resolve();
        return this.activeSymbols;
    }

    computeActiveSymbols(active_symbols: TActiveSymbols) {
        runInAction(() => {
            this.processedSymbols = this._processSymbols(active_symbols);
            
            this.categorizedSymbols = this._categorizeActiveSymbols(this.processedSymbols);
        });
        for (const symbolObj of this.processedSymbols || []) {
            this.symbolMap[symbolObj.symbol] = symbolObj;
        }
        this._tradingTimes.onMarketOpenCloseChanged(
            action((changes: TChanges) => {
                for (const symbol in changes) {
                    const symObj = this.symbolMap[symbol];
                    if (symObj) {
                        symObj.exchange_is_open = changes[symbol];
                    }
                }
                this.changes = changes;
            })
        );
    }

    get activeSymbols() {
        return cloneCategories<TSubCategoryDataItem>(this.categorizedSymbols, item => {
            const itemObject = item as TSubCategoryDataItem;
            const { symbol } = itemObject.dataObject;
            if (symbol in this.changes) {
                itemObject.dataObject.exchange_is_open = this.changes[symbol];
            }
            return { ...item };
        });
    }

    getSymbolObj(symbol: string) {
        return this.symbolMap[symbol];
    }

    _processSymbols(symbols: TActiveSymbols): TProcessedSymbols {
        const processedSymbols: TProcessedSymbols = [];

        // Stable sort is required to retain the order of the symbol name
        const sortedSymbols = stableSort(symbols, (a, b) =>
            a.submarket.localeCompare(b.submarket)
        );

        for (const s of sortedSymbols) {
            // Get display names using the display name service
            const displayNames = getCachedDisplayNames({
                symbol: s.symbol,
                market: s.market,
                submarket: s.submarket,
                subgroup: s.subgroup,
            });

            // Type assertion for new API property names until @deriv/api-types is updated
            const symbolData = s as any;
            
            processedSymbols.push({
                symbol: symbolData.underlying_symbol,
                name: symbolData.underlying_symbol, // Keep raw symbol for internal use
                market: s.market,
                subgroup: s.subgroup,
                submarket: s.submarket,
                exchange_is_open: !!s.exchange_is_open,
                decimal_places: symbolData.pip_size.toString().length - 2,
                // Add display names for UI
                displayName: displayNames.symbolDisplayName,
                marketDisplayName: displayNames.marketDisplayName,
                submarketDisplayName: displayNames.submarketDisplayName,
                subgroupDisplayName: displayNames.subgroupDisplayName,
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

    _categorizeActiveSymbols(activeSymbols: TProcessedSymbols): TCategorizedSymbols {
        const categorizedSymbols: TCategorizedSymbols = [];
        const getSubcategory = (d: TProcessedSymbolItem): TSubCategory => ({
            subcategoryName: d.submarketDisplayName || d.submarket,
            data: [],
        });
        const getCategory = (d: TProcessedSymbolItem): TCategorizedSymbolItem => ({
            categoryName: d.marketDisplayName || d.market,
            categoryId: d.market, // Keep raw market as ID for internal logic
            hasSubcategory: true,
            hasSubgroup: !!(d.subgroup && d.subgroup !== 'none'),
            data: [],
            subgroups: [],
        });
        
        // Use a Map to collect all subcategories for each category
        const categoryMap = new Map<string, {
            category: TCategorizedSymbolItem,
            subcategories: Map<string, TSubCategory>
        }>();        
        for (const symbol of activeSymbols) {            
            const category = getCategory(symbol);
            const subcategory = getSubcategory(symbol);
            
            if (!categoryMap.has(category.categoryId)) {
                categoryMap.set(category.categoryId, {
                    category: category,
                    subcategories: new Map<string, TSubCategory>()
                });
            }
            
            const categoryData = categoryMap.get(category.categoryId)!;
            
            if (!categoryData.subcategories.has(subcategory.subcategoryName)) {
                categoryData.subcategories.set(subcategory.subcategoryName, subcategory);
            }
            
            const currentSubcategory = categoryData.subcategories.get(subcategory.subcategoryName)!;
            
            // Handle subgroups if needed
            if (category.hasSubgroup) {
                if (!categoryData.category.subgroups?.some((el: TCategorizedSymbolItem) => el.categoryId === symbol.subgroup)) {
                    categoryData.category.subgroups?.push({
                        data: [],
                        categoryName: symbol.subgroupDisplayName || symbol.subgroup,
                        categoryId: symbol.subgroup, // Keep raw subgroup as ID for internal logic
                        hasSubcategory: true,
                        hasSubgroup: false,
                        subgroups: [],
                    });
                }
                // should push a subcategory instead of symbol
                if (
                    !categoryData.category.subgroups
                        ?.find((el: TCategorizedSymbolItem) => el.categoryId === symbol.subgroup)
                        ?.data.find((el: TSubCategory) => el.subcategoryName === (symbol.submarketDisplayName || symbol.submarket))
                ) {
                    const subgroupSubcategory = getSubcategory(symbol);
                    categoryData.category.subgroups
                        ?.find((el: TCategorizedSymbolItem) => el.categoryId === symbol.subgroup)
                        ?.data.push(subgroupSubcategory);
                }
                categoryData.category.subgroups
                    ?.find((el: TCategorizedSymbolItem) => el.categoryId === symbol.subgroup)
                    ?.data.find((el: TSubCategory) => el.subcategoryName === (symbol.submarketDisplayName || symbol.submarket))
                    ?.data.push({
                        enabled: true,
                        itemId: symbol.symbol,
                        display: symbol.displayName || symbol.name,
                        dataObject: symbol,
                    });
            }
            currentSubcategory.data.push({
                enabled: true,
                itemId: symbol.symbol,
                display: symbol.displayName || symbol.name,
                dataObject: symbol,
            });
        }

        // Convert the map back to the expected array format
        for (const [, categoryData] of categoryMap) {
            // Add all subcategories to the category
            categoryData.category.data = Array.from(categoryData.subcategories.values());
            categorizedSymbols.push(categoryData.category);
        }
        return categorizedSymbols;
    }
}
