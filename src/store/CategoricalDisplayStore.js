import { action, observable, computed, when, reaction, toJS } from 'mobx';
import { connect } from './Connect';
import { cloneCategories, cloneCategory, createObjectFromLocalStorage } from '../utils';

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
            const isShown = getIsShown();
            if (isShown) {
                // deferred the rendering until user opens the dropdown
                // setTimeout is required, otherwise it will block the render
                setTimeout(action(() => { this.isShown = isShown; }), 0);
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
    @observable isShown = false;
    @observable scrollPanel;
    @observable filterText = '';
    @observable placeholderText = '';
    @observable activeCategoryKey = '';
    @observable static favoritesMap = {};
    @observable isScrollingDown = false;
    scrollTop = undefined;
    isUserScrolling = true;
    lastFilteredItems = [];

    get context() {
        return this.mainStore.chart.context;
    }

    isFavExist(favItem) {
        const favs = CategoricalDisplayStore.favoritesMap[this.favoritesId];
        return favs.length > 0 && favs.some(fav => Object.keys(fav).indexOf(favItem) > -1);
    }

    initFavorites() {
        const favorites = (createObjectFromLocalStorage('cq-favorites') || {})[this.favoritesId] || [];
        if (!CategoricalDisplayStore.favoritesMap[this.favoritesId]) {
            CategoricalDisplayStore.favoritesMap[this.favoritesId] = [];
        }
        for (const fav of favorites) {
            const favItem = fav && (typeof fav === 'string' ? fav : fav.itemId);
            const isExist = this.isFavExist(favItem);
            if (favItem && !isExist) {
                CategoricalDisplayStore.favoritesMap[this.favoritesId].push({ [favItem]: true });
            }
        }
    }

    saveFavorites() {
        // Read favorites for all CategoricalDisplay instances from localstorage
        const favorites = createObjectFromLocalStorage('cq-favorites') || {};

        // Replace the changes for current instance of CategoricalDisplay
        favorites[this.favoritesId] = toJS(CategoricalDisplayStore.favoritesMap[this.favoritesId])
            .map(key =>  Object.keys(key)[0]) || [];

        CIQ.localStorageSetItem('cq-favorites', JSON.stringify(favorites));
    }

    updateFavorites() {
        CategoricalDisplayStore.favoritesMap[this.favoritesId]  = [];
        this.initFavorites();
    }

    @action.bound updateScrollSpy() {
        if (this.pauseScrollSpy || !this.scrollPanel) { return; }
        if (this.filteredItems.length === 0) { return; }


        let i = 0;
        for (const category of this.filteredItems) {
            const el = this.categoryElements[category.categoryId];
            if (!el) {
                i++;
                continue;
            }
            const r = el.getBoundingClientRect();
            const top = r.top - this.scrollPanel.getBoundingClientRect().top;
            if (top > 0) { break; }
            i++;
        }

        // get first non-empty category
        let idx = i - 1;
        let id;
        while (idx >= 0) {
            id = this.filteredItems[idx].categoryId;
            if (this.categoryElements[id] !== null) {
                break;
            }
            idx--;
        }

        this.activeCategoryKey = id || this.filteredItems[0].categoryId;
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

    @computed get favoritesCategory()  {
        const favoritesCategory = {
            categoryName: t.translate('Favorites'),
            categoryId: 'favorite',
            hasSubcategory: false,
            emptyDescription: t.translate('There are no favorites yet.'),
            data: toJS(CategoricalDisplayStore.favoritesMap[this.favoritesId]).map(key =>  Object.keys(key)[0]) || [],
        };
        return favoritesCategory;
    }

    /* isMobile: fill form the ChartStore */
    @computed get isMobile() {
        if (this.mainStore) {
            return this.mainStore.chart.isMobile;
        }
        return false;
    }

    @computed get filteredItems() {
        if (!this.isShown) { return []; }

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
        const isExist = this.isFavExist(item.itemId);
        if (isExist) {
            CategoricalDisplayStore.favoritesMap[this.favoritesId] = CategoricalDisplayStore.favoritesMap[this.favoritesId].filter(x => Object.keys(x)[0] !== item.itemId);
        } else {
            CategoricalDisplayStore.favoritesMap[this.favoritesId].push({ [item.itemId] : true });
        }
        this.mainStore.favoriteSessionStore.favoritesChangeTrigger = !this.mainStore.favoriteSessionStore.favoritesChangeTrigger;
        this.saveFavorites();
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
        favoritesId: this.favoritesId,
        CloseUpperMenu: this.CloseUpperMenu,
        isScrollingDown: this.isScrollingDown,
        updateScrollSpy: this.updateScrollSpy,
        scrollUp: this.scrollUp,
        scrollDown: this.scrollDown,
        isFavExist: this.isFavExist.bind(this),
    }))
}
