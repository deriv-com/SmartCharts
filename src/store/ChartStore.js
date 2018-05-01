import { action, observable, computed } from 'mobx';
import StreamManager from '../../app/connection/StreamManager';
import ConnectionManager from '../../app/connection/ConnectionManager';
import PendingPromise from '../utils/PendingPromise';
import Context from '../components/ui/Context';
import React from 'react';
import {stableSort} from './utils';
import BarrierStore from './BarrierStore';
import ChartSettingStore from './ChartSettingStore';
import KeystrokeHub from '../components/ui/KeystrokeHub';
import '../components/ui/Animation';
import { BinaryAPI, Feed } from '../feed';
// import '../AddOns';


const getLanguageStorage = function(){
    let default_language = 'en';
    try {
        let setting_string = CIQ.localStorage.getItem('smartchart-setting'),
            setting = JSON.parse(setting_string !== '' ? setting_string : '{}');

        return setting.language || default_language;
    } catch (e) {
        return default_language;
    }
};

const connectionManager = new ConnectionManager({
    appId: 1,
    language: getLanguageStorage(),
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
        this.setting = new ChartSettingStore();
    }

    onSymbolChange = null;
    contextPromise = new PendingPromise();
    activeSymbols = [];
    rootNode = null;
    stxx = null;
    id = null;
    @observable context = null;
    @observable currentActiveSymbol = defaultSymbol;
    @observable isChartAvailable = true;
    @observable comparisonSymbols = [];
    @observable categorizedSymbols = [];
    @observable barrierJSX;
    @observable chartPanelTop = '0px';
    @observable isMobile = false;

    @action.bound setActiveSymbols(activeSymbols) {
        if (activeSymbols && this.context) {
            this.activeSymbols = this.processSymbols(activeSymbols);
            this.categorizedSymbols = this.categorizeActiveSymbols();
        }
    }

    get loader () { return this.mainStore.loader; }

    saveLayout() {
        const layoutData = this.stxx.exportLayout(true);
        const json = JSON.stringify(layoutData);
        CIQ.localStorageSetItem(`layout-${this.id}`, json);
    }

    restoreLayout(stx) {
        let layoutData = CIQ.localStorage.getItem(`layout-${this.id}`);

        const checkForQuerystring = window.location.origin === 'https://charts.binary.com' ||
            window.location.origin === 'http://localhost:8080';

        if(checkForQuerystring) {
            const [, json] = window.location.href.split('#');
            if(json) {
                layoutData = decodeURIComponent(json);
                window.history.replaceState({}, document.title, "/");
            }
        }

        if (layoutData === null) {return;}
        try {
            layoutData = JSON.parse(layoutData);
        } catch(e) { return; }

        stx.importLayout(layoutData, {
            managePeriodicity: true,
            cb: () => {
                this.restoreDrawings(stx, stx.chart.symbol);
                if (this.loader) {this.loader.hide();}
            },
        });
    }

    saveDrawings() {
        const obj = this.stxx.exportDrawings();
        const symbol = this.stxx.chart.symbol;
        if (obj.length === 0) {
            CIQ.localStorage.removeItem(symbol);
        } else {
            CIQ.localStorageSetItem(symbol, JSON.stringify(obj));
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
        stxx.chart.allowScrollFuture = false;
        const context = new Context(stxx, this.rootNode);

        // Put some margin so chart doesn't get blocked by chart title
        stxx.chart.yAxis.initialMarginTop = 125;
        stxx.calculateYAxisMargins(stxx.chart.panel.yAxis);

        context.changeSymbol = (data) => {
            this.loader.show();

            // reset comparisons
            for (const field in this.stxx.chart.series) {
                if (stxx.chart.series[field].parameters.bucket !== 'study') {
                    this.stxx.removeSeries(field);
                }
            }

            this.stxx.newChart(data, null, null, (err) => {
                this.loader.hide();
                if (err) {
                    /* TODO, symbol not found error */
                    return;
                }
                this.restoreDrawings(this.stxx, this.stxx.chart.symbol);
            });

            this.currentActiveSymbol = data;
            this.categorizedSymbols = this.categorizeActiveSymbols();
        };

        new KeystrokeHub(document.querySelector('body'), context, {
            cb: KeystrokeHub.defaultHotKeys,
        });

        const UIStorage = new CIQ.NameValueStore();

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

        this.loader.show();

        const studiesStore = this.mainStore.studies;
        stxx.callbacks.studyOverlayEdit = study => studiesStore.editStudy(study);
        stxx.callbacks.studyPanelEdit = study => studiesStore.editStudy(study);

        this.restorePreferences();
        this.restoreLayout(stxx);

        if (stxx.chart.symbol) {
            this.currentActiveSymbol = stxx.chart.symbolObject;
        } else {
            context.changeSymbol(defaultSymbol);
        }

        this.context = context;
        this.contextPromise.resolve(context);
        stxx.setStyle('stx_line_chart', 'color', '#4DAFEE'); // TODO => why is not working in css?
    }

    @action.bound init(rootNode, props) {
        this.rootNode = rootNode;

        const { requestAPI, requestSubscribe, requestForget } = props;
        const api = new BinaryAPI(requestAPI, requestSubscribe, requestForget);
        api.getActiveSymbols().then(({ active_symbols }) => {
            this.setActiveSymbols(active_symbols);
        });

        const stxx = this.stxx = new CIQ.ChartEngine({
            container: this.rootNode.querySelector('.chartContainer.primary'),
            controls: {chartControls:null}, // hide the default zoom buttons
            preferences: {
                currentPriceLine: true,
            },
            yTolerance: 999999, // disable vertical scrolling
        });
        const deleteElement = stxx.chart.panel.holder.parentElement.querySelector('#mouseDeleteText');
        const manageElement = stxx.chart.panel.holder.parentElement.querySelector('#mouseManageText');
        deleteElement.textConent = t.translate("right-click to delete");
        manageElement.textConent = t.translate("right-click to manage");

        // Animation (using tension requires splines.js)
        CIQ.Animation(stxx, { stayPut: true });

        // connect chart to data
        stxx.attachQuoteFeed(new Feed(api, stxx, this.mainStore), {
            refreshInterval: null,
        });

        // Extended hours trading zones
        // new CIQ.ExtendedHours({
        //     stx: stxx,
        //     filter: true,
        // });

        // Inactivity timer
        // new CIQ.InactivityTimer({
        //     stx: stxx,
        //     minutes: 30,
        // });

        const holderStyle = stxx.chart.panel.holder.style;
        stxx.addEventListener('layout', () => {
            this.saveLayout();
            this.chartPanelTop = holderStyle.top;
        });
        stxx.addEventListener('symbolChange', (evt) => {
            if (this.onSymbolChange) { this.onSymbolChange(evt.symbolObject); }
            this.saveLayout();
        });
        stxx.addEventListener('drawing', this.saveDrawings.bind(this));
        // stxx.addEventListener('newChart', () => { });
        stxx.addEventListener('preferences', this.savePreferences.bind(this));

        this.startUI();
        this.resizeScreen();
        this.chartPanelTop = holderStyle.top;

        window.addEventListener('resize', this.resizeScreen.bind(this));

        stxx.append('createDataSet', this.updateComparisons);
    }

    @action.bound updateComparisons(...args) {
        let stx = this.context.stx;
        const comparisonSymbolsKeys = Object.keys(stx.chart.series);
        if (comparisonSymbolsKeys.length !== this.comparisonSymbols.length) {
            const comparisons = [];
            let q = stx.currentQuote();
            if (q) {
                for (const sybl of comparisonSymbolsKeys) {
                    const srs = stx.chart.series[sybl];
                    const prm = srs.parameters;
                    const price = srs.lastQuote ? srs.lastQuote.Close : undefined;

                    comparisons.push({
                        color: prm.color,
                        price,
                        symbolObject: prm.symbolObject,
                    });
                }
            }
            this.comparisonSymbols = comparisons;
            return;
        }

        // Update the comparison prices:
        let i = 0;
        for (const sybl of comparisonSymbolsKeys) {
            const comp = this.comparisonSymbols[i];
            const srs = stx.chart.series[sybl];
            comp.price = srs.lastQuote ? srs.lastQuote.Close : undefined;
            i++;
        }
    }

    processSymbols(symbols) {
        let processedSymbols = [];

        // Stable sort is required to retain the order of the symbol name
        stableSort(symbols, (a, b) => {
            return a.submarket_display_name.localeCompare(b.submarket_display_name);
        });

        for (const s of symbols) {
            processedSymbols.push({
                symbol: s.symbol,
                name: s.display_name,
                market: s.market,
                market_display_name: s.market_display_name,
                submarket_display_name: s.submarket_display_name,
                exchange_is_open: s.exchange_is_open,
                decimal_places: s.pip.length - 2
            });
        }


        // Categorize symbols in order defined by another array; there's probably a more
        // efficient algo for this, but for just ~100 items it's not worth the effort
        const order = ['forex', 'indices', 'stocks', 'commodities', 'volidx'];
        const orderedSymbols = [];
        for (const o of order) {
            for (const p of processedSymbols) {
                if (o === p.market) {
                    orderedSymbols.push(p);
                }
            }
        }
        return orderedSymbols;
    }

    categorizeActiveSymbols() {
        const activeSymbols = this.activeSymbols;
        let categorizedSymbols = [];
        if(activeSymbols.length > 0) {
            let first = activeSymbols[0];
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
            for (const symbol of activeSymbols) {
                if (category.categoryName !== symbol.market_display_name) {
                    category.data.push(subcategory);
                    categorizedSymbols.push(category);
                    subcategory = getSubcategory(symbol);
                    category = getCategory(symbol);
                }
                if (subcategory.subcategoryName !== symbol.submarket_display_name) {
                    category.data.push(subcategory);
                    subcategory = getSubcategory(symbol);
                }
                const selected = symbol.symbol === this.currentActiveSymbol.symbol;
                subcategory.data.push({
                    enabled: true,
                    selected,
                    itemId: symbol.symbol,
                    display: symbol.name,
                    dataObject: symbol,
                });
            }

            category.data.push(subcategory);
            categorizedSymbols.push(category);
        }

        return categorizedSymbols;
    }
}

export default ChartStore;
