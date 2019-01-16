import React from 'react';
import { action, computed, observable, when } from 'mobx';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import { CategoricalDisplay } from '../components/categoricaldisplay';
import Menu from '../components/Menu.jsx';
import { logEvent, LogCategories, LogActions } from  '../utils/ga';

const swatchColors = [
    '#8ec648', '#00afed', '#ee652e', '#912a8e',
    '#fff126', '#e9088c', '#ea1d2c', '#00a553',
    '#00a99c', '#0056a4', '#f4932f', '#0073ba',
    '#66308f', '#323390',
];

export default class ComparisonStore {
    @observable comparisonSymbols = [];
    currentActiveSymbol; // just used to track if symbol has changed

    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore, { route:'comparison' });
        this.ComparisonMenu = this.menu.connect(Menu);
        this.categoricalDisplay = new CategoricalDisplayStore({
            getActiveCategory: () => this.activeComparisons,
            getCategoricalItems: () => this.mainStore.chart.categorizedSymbols,
            getIsShown: () => this.menu.open,
            activeOptions: [
                { id: 'cmp-color', renderChild: item => <span style={{ backgroundColor: item.dataObject.color }} /> },
                { id: 'delete', onClick: this.onDeleteItem },
            ],
            onSelectItem: this.onSelectItem.bind(this),
            placeholderText: t.translate('Search...'),
            favoritesId: 'chartTitle&Comparison',
            mainStore,
        });
        this.ComparisonSelector = this.categoricalDisplay.connect(CategoricalDisplay);
        when(() => this.context, this.onContextReady);
    }

    get context() { return this.mainStore.chart.context; }

    @action.bound updateComparisonPrices(data) {
        const comparison = this.comparisonSymbols.find(x => x.symbolObject.symbol === data.symbol);
        if (comparison) {
            comparison.price = data.Close;
            comparison.prevPrice = data.prevClose;
        } else {
            this.updateComparisons();
        }
    }

    removeComparison(symbolObj) {
        this.context.stx.removeSeries(symbolObj.symbol);
    }

    @computed get activeComparisons() {
        const result = [];
        for (const symbol of this.comparisonSymbols) {
            result.push({
                enabled: true,
                selected: false,
                display: symbol.symbolObject.name,
                itemId: symbol.symbolObject.symbol,
                dataObject: symbol,
            });
        }
        return {
            categoryName: t.translate('Active'),
            categoryId: 'active',
            hasSubcategory: false,
            emptyDescription: t.translate('There are no active comparisons yet.'),
            data: result,
        };
    }

    @action.bound onDeleteItem({ symbolObject }) {
        logEvent(LogCategories.ChartControl, LogActions.Comparison, `Remove ${symbolObject.name}`);
        this.removeComparison(symbolObject);
    }

    @action.bound onSelectItem(symbolObject) {
        logEvent(LogCategories.ChartControl, LogActions.Comparison, `Add ${symbolObject.name}`);
        const context = this.context;
        const pattern = null;
        const width = 1;
        const color = this.getSwatchColor() || 'auto';
        const stx = context.stx;
        const params = {
            symbolObject,
            isComparison: true,
            display: symbolObject.name,
            fillGaps: true,
            gapDisplayStyle: true,
            color,
            pattern,
            width,
            data: {
                useDefaultQuoteFeed: true,
            },
            forceData: true,
        };

        // don't allow symbol if same as main chart, comparison already exists, or just white space
        const exists = stx.getSeries({
            symbolObject,
        });
        for (let i = 0; i < exists.length; i++) {
            if (exists[i].parameters.isComparison) { return; }
        }

        // don't allow symbol if same as main chart or just white space
        if (context.stx.chart.symbol !== symbolObject.symbol) {
            this.comparisonSymbols.push({
                color,
                symbolObject,
            });
            stx.addSeries(symbolObject.symbol, params, (err, series) => {
                if (err) {
                    this.removeComparison(series.parameters.symbolObject);
                    series.parameters.error = true;
                }
            });
        }


        this.menu.setOpen(false);
    }

    getSwatchColor() {
        const { stx } = this.context;
        let selectedColor = '';

        const usedColors = {};
        for (const s in stx.chart.series) {
            const series = stx.chart.series[s];
            if (!series.parameters.isComparison) { continue; }
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

    @action.bound onSymbolChange({ action : symbolAction }) {
        if (symbolAction === 'master') {
            const { stx } = this.context;
            if (this.currentActiveSymbol !== stx.chart.symbol) {
                this.comparisonSymbols = [];
                for (const field in stx.chart.series) {
                    if (stx.chart.series[field].parameters.bucket !== 'study') {
                        stx.removeSeries(field);
                    }
                }
                this.currentActiveSymbol = stx.chart.symbol;
            }
        } else {
            // symbolAction = 'add-series' or 'remove-series'
            this.updateComparisons();
        }
    }

    updateComparisons() {
        if (!this.context) { return; }
        const { stx } = this.context;
        const comparisonSymbolsKeys = Object.keys(stx.chart.series);
        if (comparisonSymbolsKeys.length !== this.comparisonSymbols.length) {
            const comparisons = [];
            const q = stx.currentQuote();
            if (q) {
                for (const sybl of comparisonSymbolsKeys) {
                    const srs = stx.chart.series[sybl];
                    const prm = srs.parameters;
                    const comp = q[sybl];
                    // Symbol from cache may be in different language, so replace it with server's
                    const symbolObject = this.mainStore.chart.activeSymbols.getSymbolObj(prm.symbolObject.symbol);

                    comparisons.push({
                        color: prm.color,
                        price: comp && comp.Close,
                        prevPrice: comp && comp.iqPrevClose,
                        symbolObject,
                    });
                }
            }
            this.comparisonSymbols = comparisons;
        }
    }

    onContextReady = () => {
        const { stx } = this.context;
        const { feed } = this.mainStore.chart;
        this.currentActiveSymbol = stx.chart.symbol;
        stx.addEventListener('symbolChange', this.onSymbolChange);
        feed.onComparisonDataUpdate(this.updateComparisonPrices);
        this.updateComparisons();
    };
}
