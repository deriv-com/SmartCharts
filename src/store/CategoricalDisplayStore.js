import { action, observable, computed, when, reaction } from 'mobx';
import { connect } from './Connect';
import IScroll from 'iscroll';

export default class CategoricalDisplayStore {
    constructor({ getCategoricalItems, onSelectItem, getIsShown, getActiveItems, activeOptions, placeholderText }) {
        reaction(getIsShown, () => {
            if (getIsShown()) {
                // Odd. Why is setTimeout needed here?
                setTimeout(() =>  this.searchInput.focus(), 0);
                if (!this.isInit) {this.init();}
                setTimeout(() => this.scroll.refresh(), 0);
            }
        });
        this.getCategoricalItems = getCategoricalItems;
        this.onSelectItem = onSelectItem;
        this.getActiveItems = getActiveItems;
        this.activeOptions = activeOptions;
        this.placeholderText = placeholderText;

        this.isInit = false;
    }

    @observable filterText = '';
    @observable placeholderText = '';

    init() {
        this.isInit = true;
        this.scroll = new IScroll(this.scrollPanel, {
            mouseWheel: true,
            scrollbars: true,
        });
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

        setTimeout(() => this.scroll.refresh(), 0);
        return filteredItems;
    }

    @action.bound setFilterText(filterText) {
        this.filterText = filterText;
    }

    @action.bound handleFilterClick(category) {
        const element = this.resultsPanel.querySelector(`.category-${category.categoryId}`);
        if (element) {element.scrollIntoView();}
    }

    @action.bound setSearchInput(element) {
        this.searchInput = element;
    }

    @action.bound setResultsPanel(element) {
        this.resultsPanel = element;
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

    // TODO: we shouldn't need to do this after we shift this out of ChartContainer
    @action.bound handleInputClick() {
        this.searchInput.focus();
    }

    getActiveCategory(actives) {
        const category = {
            categoryName: 'Active',
            categoryId: 'active',
            hasSubcategory: false,
            data: []
        };
        for (const item of actives) {
            category.data.push({
                enabled: true,
                selected: false,
                display: item.symbolObject.name,
                itemId: item.symbolObject.symbol,
                symbolObj: item.symbolObject
            });
        }
        return category;
    }

    connect = connect(() => ({
        filterText: this.filterText,
        setFilterText: this.setFilterText,
        filteredItems: this.filteredItems,
        getItemCount: this.getItemCount,
        setSearchInput: this.setSearchInput,
        setResultsPanel: this.setResultsPanel,
        handleFilterClick: this.handleFilterClick,
        handleInputClick: this.handleInputClick,
        onSelectItem: this.onSelectItem,
        hasActiveItems: (this.getActiveItems !== undefined),
        activeOptions: this.activeOptions,
        placeholderText: this.placeholderText,
        scrollId: this.scrollId,
        init: this.init,
        setScrollPanel: this.setScrollPanel,
    }))
}
