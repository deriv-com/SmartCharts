import { action, observable, computed } from 'mobx';
import StreamManager from '../StreamManager';
import ActiveSymbolDriver from '../ActiveSymbolDriver';
import ConnectionManager from '../ConnectionManager';
import MainStore from './index';
import Feed from '../Feed';
import PendingPromise from '../utils/PendingPromise';
import Context from '../components/ui/Context';

const connectionManager = new ConnectionManager({
    appId: 1,
    language: 'en',
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',
});
const streamManager = new StreamManager(connectionManager);

const defaultSymbol = {
    symbol: 'R_100',
    name: "Volatility 100 Index",
    market_display_name: "Volatility Indices",
    exchange_is_open: 1,
    decimal_places: 2
};

class ChartStore {
    get connectionManager() { return connectionManager; }
    get streamManager() { return streamManager; }

    static _id_counter = 0;

    constructor(mainStore) {
        this.id = ++ChartStore._id_counter;
        this.mainStore = mainStore;
    }

    driver = new ActiveSymbolDriver();
    contextPromise = new PendingPromise();
    rootNode = null;
    stxx = null;
    id = null;
    @observable context = null;
    @observable activeSymbols = [];
    @observable currentActiveSymbol = defaultSymbol;
    @observable comparisonSymbols = [];

    @action.bound setSymbols(symbols) {
        if (symbols && this.context) {
            this.driver.symbols = symbols.active_symbols;
            // update lookup with new symbols
            this.context.setLookupDriver(this.driver);
            this.activeSymbols = this.driver.symbols;
        }
    }

    saveLayout() {
        const layoutDat = this.stxx.exportLayout(true);
        const json = JSON.stringify(layoutDat);
        CIQ.localStorageSetItem(`layout-${this.id}`, json);
    }

    restoreLayout(stx) {
        let layoutDat = CIQ.localStorage.getItem(`layout-${this.id}`);
        if (layoutDat === null) {return;}
        layoutDat = JSON.parse(layoutDat);

        stx.importLayout(layoutDat, {
            managePeriodicity: true,
            cb: () => {
                this.restoreDrawings(stx, stx.chart.symbol);
                if (this.context.loader) {this.context.loader.hide();}
            },
        });
    }

    saveDrawings(target) {
        const obj = target.stx.exportDrawings();
        if (obj.length === 0) {
            CIQ.localStorage.removeItem(obj.symbol);
        } else {
            CIQ.localStorageSetItem(obj.symbol, JSON.stringify(obj));
        }
    }
    restoreDrawings(stx, symbol) {
        let memory = CIQ.localStorage.getItem(symbol);
        if (memory !== null) {
            let parsed = JSON.parse(memory);
            if (parsed) {
                stx.importDrawings(parsed);
                stx.draw();
            }
        }
    }

    restorePreferences() {
        const pref = CIQ.localStorage.getItem(`preferences-${this.id}`);
        if (pref) {
            stxx.importPreferences(JSON.parse(pref));
        }
    }
    savePreferences() {
        CIQ.localStorageSetItem(
            `preferences-${this.id}`,
            JSON.stringify(stxx.exportPreferences()),
        );
    }

    updateHeight() {
        const ciqNode = this.rootNode.querySelector('.ciq-chart');
        let ciqHeight = ciqNode.offsetHeight;
        ciqHeight += ciqNode.classList.contains('toolbar-on') ? -45 : 0;

        const containerNode = this.rootNode.querySelector('.chartContainer.primary');
        containerNode.style.height = `${ciqHeight}px`;
    }

    resizeScreen() {
        if (!this.context) { return; }
        this.updateHeight();
        this.stxx.resizeChart();
        if (this.stxx.slider) {
            this.stxx.slider.display(this.stxx.layout.rangeSlider);
        }
    }

    startUI() {
        const stxx = this.stxx;
        stxx.chart.allowScrollPast = false;
        const context = new Context(stxx, this.rootNode);
        new CIQ.UI.Layout(context);

        context.changeSymbol = (data) => {
            if (context.loader) {context.loader.show();}

            // reset comparisons
            for (const field in this.stxx.chart.series) {
                if (stxx.chart.series[field].parameters.bucket !== 'study') {
                    this.stxx.removeSeries(field);
                }
            }

            this.stxx.newChart(data, null, null, (err) => {
                if (context.loader) {context.loader.hide();}
                if (err) {
                    /* TODO, symbol not found error */
                    return;
                }
                this.restoreDrawings(this.stxx, this.stxx.chart.symbol);
            });

            this.currentActiveSymbol = data;
        };

        context.setLookupDriver(this.driver);

        new CIQ.UI.KeystrokeHub(document.querySelector('body'), context, {
            cb: CIQ.UI.KeystrokeHub.defaultHotKeys,
        });

        new CIQ.UI.StudyEdit(null, context);

        const UIStorage = new CIQ.NameValueStore();

        this.rootNode.querySelector('cq-redo').pairUp(this.rootNode.querySelector('cq-undo'));

        const params = {
            excludedStudies: {
                Directional: true,
                Gopala: true,
                vchart: true,
            },
            alwaysDisplayDialog: {
                ma: true,
            },
            /* dialogBeforeAddingStudy: {"rsi": true} // here's how to always show a dialog before adding the study */
        };

        if (context.loader) {context.loader.show();}

        this.restorePreferences();
        this.restoreLayout(stxx);

        if (stxx.chart.symbol) {
            this.currentActiveSymbol = stxx.chart.symbolObject;
        } else {
            context.changeSymbol(defaultSymbol);
        }

        this.context = context;
        this.contextPromise.resolve(context);
        CIQ.UI.begin();
        stxx.setStyle('stx_line_chart', 'color', '#4DAFEE'); // TODO => why is not working in css?

        // Optionally set a language for the UI, after it has been initialized, and translate.
        // CIQ.I18N.setLanguage(stxx, "zh");
    }

    @action.bound init(rootNode) {
        this.rootNode = rootNode;

        const stxx = this.stxx = new CIQ.ChartEngine({
            container: this.rootNode.querySelector('.chartContainer.primary'),
            controls: {chartControls:null} // hide the default zoom buttons
        });

        // Animation (using tension requires splines.js)
        CIQ.Animation(stxx, { stayPut: true });

        // connect chart to data
        stxx.attachQuoteFeed(new Feed(streamManager, stxx), {
            refreshInterval: null,
        });

        // Extended hours trading zones
        new CIQ.ExtendedHours({
            stx: stxx,
            filter: true,
        });

        // Floating tooltip on mousehover
        new CIQ.Tooltip({
            stx: stxx,
            ohl: true,
            volume: false,
            series: true,
            studies: true,
        });

        // Inactivity timer
        new CIQ.InactivityTimer({
            stx: stxx,
            minutes: 30,
        });

        stxx.addEventListener('layout', this.saveLayout.bind(this));
        stxx.addEventListener('symbolChange', this.saveLayout.bind(this));
        stxx.addEventListener('drawing', this.saveDrawings.bind(this));
        // stxx.addEventListener('newChart', () => { });
        stxx.addEventListener('preferences', this.savePreferences.bind(this));

        new CIQ.RangeSlider({ stx: stxx });

        const isWebComponentsSupported = ('registerElement' in document &&
            'import' in document.createElement('link') &&
            'content' in document.createElement('template'));

        if (isWebComponentsSupported) {
            this.startUI();
            this.resizeScreen();
        } else {
            window.addEventListener('WebComponentsReady', () => {
                this.startUI();
                this.resizeScreen();
            });
        }

        $(window).resize(this.resizeScreen.bind(this));

        stxx.append('updateChartData', this.updateComparisons);
    }

    updateComparisons = (...args) => {
        /* createDataSet sends more than ten updates per tick.
            This is to avoid that.
            Happens only for line chart because of animation
        */
        if (!(args[2] && args[2].firstLoop)) return;

        let stx = this.context.stx;
        let q = stx.currentQuote();
        const comparisons = [];
        if (q) {
            for (const s in stx.chart.series) {
                const d = stx.chart.series[s];
                const p = d.parameters;
                const price = d.lastQuote ? d.lastQuote.Close : undefined;

                comparisons.push({
                    color: p.color,
                    price,
                    symbolObject: p.symbolObject,
                });
            }
        }
        this.comparisonSymbols = comparisons;
    }

    @computed get categorizedItems() {
        const activeSymbols = this.activeSymbols;
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
                const selected = data.symbol === this.currentActiveSymbol.symbol;
                const enabled = selected ? false : data.exchange_is_open;
                subcategory.data.push({
                    enabled,
                    selected,
                    itemId: data.symbol,
                    display: data.name,
                    dataObject: data,
                });
            }

            category.data.push(subcategory);
            categorizedSymbols.push(category);
        }

        return categorizedSymbols;
    }
}

export default ChartStore;
