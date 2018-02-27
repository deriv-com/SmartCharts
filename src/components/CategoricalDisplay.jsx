import React, { Component, Fragment } from 'react';
import { connect } from '../store/Connect';

class CategoricalDisplay extends Component {
    constructor() {
        super();
        this.state = {
            filterText: '',
            filteredItems: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.categorizedItems !== nextProps.categorizedItems) {
            this.filterItems(nextProps.categorizedItems);
        }

        if (this.props.activeItems !== nextProps.activeItems) {
            this.filterItems(this.props.categorizedItems, nextProps.activeItems);
        }

        if (this.props.isShown !== nextProps.isShown) {
            if (nextProps.isShown) {
                this.searchInput.focus();
            }
        }
    }

    getActiveCategory(actives) {
        const result = [];
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

    filterItems(categorizedItems = this.props.categorizedItems, activeItems = this.props.activeItems) {
        const { filterText } = this.state;
        let filteredItems = JSON.parse(JSON.stringify(categorizedItems)); // Deep clone array

        if (activeItems) {
            const activeCategory = this.getActiveCategory(activeItems);
            filteredItems.unshift(activeCategory);
        }

        if (filterText === '') {
            this.setState({ filteredItems });
            return;
        }

        const reg = RegExp(filterText, 'i');
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

        this.setState({ filteredItems });
    }

    setFilterText(filterText) {
        this.setState({ filterText }, () => {
            this.filterItems();
        });
    }

    getItemCount = (category) => {
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

    handleFilterClick = (category) => {
        const element = this.resultsPanel.querySelector(`.category-${category.categoryId}`);
        if (element) element.scrollIntoView();
    }

    renderItem = (item, k) => <div className={`cq-item ${item.selected ? 'selected ' : ''}`} onClick={() => this.props.onSelectItem(item.symbolObj)} key={k} disabled={!item.enabled}>{item.display}</div>
    renderActiveItem = (item, k) => <div className="cq-active-item" key={k}>{item.display}</div>

    handleFilterTextChange = (event) => this.setFilterText(event.target.value);

    render() {
        const { placeholderText, activeItems } = this.props;
        const { filteredItems } = this.state;

        return (
            <div className="cq-categorical-display">
                <div className="cq-lookup-filters">
                    <div className="cq-lookup-input">
                        <input
                            ref={(input) => { this.searchInput = input; }}
                            onClick={() => this.searchInput.focus()}
                            onChange={this.handleFilterTextChange}
                            type="text"
                            spellCheck="off"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            placeholder={placeholderText}
                        />
                    </div>
                    { filteredItems.map((category, i) =>
                        <div key={i}
                            className="cq-filter"
                            onClick={() => this.handleFilterClick(category)}
                        >
                            {category.categoryName}
                        </div>
                    )}
                </div>
                <cq-scroll>
                    <div className="results-panel" ref={el => this.resultsPanel = el}>
                        { filteredItems.map((category, i) =>
                            this.getItemCount(category) > 0 &&
                            <Fragment key={i}>
                                <div className={`category-title category-${category.categoryId}`}>{category.categoryName}</div>
                                <div className="category">
                                    { category.hasSubcategory ? category.data.map((subcategory, j) =>
                                        this.getItemCount(subcategory) > 0 &&
                                        <Fragment key={j}>
                                            <div className="subcategory">{subcategory.subcategoryName}</div>
                                            { subcategory.data.map(this.renderItem)}
                                        </Fragment>
                                    ) : category.data.map((i === 0 && activeItems) ? this.renderActiveItem : this.renderItem)
                                    }
                                </div>
                            </Fragment>
                        ) }
                    </div>
                </cq-scroll>
            </div>
        );
    }
}

export default CategoricalDisplay;
