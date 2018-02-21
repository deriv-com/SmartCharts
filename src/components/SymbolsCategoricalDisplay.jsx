import React, { Component, Fragment } from 'react';
import CategoricalDisplay from './CategoricalDisplay.jsx';

class SymbolsCategoricalDisplay extends Component {
    constructor() {
        super();
        this.state = {
            categorizedItems: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.activeSymbols !== nextProps.activeSymbols) {
            this.setState({ categorizedItems: this._categorizeSymbols(nextProps.activeSymbols) });
        }
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

    render() {
        const { categorizedItems } = this.state;

        return (
            <CategoricalDisplay
                {...this.props}
                categorizedItems={categorizedItems}
                placeholderText={'"AUD/JPY" or "Apple"'}
            />
        );
    }
}

export default SymbolsCategoricalDisplay;
