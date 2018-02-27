import { observable, action, computed } from 'mobx';
import MenuStore from './MenuStore';
import CategoricalDisplayStore from './CategoricalDisplayStore';
import { connect } from './Connect';

const swatchColors = [
    '#8ec648', '#00afed', '#ee652e', '#912a8e',
    '#fff126', '#e9088c', '#ea1d2c', '#00a553',
    '#00a99c', '#0056a4', '#f4932f', '#0073ba',
    '#66308f', '#323390',
];

export default class ComparisonStore {
    constructor(mainStore) {
        this.mainStore = mainStore;
        this.menu = new MenuStore(mainStore);
        this.categoricalDisplay = new CategoricalDisplayStore({
            getCategoricalItems: () => this.mainStore.chart.categorizedItems,
            getIsShown: () => this.menu.open,
            onSelectItem: this.onSelectItem.bind(this)
        });
    }

    get context() { return this.mainStore.chart.context; }

    @computed get activeItems() { return this.mainStore.chart.comparisonSymbols; }

    @action.bound onSelectItem(symbolObj) {
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
            symbolObject: symbolObj,
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
            symbolObject: symbolObj,
        });
        for (let i = 0; i < exists.length; i++) {
            if (exists[i].parameters.isComparison) {return;}
        }

        // don't allow symbol if same as main chart or just white space
        if (context.stx.chart.symbol.toLowerCase() !== symbolObj.symbol.toLowerCase() &&
            symbolObj.symbol.trim().length > 0) {
            stx.addSeries(symbolObj.symbol, params, cb);
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
