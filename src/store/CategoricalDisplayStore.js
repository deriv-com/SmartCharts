import { action, observable, computed, when, reaction } from 'mobx';
import { connect } from './Connect';
import IScroll from 'iscroll/build/iscroll-probe';

export default class CategoricalDisplayStore {
    constructor({ getCategoricalItems, onSelectItem, getIsShown, getActiveItems, activeOptions, placeholderText }) {
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
        this.getActiveItems = getActiveItems;
        this.activeOptions = activeOptions;
        this.placeholderText = placeholderText;
        this.categoryElements = {};

        this.isInit = false;
    }

    @observable filterText = '';
    @observable placeholderText = '';
    @observable activeCategoryKey = '';
    scrollOffset = 0;

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
        let filteredItems = JSON.parse(JSON.stringify(this.getCategoricalItems())); // Deep clone array

        if (this.getActiveItems) {
            const activeCategory = this.getActiveCategory(this.getActiveItems());
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

    getActiveCategory(actives) {
        const category = {
            categoryName: 'Active',
            categoryId: 'active',
            hasSubcategory: false,
            data: actives
        };
        return category;
    }

    connect = connect(() => ({
        filterText: this.filterText,
        setFilterText: this.setFilterText,
        filteredItems: this.filteredItems,
        getItemCount: this.getItemCount,
        setSearchInput: this.setSearchInput,
        handleFilterClick: this.handleFilterClick,
        onSelectItem: this.onSelectItem,
        hasActiveItems: (this.getActiveItems !== undefined),
        activeOptions: this.activeOptions,
        placeholderText: this.placeholderText,
        activeCategoryKey: this.activeCategoryKey,
        setScrollPanel: this.setScrollPanel,
        setCategoryElement: this.setCategoryElement,
    }))
}
