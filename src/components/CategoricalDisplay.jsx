import React, { Component, Fragment } from 'react';

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

        if (this.props.isShown !== nextProps.isShown) {
            if (nextProps.isShown) {
                this.searchInput.focus();
            }
        }
    }

    filterItems(categorizedItems = this.props.categorizedItems) {
        const { filterText } = this.state;
        if (filterText === '') {
            this.setState({ filteredItems: categorizedItems });
            return;
        }

        const reg = RegExp(filterText, 'i');
        const filterCategory = c => {
            c.data = c.data.filter(item => {
                return reg.test(item.display);
            });
        };
        let filteredItems = JSON.parse(JSON.stringify(categorizedItems)); // Deep clone array
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
        const element = document.getElementById(`category-${category.categoryId}`);
        if (element) element.scrollIntoView();
    }

    renderItem = (item, k) => <div className={`cq-item ${item.selected ? 'selected ' : ''}`} onClick={() => this.props.onSelectItem(item.symbolObj)} key={k} disabled={!item.enabled}>{item.display}</div>

    handleFilterTextChange = (event) => this.setFilterText(event.target.value);

    render() {
        const { placeholderText } = this.props;
        const { filteredItems } = this.state;

        return (
            <Fragment>
                <div className="cq-lookup-filters">
                    <div className="cq-lookup-input">
                        <input
                            ref={(input) => { this.searchInput = input; }}
                            onClick={() => this.searchInput.focus()}
                            onChange={this.handleFilterTextChange}
                            cq-focus=""
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
                    <div className="results-panel">
                        { filteredItems.map((category, i) =>
                            this.getItemCount(category) > 0 &&
                            <Fragment key={i}>
                                <div className="category-title" id={`category-${category.categoryId}`}>{category.categoryName}</div>
                                <div className="category">
                                    { category.hasSubcategory ? category.data.map((subcategory, j) =>
                                        this.getItemCount(subcategory) > 0 &&
                                        <Fragment key={j}>
                                            <div className="subcategory">{subcategory.subcategoryName}</div>
                                            { subcategory.data.map(this.renderItem)}
                                        </Fragment>
                                    ) : category.data.map(this.renderItem)
                                    }
                                </div>
                            </Fragment>
                        ) }
                    </div>
                </cq-scroll>
            </Fragment>
        );
    }
}

export default CategoricalDisplay;
