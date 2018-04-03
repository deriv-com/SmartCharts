import { action, observable, computed, when, reaction, toJS } from 'mobx';
import { connect } from './Connect';
import IScroll from 'iscroll/build/iscroll-probe';

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
                setTimeout(() => this.searchInput.focus(), 0);
                if (!this.isInit) {this.init();}
                setTimeout(() => {
                    this.scroll.refresh();
                    this.updateScrollOffset();
                }, 0);
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

        if (favoritesId && mainStore) {
            when(() => this.context, this.initFavorites.bind(this));
        }
    }

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
    scrollOffset = 0;

    get context() {
        return this.mainStore.chart.context;
    }

    initFavorites() {
        const layout = this.context.stx.layout;
        if (!layout.favorites) {layout.favorites = {};}
        if (!layout.favorites[this.favoritesId]) {layout.favorites[this.favoritesId] = [];}

        this.favoritesCategory.data = layout.favorites[this.favoritesId];
        for (const fav of this.favoritesCategory.data) {
            if (fav) {
                this.favoritesMap[(typeof fav === 'string' ? fav : fav.itemId)] = true;
            }
        }
    }

    updateScrollOffset() {
        this.scrollOffset = this.scrollPanel.getBoundingClientRect().top;
    }

    updateScrollSpy() {
        if (this.filteredItems.length === 0) {return;}

        let i = 0;
        for (const category of this.filteredItems) {
            const el = this.categoryElements[category.categoryId];
            if (!el) {
                i++;
                continue;
            }
            const r = el.getBoundingClientRect();
            const top = r.top - this.scrollOffset;
            if (top > 0) {break;}
            i++;
        }
        // get first non-empty category
        let idx = i - 1;
        let id;
        do {
            id = this.filteredItems[idx].categoryId;
            if (this.categoryElements[id] !== null) {
                break;
            }
            idx--;
        } while (idx >= 0);
        this.activeCategoryKey = id;
    }

    init() {
        this.isInit = true;
        this.scroll = new IScroll(this.scrollPanel, {
            probeType: 2,
            tap: true,
            click: true,
            mouseWheel: true,
            scrollbars: true,
        });

        this.scroll.on('scroll', this.updateScrollSpy.bind(this));

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

    @computed get filteredItems() {

        let filteredItems = toJS(this.getCategoricalItems()),
            items = (filteredItems && filteredItems[0]) ? filteredItems[0].data : [];

        if (this.favoritesId) {
            const favsCategory = toJS(this.favoritesCategory);
            let favsCategoryItem = favsCategory.data.filter( favItem => (typeof favItem !== 'string') );
            const findFavItem = category =>{
                if ( category.hasSubcategory ) {
                    category.data.forEach( subcategory => {
                        findFavItem(subcategory);
                    });
                }else{
                    favsCategory.data.forEach( favItem => {
                        if ( typeof favItem === 'string') {
                            let itemObj = category.data.find( item => item.itemId === favItem);
                            if (itemObj) {
                                favsCategoryItem.push(itemObj);
                            }
                        }
                    });
                }
            };

            filteredItems.forEach( category => {
                findFavItem(category);
            });

            favsCategory.data = favsCategoryItem.filter(favItem => favItem);
            filteredItems.unshift(favsCategory);
        }

        if (this.getActiveCategory) {
            const activeCategory = toJS(this.getActiveCategory());
            filteredItems.unshift(activeCategory);
        }

        if (this.filterText === '') {
            return filteredItems;
        }

        const reg = RegExp(this.filterText, 'i');
        const filterCategory = c => {
            c.data = c.data.filter(item => {
                return reg.test(item.display);
            });
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

        return filteredItems;
    }

    @action.bound setCategoryElement(element, id) {
        this.categoryElements[id] = element;
    }

    @action.bound setFilterText(filterText) {
        this.filterText = filterText;
        setTimeout(() => {
            this.scroll.refresh();
            this.updateScrollSpy();
        }, 0);
    }

    @action.bound handleFilterClick(category) {
        const el = this.categoryElements[category.categoryId];
        if (el) {
            this.activeCategoryKey = category.categoryId;
            this.scroll.scrollToElement(el, 200);
        }
    }

    @action.bound setSearchInput(element) {
        this.searchInput = element;
    }

    @action.bound setScrollPanel(element) {
        this.scrollPanel = element;
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

    // In case where text input is inside chartContainer, it will not
    // respond to mouse interaction. This is why we need to manually focus
    // when user clicks on it.
    @action.bound handleInputClick() {
        this.searchInput.focus();
    }

    @action.bound onFavoritedItem(item, e) {
        e.stopPropagation();
        e.nativeEvent.isHandledByDialog = true; // prevent close dialog
        this.setFavorite(item);
        setTimeout(() => this.scroll.refresh(), 0);
    }
    setFavorite(item) {
        if (this.favoritesMap[item.itemId]) {
            this.favoritesCategory.data = this.favoritesCategory.data.filter(favItem => favItem && favItem.itemId !== item.itemId && favItem !== item.itemId);
            delete this.favoritesMap[item.itemId];
        } else {
            this.favoritesCategory.data.push(item);
            this.favoritesMap[item.itemId] = true;
        }

        const layout = this.context.stx.layout;
        layout.favorites[this.favoritesId] = toJS(this.favoritesCategory.data).filter(favItem => favItem).map( favItem => typeof favItem === 'string' ? favItem : favItem.itemId);
        this.mainStore.chart.saveLayout();
    }

    setFavoriteById(id) {
        let foundItem = null;
        for(let category of this.getCategoricalItems()) {
            for(let item of category.data) {
                if(item.itemId === id) {
                    foundItem = item;
                    break;
                }
            }
            if(foundItem) { break; }
        }
        if(foundItem) {
            this.setFavorite(foundItem);
        }
    }

    connect = connect(() => ({
        filterText: this.filterText,
        setFilterText: this.setFilterText,
        filteredItems: this.filteredItems,
        getItemCount: this.getItemCount,
        setSearchInput: this.setSearchInput,
        handleFilterClick: this.handleFilterClick,
        onSelectItem: this.onSelectItem,
        handleInputClick: this.handleInputClick,
        hasActiveItems: (this.getActiveCategory !== undefined),
        activeOptions: this.activeOptions,
        placeholderText: this.placeholderText,
        activeCategoryKey: this.activeCategoryKey,
        setScrollPanel: this.setScrollPanel,
        setCategoryElement: this.setCategoryElement,
        onFavoritedItem: this.onFavoritedItem,
        favoritesMap: this.favoritesMap,
        favoritesId: this.favoritesId,
    }))
}
