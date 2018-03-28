import { observable, action, computed } from 'mobx';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import React from 'react';
import {t} from '../translation';
window.t = t;
const swatchColors = [
    '#8ec648', '#00afed', '#ee652e', '#912a8e',
    '#fff126', '#e9088c', '#ea1d2c', '#00a553',
    '#00a99c', '#0056a4', '#f4932f', '#0073ba',
    '#66308f', '#323390',
];

export default class ComparisonStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore({getContext: () => this.context});
        this.categoricalDisplay = new CategoricalDisplayStore({
            getActiveCategory: () => this.activeComparisons,
            getCategoricalItems: () => this.mainStore.chart.categorizedSymbols,
            getIsShown: () => this.menu.open,
            activeOptions: [
                { id: 'cmp-color', renderChild: (item) => <span style={{backgroundColor: item.dataObject.color}} /> },
                { id: 'delete', onClick: this.onDeleteItem.bind(this) },
            ],
            onSelectItem: this.onSelectItem.bind(this),
            placeholderText: '"AUD/JPY" or "Apple"',
            favoritesId: 'comparisonSymbols',
            mainStore,
        });
    }

    get context() { return this.mainStore.chart.context; }

    @computed get activeComparisons() {
        const result = [];
        for (const symbol of this.mainStore.chart.comparisonSymbols) {
            result.push({
                enabled: true,
                selected: false,
                display: symbol.symbolObject.name,
                itemId: symbol.symbolObject.symbol,
                dataObject: symbol
            });
        }
        const amount = 50;
        console.log(t.translate('Enter a comma separated list of user names.'));
        console.log(t.translate('Enyaddayadyayays popopo.'));
        return {
            categoryName: t.translate('Active'),
            categoryId: 'active',
            hasSubcategory: false,
            emptyDescription: t.translate('There are no active comparisons yet.'),
            data: result
        };
    }

    @action.bound onDeleteItem({ symbolObject }) {
        this.context.stx.removeSeries(symbolObject.symbol);
    }

    @action.bound onSelectItem(symbolObject) {
        const context = this.context;
        function cb(err, series) {
            if (err) {
                series.parameters.error = true;
            }
        }
        let color = 'auto',
            pattern = null,
            width = 1;
        color = this.getSwatchColor();
        let stx = context.stx;
        let params = {
            symbolObject,
            isComparison: true,
            color,
            pattern,
            width,
            data: {
                useDefaultQuoteFeed: true,
            },
            forceData: true,
        };

        // don't allow symbol if same as main chart, comparison already exists, or just white space
        let exists = stx.getSeries({
            symbolObject,
        });
        for (let i = 0; i < exists.length; i++) {
            if (exists[i].parameters.isComparison) {return;}
        }

        // don't allow symbol if same as main chart or just white space
        if (context.stx.chart.symbol.toLowerCase() !== symbolObject.symbol.toLowerCase() &&
            symbolObject.symbol.trim().length > 0) {
            stx.addSeries(symbolObject.symbol, params, cb);
        }

        this.menu.setOpen(false);
    }

    getSwatchColor() {
        let stx = this.context.stx;
        let selectedColor = '';

        let usedColors = {};
        for (let s in stx.chart.series) {
            let series = stx.chart.series[s];
            if (!series.parameters.isComparison) {continue;}
            usedColors[series.parameters.color] = true;
        }

        for (let i = 0; i < swatchColors.length; i++) { // find first unused color from available colors
            if (!usedColors[swatchColors[i]]) {
                selectedColor = swatchColors[i];
                break;
            }
        }

        return selectedColor;
    }
}
