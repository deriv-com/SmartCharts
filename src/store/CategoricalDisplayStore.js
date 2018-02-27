import { action, observable, computed, when, reaction } from 'mobx';
import { connect } from './Connect';

export default class CategoricalDisplayStore {
    constructor({ getCategoricalItems, onSelectItem, getIsShown }) {
        reaction(getIsShown, () => {
            if (getIsShown) this.searchInput.focus();
        });
        this.getCategoricalItems = getCategoricalItems;
        this.onSelectItem = onSelectItem;
    }

    @observable filterText = '';
    @observable activeItems;
    @observable placeholderText = '';

    @computed get filteredItems() {
        let filteredItems = JSON.parse(JSON.stringify(this.getCategoricalItems())); // Deep clone array

        if (this.activeItems) {
            const activeCategory = this.getActiveCategory(this.activeItems);
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

    @action.bound setFilterText(filterText) {
        this.filterText = filterText;
    }

    @action.bound handleFilterClick(category) {
        const element = this.resultsPanel.querySelector(`.category-${category.categoryId}`);
        if (element) element.scrollIntoView();
    }

    @action.bound setSearchInput(element) {
        this.searchInput = element;
    }

    @action.bound setResultsPanel(element) {
        this.resultsPanel = element;
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

    @action.bound handleInputClick() {
        this.searchInput.focus();
    }

    getActiveCategory(actives) {
        const category =  {
            categoryName: 'Active',
            categoryId: 'active',
            hasSubcategory: false,
            data: []
        };
        for (const symbol of actives) {
            category.data.push({
                enabled: true,
                selected: false,
                display: symbol.symbolObject.name,
                symbolObj: symbol.symbolObject
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
        onSelectItem: this.onSelectItem
    }))
}
