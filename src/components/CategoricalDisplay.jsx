import React, { Component, Fragment } from 'react';

class CategoricalDisplay extends Component {
    constructor() {
        super();
        this.state = {
            filterText: '',
            filteredSymbols: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeSymbols !== nextProps.activeSymbols) {
            this.setState({ symbols: this._categorizeSymbols(nextProps.activeSymbols) }, () => {
                this.filterSymbols();
            });
        }

        if (this.props.isShown !== nextProps.isShown) {
            if (nextProps.isShown) {
                this.searchInput.focus();
            }
        }
    }

    filterSymbols() {
        const { symbols, filterText } = this.state;
        if (filterText === '') {
            this.setState({ filteredSymbols: symbols });
            return;
        }

        const reg = RegExp(filterText, 'i');
        const filterCategory = c => {
            c.data = c.data.filter(item => {
                return reg.test(item.display);
            });
        };
        let filteredSymbols = JSON.parse(JSON.stringify(symbols)); // Deep clone array
        for (const category of filteredSymbols) {
            if (category.hasSubcategory) {
                for (const subcategory of category.data) {
                    filterCategory(subcategory);
                }
            } else {
                filterCategory(category);
            }
        }

        this.setState({ filteredSymbols });
    }

    setFilterText(filterText) {
        this.setState({ filterText }, () => {
            this.filterSymbols();
        });
    }

    _categorizeSymbols(activeSymbols) {
        let categorizedSymbols = [];
        if(activeSymbols.length > 0) {
            let first = activeSymbols[0].data;
            const getSubcategory = (d) => {
                return {
                    subcategoryName: d.submarket_display_name,
                    data: []
                };
            };
            const getCategory = (d) => {
                return {
                    categoryName: d.market_display_name,
                    categoryId: d.market,
                    hasSubcategory: true,
                    data: []
                };
            };
            let subcategory = getSubcategory(first);
            let category = getCategory(first);
            for (const { data } of activeSymbols) {
                if (category.categoryName !== data.market_display_name) {
                    category.data.push(subcategory);
                    categorizedSymbols.push(category);
                    subcategory = getSubcategory(data);
                    category = getCategory(data);
                }
                if (subcategory.subcategoryName !== data.submarket_display_name) {
                    category.data.push(subcategory);
                    subcategory = getSubcategory(data);
                }
                subcategory.data.push({
                    display: data.name,
                    symbolObj: data,
                });
            }

            category.data.push(subcategory);
            categorizedSymbols.push(category);
        }

        return categorizedSymbols;
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

    renderItem = (item, k) => <div className="cq-item" onClick={() => this.props.onSelectItem(item.symbolObj)} key={k}>{item.display}</div>

    handleFilterTextChange = (event) => this.setFilterText(event.target.value);

    render() {
        const { onSelectItem } = this.props;
        const { filteredSymbols } = this.state;

        return (
            <Fragment>
                <div className="cq-lookup-filters">
                    <div className="cq-lookup-input">
                        <input
                            ref={(input) => { this.searchInput = input; }}
                            onClick={() => this.searchInput.focus()}
                            onChange={this.handleFilterTextChange}
                            id="symbol"
                            cq-focus=""
                            type="text"
                            spellCheck="off"
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="off"
                            name="symbol"
                            placeholder={'"AUD/JPY" or "Apple"'}
                        />
                    </div>
                    { filteredSymbols.map((category, i) =>
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
                        { filteredSymbols.map((category, i) =>
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
