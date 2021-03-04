// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { action, observable, computed, reaction } from 'mobx';
import { connect } from './Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../components/SearchInput.jsx' was resolve... Remove this comment to see the full error message
import SearchInput from '../components/SearchInput.jsx';
import { NormalItem, ActiveItem, ResultsPanel, FilterPanel } from '../components/categoricaldisplay';
import { cloneCategories, cloneCategory } from '../utils';

export default class CategoricalDisplayStore {
    FilterPanel: any;
    ResultsPanel: any;
    SearchInput: any;
    activeMarket: any;
    activeSubCategory: any;
    categoryElements: any;
    favoritesId: any;
    getActiveCategory: any;
    getCategoricalItems: any;
    getCurrentActiveCategory: any;
    getCurrentActiveMarket: any;
    getCurrentActiveSubCategory: any;
    id: any;
    isInit: any;
    mainStore: any;
    onSelectItem: any;
    pauseScrollSpy: any;
    searchInput: any;
    searchInputClassName: any;
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
    }: any) {
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

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        const normalItem = connect(() => ({
            favoritesId,
        }))(NormalItem);

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        const activeItem = connect(() => ({
            activeOptions,
            favoritesId,
        }))(ActiveItem);

        const getItemType = (categoryId: any) => {
            if (categoryId === 'active' && this.getActiveCategory !== undefined) {
                return activeItem;
            }

            return normalItem;
        };

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        this.ResultsPanel = connect(() => ({
            filteredItems: this.filteredItems,
            setCategoryElement: this.setCategoryElement,
            getItemType,
            activeHeadTop: this.activeHeadTop,
            activeHeadKey: this.activeHeadKey,
            activeHeadOffset: this.activeHeadOffset,
            handleTitleClick: this.handleTitleClick,
        }))(ResultsPanel);

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        this.FilterPanel = connect(({
            chart,
        }: any) => ({
            isMobile: chart.isMobile,
            filteredItems: this.filteredItems,
            handleFilterClick: this.handleFilterClick,
            activeCategoryKey: this.activeCategoryKey,
            focusedCategoryKey: this.focusedCategoryKey,
            isSearching: this.filterText !== '',
        }))(FilterPanel);

        // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
        this.SearchInput = connect(() => ({
            placeholder: placeholderText,
            value: this.filterText,
            onChange: this.setFilterText,
            searchInput: this.searchInput,
            searchInputClassName: this.searchInputClassName,
        }))(SearchInput);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isShown = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable scrollPanel;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable filterText = '';
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable activeCategoryKey = '';
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable focusedCategoryKey = null;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable isScrollingDown = false;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable activeHeadKey = undefined;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable activeHeadTop = 0;
    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @observable activeHeadOffset = undefined;
    scrollTop = undefined;
    isUserScrolling = true;
    lastFilteredItems = [];
    activeCategories = [];

    get chart() {
        return this.mainStore.chart;
    }

    get context() {
        return this.chart.context;
    }

    get height() {
        return this.chart.chartContainerHeight - (this.chart.isMobile ? 0 : 120);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound init() {
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

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get favoritesCategory() {
        this.pauseScrollSpy = true;
        const favoritesCategory = {
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            categoryName: t.translate('Favorites'),
            categoryId: 'favorite',
            hasSubcategory: false,
            active: true,
            // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
            emptyDescription: t.translate('There are no favorites yet.'),
            data: Object.keys(this.mainStore.favorites.favoritesMap[this.favoritesId]) || [],
        };
        setTimeout(() => {
            this.pauseScrollSpy = false;
        }, 20);
        return favoritesCategory;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @computed get filteredItems() {
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
                const foundItems: any = [];
                if (category.hasSubcategory) {
                    category.data.forEach((subcategory: any) => {
                        const foundSubItems = findFavItem(subcategory);
                        foundItems.push(...foundSubItems);
                    });
                } else {
                    favsCategory.data.forEach(favItem => {
                        if (typeof favItem === 'string') {
                            const itemObj = category.data.find((item: any) => item.itemId === favItem);
                            if (itemObj) {
                                foundItems.push(itemObj);
                            }
                        }
                    });
                }
                return foundItems;
            };

            const favsCategoryItem = favsCategory.data.filter(favItem => typeof favItem !== 'string');

            filteredItems.forEach(category => {
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
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'never[]'.
            this.lastFilteredItems = filteredItems;
            return filteredItems;
        }

        let searchHasResult = false;
        const queries = this.filterText
            .split(' ')
            .filter(x => x !== '')
            .map(b => b.toLowerCase().trim());
        // regex to check all separate words by comma, should exist in the string
        const hasSearchString = (text: any) => queries.reduce((a, b) => text.toLowerCase().includes(b) && a, true);
        const filterCategory = (c: any) => {
            c.data = c.data.filter((item: any) => hasSearchString(item.display || (typeof item.dataObject === 'object' && item.dataObject.symbol))
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
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'any[]' is not assignable to type 'never[]'.
            this.lastFilteredItems = filteredItems;
        }
        return filteredItems;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound updateScrollSpy() {
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
            const gap_top = Object.keys(this.categoryElements).indexOf(category.categoryId) * 40;

            const r = el.getBoundingClientRect();
            const top = r.top - scrollPanelTop - gap_top;
            if (top < 0) {
                activeMenuId = category.categoryId;
                const categorySwitchPoint = r.height + top - categoryTitleHeight;
                activeHeadTop = categorySwitchPoint < 0 ? categorySwitchPoint : 0;
            }
        }

        const scrollTop = this.scrollPanel.getBoundingClientRect().top;
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        if (this.scrollTop > scrollTop) {
            this.scrollUp();
        } else {
            this.scrollDown();
        }

        const offsetTop = this.scrollPanel.getBoundingClientRect().top - window.scrollY;
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'number' is not assignable to type 'undefined... Remove this comment to see the full error message
        this.activeHeadOffset = this.chart.isMobile ? offsetTop : 0;
        this.scrollTop = scrollTop;
        this.focusedCategoryKey = activeMenuId || this.filteredItems[0].categoryId;
        this.activeHeadTop = activeHeadTop;
        // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'undefined'.
        this.activeHeadKey = this.scrollTop === 0 ? null : this.focusedCategoryKey;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound scrollUp() {
        this.isScrollingDown = false;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound scrollDown() {
        // This only affects when scrolling by mouse not by code
        this.isScrollingDown = this.isUserScrolling;
        this.isUserScrolling = true;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setCategoryElement(element: any, id: any) {
        this.categoryElements[id] = element;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setFilterText(filterText: any) {
        this.filterText = filterText;
        this.isUserScrolling = false;
        this.updateScrollSpy();
        if (filterText === '') {
            setTimeout(() => this.scrollToActiveSymbol(), 1);
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound handleFilterClick(categoryId: any) {
        const el = this.categoryElements[categoryId];
        const gap_top = Object.keys(this.categoryElements).indexOf(categoryId) * 40;

        if (el) {
            // TODO: Scroll animation
            this.pauseScrollSpy = true;
            this.isUserScrolling = false;
            if (this.chart.isMobile) {
                this.scrollPanel.scroll({
                    top: el.offsetTop - 95,
                    left: 0,
                    behavior: 'smooth',
                });
            } else {
                this.scrollPanel.scrollTop = el.offsetTop - gap_top;
            }
            this.focusedCategoryKey = categoryId;
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'undefined'.
            this.activeHeadKey = null;
            // scrollTop takes some time to take affect, so we need
            // a slight delay before enabling the scroll spy again
            setTimeout(() => {
                this.pauseScrollSpy = false;
            }, 20);
        }
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound setScrollPanel(element: any) {
        this.scrollPanel = element;
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound handleTitleClick(categoryId: any) {
        this.activeCategories = [];
        for (const item of this.filteredItems) {
            if (item.categoryId === categoryId) {
                item.active = !item.active;

                if (item.active) {
                    setTimeout(() => this.handleFilterClick(categoryId), 250);
                }
            }

            if (item.active && item.categoryId !== 'favorite') {
                // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'any' is not assignable to parame... Remove this comment to see the full error message
                this.activeCategories.push(item.categoryId);
            }
        }

        // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'number'.
        this.activeHeadTop = null;
        setTimeout(() => this.updateScrollSpy(), 0);
    }

    // @ts-expect-error ts-migrate(1219) FIXME: Experimental support for decorators is a feature t... Remove this comment to see the full error message
    @action.bound scrollToActiveSymbol() {
        const activeItemCount = this.getActiveCategory ? this.getActiveCategory().data.length : 0;
        this.focusedCategoryKey = null;
        this.activeCategoryKey = this.getCurrentActiveCategory ? this.getCurrentActiveCategory() : 'favorite';
        this.activeSubCategory = this.getCurrentActiveSubCategory ? this.getCurrentActiveSubCategory() : '';
        this.activeMarket = this.getCurrentActiveMarket ? this.getCurrentActiveMarket() : '';
        const el = this.categoryElements[this.activeCategoryKey];
        const activeSubCategoryClassName = `.sc-mcd__category--${this.activeCategoryKey}  .sc-mcd__category__content--${this.activeSubCategory}`;
        const el_active_sub_category = this.scrollPanel.querySelector(activeSubCategoryClassName);

        const activeMarketClassName = `${activeSubCategoryClassName} .sc-mcd__item--${this.activeMarket}`;
        const el_active_market = this.scrollPanel.querySelector(activeMarketClassName);

        // @ts-expect-error ts-migrate(2322) FIXME: Type 'string | null' is not assignable to type 'un... Remove this comment to see the full error message
        this.activeHeadKey = this.activeCategoryKey || null;
        this.activeHeadTop = 0;
        this.pauseScrollSpy = true;
        this.isUserScrolling = false;

        if (activeItemCount) {
            this.activeCategoryKey = 'active';
            // @ts-expect-error ts-migrate(2322) FIXME: Type 'null' is not assignable to type 'undefined'.
            this.activeHeadKey = null;
            this.scrollPanel.scrollTop = 0;
        } else if (el) {
            this.scrollPanel.scrollTop = el.offsetTop;
            if (el_active_market) {
                const topOffset = this.mainStore.chart.isMobile ? 100 : 40;
                this.scrollPanel.scrollTop = el.offsetTop + el_active_market.offsetTop - topOffset;
            } else if (el_active_sub_category) {
                const topOffset = this.mainStore.chart.isMobile ? 100 : 0;
                this.scrollPanel.scrollTop = el.offsetTop + el_active_sub_category.offsetTop - topOffset;
            }
        }
        setTimeout(() => {
            this.pauseScrollSpy = false;
        }, 20);

        if (!this.isInit) {
            this.init();
        }
        if (!this.mainStore.chart.isMobile) {
            setTimeout(() => this.searchInput.current.focus(), 0);
        }

        if (!this.mainStore.chart.isMobile) {
            const categories = Object.keys(this.categoryElements);
            const last_category = categories.pop();
            const last_category_bottom_gap = this.height - (64 + categories.length * 40); // to make the last category height reach it's filter tab
            // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
            if (this.categoryElements[last_category]) {
                // @ts-expect-error ts-migrate(2538) FIXME: Type 'undefined' cannot be used as an index type.
                this.categoryElements[last_category].style.minHeight = `${last_category_bottom_gap}px`;
            }
        }
    }

    // @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
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
