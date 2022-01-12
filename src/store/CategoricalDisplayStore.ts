import { action, computed, observable, reaction } from 'mobx';
import React from 'react';
import MainStore from '.';
import {
    TCategorizedSymbolItem,
    TCategorizedSymbols,
    TProcessedSymbolItem,
    TSubCategory,
    TSubCategoryDataItem,
} from '../binaryapi/ActiveSymbols';
import Context from '../components/ui/Context';
import { cloneCategories } from '../utils';

type TCategoricalDisplayStoreProps = {
    getCategoricalItems: () => TCategorizedSymbolItem<TSubCategoryDataItem>[];
    onSelectItem?: (item: TProcessedSymbolItem) => void;
    getIsShown: () => boolean;
    placeholderText: string;
    favoritesId: string;
    mainStore: MainStore;
    id: string;
    getCurrentActiveCategory: () => string | undefined | null;
    getCurrentActiveSubCategory: () => string | undefined | null;
    getCurrentActiveMarket: () => string | undefined | null;
    searchInputClassName?: string;
};

export default class CategoricalDisplayStore {
    activeMarket?: string | null;
    activeSubCategory = '';
    categoryElements: Record<string, HTMLElement | null>;
    favoritesId: string;
    getCategoricalItems: () => TCategorizedSymbolItem<TSubCategoryDataItem>[];
    getCurrentActiveCategory: () => string | undefined | null;
    getCurrentActiveMarket: () => string | undefined | null;
    getCurrentActiveSubCategory: () => string | null | undefined;
    id: string;
    isInit: boolean;
    mainStore: MainStore;
    onSelectItem?: (item: TProcessedSymbolItem) => void;
    pauseScrollSpy = false;
    searchInput: React.RefObject<HTMLInputElement>;
    searchInputClassName?: string;
    placeholderText: string;

    constructor({
        getCategoricalItems,
        onSelectItem,
        getIsShown,
        placeholderText,
        favoritesId,
        mainStore,
        id,
        getCurrentActiveCategory,
        getCurrentActiveSubCategory,
        getCurrentActiveMarket,
        searchInputClassName,
    }: TCategoricalDisplayStoreProps) {
        reaction(
            () => getIsShown && getIsShown() && this.scrollPanel,
            () => {
                if (getIsShown() && this.scrollPanel) {
                    this.scrollToActiveSymbol();
                }
            },
            {
                delay: 200,
            }
        );
        this.getCategoricalItems = getCategoricalItems;
        this.onSelectItem = onSelectItem;
        this.favoritesId = favoritesId;
        this.id = id;
        this.categoryElements = {};
        this.mainStore = mainStore;
        this.getCurrentActiveCategory = getCurrentActiveCategory;
        this.getCurrentActiveSubCategory = getCurrentActiveSubCategory;
        this.getCurrentActiveMarket = getCurrentActiveMarket;
        this.isInit = false;
        this.searchInput = React.createRef();
        this.searchInputClassName = searchInputClassName;
        this.placeholderText = placeholderText;
    }

    @observable isShown = false;
    @observable scrollPanel?: HTMLElement | null;
    @observable filterText = '';
    @observable activeCategoryKey = '';
    @observable focusedCategoryKey: string | null = null;
    @observable isScrollingDown = false;
    @observable activeHeadKey: string | null = '';
    scrollTop?: number = undefined;
    isUserScrolling = true;
    lastFilteredItems: TCategorizedSymbols = [];
    activeCategories: string[] = [];

    get chart(): MainStore['chart'] {
        return this.mainStore.chart;
    }

    get context(): Context | null {
        return this.chart.context;
    }

    get height(): number {
        return this.chart.chartContainerHeight ? this.chart.chartContainerHeight - (this.chart.isMobile ? 0 : 120) : 0;
    }

    @action.bound init(): void {
        this.isInit = true;
        // Select first non-empty category:
        if (this.activeCategoryKey === '' && this.filteredItems.length > 0) {
            for (const category of this.filteredItems) {
                const el = this.categoryElements[category.categoryId];
                if (el) {
                    this.activeCategoryKey = category.categoryId;
                    break;
                }
            }
        }
    }
    @computed get favoritesCategoryData() {
        return Object.keys(this.mainStore.favorites.favoritesMap[this.favoritesId]) || [];
    }
    @action.bound getFavorites(): Omit<TCategorizedSymbolItem<TSubCategory | string>, 'data'> {
        this.pauseScrollSpy = true;
        const favoritesCategory = {
            categoryName: t.translate('Favorites'),
            categoryId: 'favorite',
            hasSubcategory: false,
            active: true,
            emptyDescription: t.translate('There are no favorites yet.'),
        };
        setTimeout(() => {
            this.pauseScrollSpy = false;
        }, 20);
        return favoritesCategory;
    }
    @computed get filteredItems(): TCategorizedSymbols {
        let filteredItems: TCategorizedSymbolItem<TSubCategory>[] = cloneCategories<TSubCategory>(
            this.getCategoricalItems()
        );
        const activeItems = this.activeCategories.length
            ? this.activeCategories
            : [this.getCurrentActiveCategory ? this.getCurrentActiveCategory() : 'favorite'];

        for (const item of filteredItems) {
            if (activeItems.includes(item.categoryId)) {
                item.active = true;
            }
        }

        if (this.favoritesId) {
            const favsCategory: TCategorizedSymbolItem<TSubCategory | string> = {
                ...this.getFavorites(),
                data: this.favoritesCategoryData,
            };
            const findFavItem = (category: TCategorizedSymbolItem<TSubCategory | string> | TSubCategory) => {
                const foundItems: TSubCategoryDataItem[] = [];
                if ((category as TCategorizedSymbolItem<TSubCategory | string>).hasSubcategory) {
                    category.data.forEach((subcategory: TSubCategory | TSubCategoryDataItem | string) => {
                        const foundSubItems = findFavItem(
                            subcategory as TCategorizedSymbolItem<TSubCategory | string> | TSubCategory
                        );
                        foundItems.push(...foundSubItems);
                    });
                } else {
                    favsCategory.data.forEach(favItem => {
                        if (typeof favItem === 'string') {
                            const itemObj = (category as TSubCategory).data.find(
                                (item: TSubCategoryDataItem) => item.itemId === favItem
                            );
                            if (itemObj) {
                                foundItems.push(itemObj);
                            }
                        }
                    });
                }
                return foundItems;
            };

            const favsCategoryItem = (favsCategory.data as TSubCategory[]).filter(
                (favItem: TSubCategory) => typeof favItem !== 'string'
            );

            filteredItems.forEach(category => {
                const foundItems = findFavItem(category);
                (favsCategoryItem as TSubCategory[] & TSubCategoryDataItem[]).push(...foundItems);
            });

            favsCategory.data = favsCategoryItem.filter(favItem => favItem);
            filteredItems.unshift(favsCategory as TCategorizedSymbolItem<TSubCategory>);
        }

        if (this.filterText === '') {
            this.lastFilteredItems = filteredItems;
            return filteredItems;
        }

        let searchHasResult = false;
        const queries = this.filterText
            .split(' ')
            .filter(x => x !== '')
            .map(b => b.toLowerCase().trim());
        // regex to check all separate words by comma, should exist in the string
        const hasSearchString = (text: string) => queries.reduce((a, b) => text.toLowerCase().includes(b) && a, true);
        const filterCategory = (c: TCategorizedSymbolItem<TSubCategoryDataItem | TSubCategory>) => {
            c.data = c.data.filter(item =>
                hasSearchString(
                    (item as TSubCategoryDataItem).display ||
                        (typeof (item as TSubCategoryDataItem).dataObject === 'object'
                            ? (item as TSubCategoryDataItem).dataObject.symbol
                            : '')
                )
            );
            if (c.data.length) {
                searchHasResult = true;
            }
        };

        for (const category of filteredItems) {
            category.active = true;
            if (category.hasSubcategory) {
                for (const subcategory of category.data) {
                    filterCategory((subcategory as unknown) as TCategorizedSymbolItem<TSubCategory>);
                }
            } else {
                filterCategory(category);
            }
        }

        if (!searchHasResult) {
            filteredItems = this.lastFilteredItems;
        }

        if (!this.pauseScrollSpy) {
            this.lastFilteredItems = filteredItems;
        }
        return filteredItems;
    }

    @action.bound updateScrollSpy(): void {
        if (this.pauseScrollSpy || !this.scrollPanel) {
            return;
        }
        if (this.filteredItems.length === 0) {
            return;
        }

        const scrollPanelTop = this.scrollPanel.getBoundingClientRect().top;
        let activeMenuId = null;

        for (const category of this.filteredItems) {
            const el = this.categoryElements[category.categoryId];

            if (!el) {
                return;
            }
            const gap_top = this.filteredItems.indexOf(category) * 40;

            const r = el.getBoundingClientRect();
            const top = r.top - scrollPanelTop - gap_top;
            if (top < 0) {
                activeMenuId = category.categoryId;
            }
        }

        const scrollTop = this.scrollPanel.getBoundingClientRect().top;
        if (this.scrollTop && this.scrollTop > scrollTop) {
            this.scrollUp();
        } else {
            this.scrollDown();
        }

        this.scrollTop = scrollTop;
        this.focusedCategoryKey = activeMenuId || this.filteredItems[0].categoryId;
        this.activeHeadKey = this.scrollTop === 0 ? null : this.focusedCategoryKey;
    }

    @action.bound scrollUp(): void {
        this.isScrollingDown = false;
    }

    @action.bound scrollDown(): void {
        // This only affects when scrolling by mouse not by code
        this.isScrollingDown = this.isUserScrolling;
        this.isUserScrolling = true;
    }

    @action.bound setCategoryElement(element: HTMLElement | null, id: string): void {
        this.categoryElements[id] = element;
    }

    @action.bound setFilterText(filterText: string): void {
        this.filterText = filterText;
        this.isUserScrolling = false;
        this.updateScrollSpy();
        if (filterText === '') {
            setTimeout(() => this.scrollToActiveSymbol(), 1);
        }
    }

    @action.bound handleFilterClick(categoryId: string): void {
        const el = this.categoryElements[categoryId];
        const gap_top = Object.keys(this.categoryElements).indexOf(categoryId) * 40;

        if (el) {
            // TODO: Scroll animation
            this.pauseScrollSpy = true;
            this.isUserScrolling = false;
            if (this.scrollPanel) {
                if (this.chart.isMobile) {
                    this.scrollPanel.scroll({
                        top: el.offsetTop - 95,
                        left: 0,
                        behavior: 'smooth',
                    });
                } else {
                    this.scrollPanel.scrollTop = el.offsetTop - gap_top;
                }
            }
            this.focusedCategoryKey = categoryId;
            this.activeHeadKey = null;
            // scrollTop takes some time to take affect, so we need
            // a slight delay before enabling the scroll spy again
            setTimeout(() => {
                this.pauseScrollSpy = false;
            }, 20);
        }
    }

    @action.bound setScrollPanel(element: HTMLElement | null): void {
        this.scrollPanel = element;
    }

    @action.bound handleTitleClick(categoryId: string): void {
        this.activeCategories = [];
        for (const item of this.filteredItems) {
            if (item.categoryId === categoryId) {
                item.active = !item.active;

                if (item.active) {
                    setTimeout(() => this.handleFilterClick(categoryId), 250);
                }
            }

            if (item.active && item.categoryId !== 'favorite') {
                this.activeCategories.push(item.categoryId);
            }
        }

        setTimeout(() => this.updateScrollSpy(), 0);
    }

    @action.bound scrollToActiveSymbol(): void {
        this.focusedCategoryKey = null;
        this.activeCategoryKey = this.getCurrentActiveCategory
            ? (this.getCurrentActiveCategory() as string)
            : 'favorite';
        this.activeSubCategory = this.getCurrentActiveSubCategory ? (this.getCurrentActiveSubCategory() as string) : '';
        this.activeMarket = this.getCurrentActiveMarket ? this.getCurrentActiveMarket() : '';
        const el = this.categoryElements[this.activeCategoryKey];
        const activeSubCategoryClassName = `.sc-mcd__category--${this.activeCategoryKey}  .sc-mcd__category__content--${this.activeSubCategory}`;
        const el_active_sub_category: HTMLElement | null | undefined = this.scrollPanel?.querySelector(
            activeSubCategoryClassName
        );
        const activeMarketClassName = `${activeSubCategoryClassName} .sc-mcd__item--${this.activeMarket}`;
        const el_active_market: HTMLElement | null | undefined = this.scrollPanel?.querySelector(activeMarketClassName);

        this.activeHeadKey = this.activeCategoryKey || null;
        this.pauseScrollSpy = true;
        this.isUserScrolling = false;

        if (this.scrollPanel) {
            if (el && this.scrollPanel) {
                this.scrollPanel.scrollTop = el.offsetTop;
                if (el_active_market) {
                    const topOffset = this.mainStore.chart.isMobile ? 100 : 40;
                    this.scrollPanel.scrollTop = el.offsetTop + el_active_market.offsetTop - topOffset;
                } else if (el_active_sub_category) {
                    const topOffset = this.mainStore.chart.isMobile ? 100 : 0;
                    this.scrollPanel.scrollTop = el.offsetTop + el_active_sub_category.offsetTop - topOffset;
                }
            }
        }
        setTimeout(() => {
            this.pauseScrollSpy = false;
        }, 20);

        if (!this.isInit) {
            this.init();
        }
        if (!this.mainStore.chart.isMobile) {
            setTimeout(() => this.searchInput.current && this.searchInput.current.focus(), 0);
        }

        if (!this.mainStore.chart.isMobile) {
            const categories = Object.keys(this.categoryElements);
            const filtered_categories = categories.filter(item => this.categoryElements[item] !== null);
            const last_category = this.filteredItems?.slice(-1)[0].categoryId;
            const last_category_bottom_gap = this.height - (64 + (filtered_categories.length - 1) * 40); // to make the last category height reach it's filter tab
            const last_category_element = this.categoryElements[last_category];
            if (last_category_element) last_category_element.style.minHeight = `${last_category_bottom_gap}px`;
        }
    }
}
