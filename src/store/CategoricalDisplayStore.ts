import React from 'react';
import { action, observable, computed, reaction } from 'mobx';
import { IWrappedComponent } from 'mobx-react';
import { connect } from './Connect';
import SearchInput, { TSearchInputProps } from '../components/SearchInput';
import { NormalItem, ActiveItem, TActiveItemProps, ResultsPanel, TResultsPanelProps, FilterPanel, TFilterPanelProps } from '../components/categoricaldisplay';
import { cloneCategories, cloneCategory } from '../utils';
import Context from '../components/ui/Context';
import { TMainStore, TCategory, TCategoricalItem, TSubcategory } from '../types';

export default class CategoricalDisplayStore {
    FilterPanel: IWrappedComponent<TFilterPanelProps>;
    ResultsPanel: IWrappedComponent<TResultsPanelProps>;
    SearchInput: IWrappedComponent<TSearchInputProps>;
    activeMarket: any;
    activeSubCategory = '';
    categoryElements: any;
    favoritesId: string;
    getActiveCategory: () => TCategory;
    getCategoricalItems: any;
    getCurrentActiveCategory: () => string;
    getCurrentActiveMarket: any;
    getCurrentActiveSubCategory: () => string;
    id: string;
    isInit: boolean;
    mainStore: TMainStore;
    onSelectItem?: (item: TCategoricalItem) => void;
    pauseScrollSpy = false;
    searchInput: React.RefObject<HTMLInputElement>;
    searchInputClassName: string;
    constructor({
        getCategoricalItems,
        onSelectItem,
        getIsShown,
        getActiveCategory,
        activeOptions,
        placeholderText,
        favoritesId,
        mainStore,
        id,
        getCurrentActiveCategory,
        getCurrentActiveSubCategory,
        getCurrentActiveMarket,
        searchInputClassName,
    }: CategoricalDisplayStore & TActiveItemProps & {getIsShown: () => boolean; placeholderText: string;}) {
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
        this.getActiveCategory = getActiveCategory;
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

        const normalItem = connect(() => ({
            favoritesId,
        }))(NormalItem);

        const activeItem = connect(() => ({
            activeOptions,
            favoritesId,
        }))(ActiveItem);

        const getItemType = (categoryId: string): typeof activeItem | typeof normalItem => {
            if (categoryId === 'active' && this.getActiveCategory !== undefined) {
                return activeItem;
            }

            return normalItem;
        };

        this.ResultsPanel = connect<TMainStore, TResultsPanelProps>(() => ({
            filteredItems: this.filteredItems,
            setCategoryElement: this.setCategoryElement,
            getItemType,
            activeHeadTop: this.activeHeadTop,
            activeHeadKey: this.activeHeadKey,
            activeHeadOffset: this.activeHeadOffset,
            handleTitleClick: this.handleTitleClick,
        }))(ResultsPanel);

        this.FilterPanel = connect<TMainStore, TFilterPanelProps>(({ chart }: TMainStore) => ({
            isMobile: chart.isMobile,
            filteredItems: this.filteredItems,
            handleFilterClick: this.handleFilterClick,
            activeCategoryKey: this.activeCategoryKey,
            focusedCategoryKey: this.focusedCategoryKey,
            isSearching: this.filterText !== '',
        }))(FilterPanel);

        this.SearchInput = connect<TMainStore, TSearchInputProps>(() => ({
            placeholder: placeholderText,
            value: this.filterText,
            onChange: this.setFilterText,
            searchInput: this.searchInput,
            searchInputClassName: this.searchInputClassName,
        }))(SearchInput);
    }

    @observable isShown = false;
    @observable scrollPanel?: HTMLElement;
    @observable filterText = '';
    @observable activeCategoryKey = '';
    @observable focusedCategoryKey: string | null = null;
    @observable isScrollingDown = false;
    @observable activeHeadKey: string | null = '';
    @observable activeHeadTop: number | null = 0;
    @observable activeHeadOffset?: number = undefined;
    scrollTop?: number = undefined;
    isUserScrolling = true;
    lastFilteredItems: any[] = [];
    activeCategories: any[] = [];

    get chart(): TMainStore["chart"] {
        return this.mainStore.chart;
    }

    get context(): Context {
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

    @computed get favoritesCategory(): TCategory {
        this.pauseScrollSpy = true;
        const favoritesCategory = {
            categoryName: t.translate('Favorites'),
            categoryId: 'favorite',
            hasSubcategory: false,
            active: true,
            emptyDescription: t.translate('There are no favorites yet.'),
            data: Object.keys(this.mainStore.favorites.favoritesMap[this.favoritesId]) || [],
        };
        setTimeout(() => {
            this.pauseScrollSpy = false;
        }, 20);
        return favoritesCategory;
    }

    @computed get filteredItems(): Array<TCategory> {
        let filteredItems = cloneCategories(this.getCategoricalItems());
        const activeItmes = this.activeCategories.length
            ? this.activeCategories
            : [this.getCurrentActiveCategory ? this.getCurrentActiveCategory() : 'favorite'];

        for (const item of filteredItems) {
            if (activeItmes.includes(item.categoryId)) {
                item.active = true;
            }
        }

        if (this.favoritesId) {
            const favsCategory = { ...this.favoritesCategory };
            const findFavItem = (category: any) => {
                const foundItems: Array<TCategoricalItem> = [];
                if (category.hasSubcategory) {
                    category.data.forEach((subcategory: any) => {
                        const foundSubItems = findFavItem(subcategory);
                        foundItems.push(...foundSubItems);
                    });
                } else {
                    favsCategory.data.forEach(favItem => {
                        if (typeof favItem === 'string') {
                            const itemObj = category.data.find((item: TCategoricalItem) => item.itemId === favItem);
                            if (itemObj) {
                                foundItems.push(itemObj);
                            }
                        }
                    });
                }
                return foundItems;
            };

            const favsCategoryItem = favsCategory.data.filter(favItem => typeof favItem !== 'string');

            filteredItems.forEach((category: TCategory) => {
                const foundItems = findFavItem(category);
                favsCategoryItem.push(...foundItems);
            });

            favsCategory.data = favsCategoryItem.filter(favItem => favItem);
            filteredItems.unshift(favsCategory);
        }

        if (this.getActiveCategory) {
            const activeCategory = cloneCategory(this.getActiveCategory());
            filteredItems.unshift(activeCategory);
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
        const filterCategory = (c: TSubcategory) => {
            c.data = c.data.filter((item: TCategoricalItem) => 
                hasSearchString(item.display || (typeof item.dataObject === 'object' ? item.dataObject.symbol : ''))
            );
            if (c.data.length) {
                searchHasResult = true;
            }
        };

        for (const category of filteredItems) {
            category.active = true;
            if (category.hasSubcategory) {
                for (const subcategory of category.data) {
                    filterCategory(subcategory);
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

        // hits: 40px for title hight + 4px for content bottom border
        const categoryTitleHeight = 44;
        const scrollPanelTop = this.scrollPanel.getBoundingClientRect().top;
        let activeHeadTop = 0;
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
                const categorySwitchPoint = r.height + top - categoryTitleHeight;
                activeHeadTop = categorySwitchPoint < 0 ? categorySwitchPoint : 0;
            }
        }

        const scrollTop = this.scrollPanel.getBoundingClientRect().top;
        if (this.scrollTop && this.scrollTop > scrollTop) {
            this.scrollUp();
        } else {
            this.scrollDown();
        }

        const offsetTop = this.scrollPanel.getBoundingClientRect().top - window.scrollY;
        this.activeHeadOffset = this.chart.isMobile ? offsetTop : 0;
        this.scrollTop = scrollTop;
        this.focusedCategoryKey = activeMenuId || this.filteredItems[0].categoryId;
        this.activeHeadTop = activeHeadTop;
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

    @action.bound setScrollPanel(element: HTMLElement): void {
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

        this.activeHeadTop = null;
        setTimeout(() => this.updateScrollSpy(), 0);
    }

    @action.bound scrollToActiveSymbol(): void {
        const activeItemCount = this.getActiveCategory ? this.getActiveCategory().data.length : 0;
        this.focusedCategoryKey = null;
        this.activeCategoryKey = this.getCurrentActiveCategory ? this.getCurrentActiveCategory() : 'favorite';
        this.activeSubCategory = this.getCurrentActiveSubCategory ? this.getCurrentActiveSubCategory() : '';
        this.activeMarket = this.getCurrentActiveMarket ? this.getCurrentActiveMarket() : '';
        const el = this.categoryElements[this.activeCategoryKey];
        const activeSubCategoryClassName = `.sc-mcd__category--${this.activeCategoryKey}  .sc-mcd__category__content--${this.activeSubCategory}`;
        const el_active_sub_category: HTMLElement | null | undefined = this.scrollPanel?.querySelector(
            activeSubCategoryClassName
        );
        const activeMarketClassName = `${activeSubCategoryClassName} .sc-mcd__item--${this.activeMarket}`;
        const el_active_market: HTMLElement | null | undefined = this.scrollPanel?.querySelector(activeMarketClassName);

        this.activeHeadKey = this.activeCategoryKey || null;
        this.activeHeadTop = 0;
        this.pauseScrollSpy = true;
        this.isUserScrolling = false;

        if (this.scrollPanel) {
            if (activeItemCount) {
                this.activeCategoryKey = 'active';
                this.activeHeadKey = null;
                if (this.scrollPanel) this.scrollPanel.scrollTop = 0;
            } else if (el && this.scrollPanel) {
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
            if (this.categoryElements[last_category]) {
                this.categoryElements[last_category].style.minHeight = `${last_category_bottom_gap}px`;
            }
        }
    }

    connect = connect(() => ({
        filteredItems: this.filteredItems,
        updateScrollSpy: this.updateScrollSpy,
        setScrollPanel: this.setScrollPanel,
        isScrollingDown: this.isScrollingDown,
        handleTitleClick: this.handleTitleClick,
        scrollUp: this.scrollUp,
        scrollDown: this.scrollDown,
        onSelectItem: this.onSelectItem,
        ResultsPanel: this.ResultsPanel,
        FilterPanel: this.FilterPanel,
        SearchInput: this.SearchInput,
        setFilterText: this.setFilterText,
        height: this.height,
        isMobile: this.chart.isMobile,
    }));
}
