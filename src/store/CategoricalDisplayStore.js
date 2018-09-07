import { action, observable, computed, when, reaction, toJS } from 'mobx';
import { connect } from './Connect';
import { cloneCategories, cloneCategory } from '../utils';

export default class CategoricalDisplayStore {
    constructor({
        getCategoricalItems,
        onSelectItem,
        getIsShown,
        getActiveCategory,
        activeOptions,
        placeholderText,
        favoritesId,
        mainStore,
    }) {
        reaction(getIsShown, () => {
            if (getIsShown()) {
                // Odd. Why is setTimeout needed here?
                if (!this.isMobile) {
                    setTimeout(() => this.searchInput.focus(), 0);
                }
                if (!this.isInit) { this.init(); }
            }
        });
        this.getCategoricalItems = getCategoricalItems;
        this.onSelectItem = onSelectItem;
        this.getActiveCategory = getActiveCategory;
        this.activeOptions = activeOptions;
        this.placeholderText = placeholderText;
        this.favoritesId = favoritesId;
        this.categoryElements = {};
        this.mainStore = mainStore;
        this.isInit = false;
        reaction(
            () => this.mainStore.favoriteSessionStore.favoritesChangeTrigger,
            () => { this.updateFavorites(); },
        );

        if (favoritesId && mainStore) {
            when(() => this.context, this.initFavorites.bind(this));
        }
    }
    @observable scrollPanel;
    @observable filterText = '';
    @observable placeholderText = '';
    @observable activeCategoryKey = '';
    @observable favoritesMap = {};
    @observable favoritesCategory = {
        categoryName: t.translate('Favorites'),
        categoryId: 'favorite',
        hasSubcategory: false,
        emptyDescription: t.translate('There are no favorites yet.'),
        data: [],
    };
    @observable isScrollingDown = false;
    scrollTop = undefined;
    isUserScrolling = true;
    lastFilteredItems = [];

    get context() {
        return this.mainStore.chart.context;
    }

    initFavorites() {
        const layout = this.context.stx.layout;
        if (!layout.favorites) { layout.favorites = {}; }
        if (!layout.favorites[this.favoritesId]) { layout.favorites[this.favoritesId] = []; }

        this.favoritesCategory.data = layout.favorites[this.favoritesId];
        for (const fav of this.favoritesCategory.data) {
            if (fav) {
                this.favoritesMap[(typeof fav === 'string' ? fav : fav.itemId)] = true;
            }
        }
    }

    updateFavorites() {
        this.favoritesMap = {};
        this.initFavorites();
    }

    @action.bound updateScrollSpy() {
        if (this.pauseScrollSpy || !this.scrollPanel) { return; }
        if (this.filteredItems.length === 0) { return; }

        const ActiveViewHeight = this.scrollPanel.clientHeight * 1 / 5;
        let activeMenuId = null;

        for (const category of this.filteredItems) {
            const el = this.categoryElements[category.categoryId];
            const r = el.getBoundingClientRect();
            const top = r.top - this.scrollPanel.getBoundingClientRect().top;
            if (top < ActiveViewHeight) {
                activeMenuId = category.categoryId;
            }
        }

        this.activeCategoryKey = activeMenuId || this.filteredItems[0].categoryId;
        this.scrollTop = this.scrollPanel.scrollTop;
    }

    @action.bound scrollUp() {
        this.isScrollingDown = false;
    }

    @action.bound scrollDown() {
        // This only affects when scrolling by mouse not by code
        this.isScrollingDown = this.isUserScrolling;
        this.isUserScrolling = true;
    }

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

    /* isMobile: fill form the ChartStore */
    @computed get isMobile() {
        if (this.mainStore) {
            return this.mainStore.chart.isMobile;
        }
        return false;
    }


    @computed get filteredItems() {
        let filteredItems = cloneCategories(this.getCategoricalItems());

        if (this.favoritesId) {
            const favsCategory = { ...this.favoritesCategory };
            const findFavItem = (category) => {
                const foundItems = [];
                if (category.hasSubcategory) {
                    category.data.forEach((subcategory) => {
                        const foundSubItems = findFavItem(subcategory);
                        foundItems.push(...foundSubItems);
                    });
                } else {
                    favsCategory.data.forEach((favItem) => {
                        if (typeof favItem === 'string') {
                            const itemObj = category.data.find(item => item.itemId === favItem);
                            if (itemObj) {
                                foundItems.push(itemObj);
                            }
                        }
                    });
                }
                return foundItems;
            };

            const favsCategoryItem = favsCategory.data
                .filter(favItem => (typeof favItem !== 'string'));

            filteredItems.forEach((category) => {
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
        const queries = this.filterText.split(' ').filter(x => x !== '').map(b => b.toLowerCase().trim());
        // regex to check all separate words by comma, should exist in the string
        const hasSearchString = text => queries.reduce((a, b) => text.toLowerCase().includes(b) && a, true);
        const filterCategory = (c) => {
            c.data = c.data.filter(item => hasSearchString(item.display || (typeof item.dataObject === 'object' && item.dataObject.symbol)));
            if (c.data.length) { searchHasResult = true; }
        };

        for (const category of filteredItems) {
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

        this.lastFilteredItems = filteredItems;
        return filteredItems;
    }

    @action.bound setCategoryElement(element, id) {
        this.categoryElements[id] = element;
    }

    @action.bound setFilterText(filterText) {
        this.filterText = filterText;
        this.isUserScrolling = false;
        setTimeout(() => {
            this.updateScrollSpy();
        }, 0);
    }

    @action.bound clearFilterText() {
        this.setFilterText('');
        this.searchInput.value = '';
    }

    @action.bound handleFilterClick(category) {
        const el = this.categoryElements[category.categoryId];

        if (el) {
            // TODO: Scroll animation
            this.pauseScrollSpy = true;
            this.isUserScrolling = false;
            this.scrollPanel.scrollTop = el.offsetTop;
            this.activeCategoryKey = category.categoryId;
            // scrollTop takes some time to take affect, so we need
            // a slight delay before enabling the scroll spy again
            setTimeout(() => { this.pauseScrollSpy = false; }, 3);
        }
    }

    @action.bound setSearchInput(element) {
        this.searchInput = element;
    }

    @action.bound setScrollPanel(element) {
        this.scrollPanel = element ? element._container : null;
    }

    @action.bound getItemCount(category) {
        let count = 0;
        if (category.hasSubcategory) {
            for (const sub of category.data) {
                count += sub.data.length;
            }
        } else {
            count += category.data.length;
        }

        return count;
    }

    @action.bound onFavoritedItem(item, e) {
        e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true; // prevent close dialog
        this.setFavorite(item);
    }
    setFavorite(item) {
        if (this.favoritesMap[item.itemId]) {
            this.favoritesCategory.data = this.favoritesCategory.data
                .filter(favItem => favItem && favItem.itemId !== item.itemId && favItem !== item.itemId);

            delete this.favoritesMap[item.itemId];
        } else {
            this.favoritesCategory.data.push(item);
            this.favoritesMap[item.itemId] = true;
        }

        const layout = this.context.stx.layout;
        layout.favorites[this.favoritesId] = toJS(this.favoritesCategory.data)
            .filter(favItem => favItem)
            .map(favItem => (typeof favItem === 'string' ? favItem : favItem.itemId));
        this.mainStore.favoriteSessionStore.favoritesChangeTrigger = !this.mainStore.favoriteSessionStore.favoritesChangeTrigger;
        this.mainStore.state.saveLayout();
    }

    setFavoriteById(id) {
        let foundItem = null;
        for (const category of this.getCategoricalItems()) {
            for (const item of category.data) {
                if (item.itemId === id) {
                    foundItem = item;
                    break;
                }
            }
            if (foundItem) { break; }
        }
        if (foundItem) {
            this.setFavorite(foundItem);
        }
    }

    connect = connect(() => ({
        isMobile: this.isMobile,
        filterText: this.filterText,
        setFilterText: this.setFilterText,
        clearFilterText: this.clearFilterText,
        filteredItems: this.filteredItems,
        getItemCount: this.getItemCount,
        setSearchInput: this.setSearchInput,
        handleFilterClick: this.handleFilterClick,
        onSelectItem: this.onSelectItem,
        hasActiveItems: (this.getActiveCategory !== undefined),
        activeOptions: this.activeOptions,
        placeholderText: this.placeholderText,
        activeCategoryKey: this.activeCategoryKey,
        setScrollPanel: this.setScrollPanel,
        setCategoryElement: this.setCategoryElement,
        onFavoritedItem: this.onFavoritedItem,
        favoritesMap: this.favoritesMap,
        favoritesId: this.favoritesId,
        CloseUpperMenu: this.CloseUpperMenu,
        isScrollingDown: this.isScrollingDown,
        updateScrollSpy: this.updateScrollSpy,
        scrollUp: this.scrollUp,
        scrollDown: this.scrollDown,
    }))
}
