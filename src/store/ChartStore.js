import { action } from 'mobx';
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

class ChartStore {
    get connectionManager() { return connectionManager; }
    get streamManager() { return streamManager; }

    static _id_counter = 0;

    constructor() {
        this.id = ++ChartStore._id_counter;
    }

    driver = new ActiveSymbolDriver();
    contextPromise = new PendingPromise();
    rootNode = null;
    context = null;
    stxx = null;
    id = null;

    @action.bound setSymbols(symbols) {
        if (symbols && this.context) {
            this.driver.symbols = symbols.active_symbols;
            // update lookup with new symbols
            this.context.setLookupDriver(this.driver);

            // TODO: Anti-pattern, but we need access to Lookup.
            const lookups = this.rootNode.querySelectorAll('cq-lookup');
            for (const lookup of lookups) {
                lookup.results(this.driver.symbols);
            }
        }
    }

    saveLayout(obj) {
        const json = JSON.stringify(obj.stx.exportLayout(true));
        CIQ.localStorageSetItem(`layout-${this.id}`, json);
    }
    restoreLayout(stx) {
        const datum = CIQ.localStorage.getItem(`layout-${this.id}`);
        if (datum === null) return;

        stx.importLayout(JSON.parse(datum), {
            managePeriodicity: true,
            cb: () => {
                this.restoreDrawings(stx, stx.chart.symbol);
                if (this.context.loader) this.context.loader.hide();
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
        this.context = new Context(stxx, this.rootNode);
        new CIQ.UI.Layout(this.context);

        this.context.changeSymbol = (data) => {
            if (this.context.loader) this.context.loader.show();

            // reset comparisons
            for (const field in this.stxx.chart.series) {
                if (stxx.chart.series[field].parameters.bucket !== 'study') {
                    this.stxx.removeSeries(field);
                }
            }

            this.stxx.newChart(data, null, null, (err) => {
                if (this.context.loader) this.context.loader.hide();
                if (err) {
                    /* TODO, symbol not found error */
                    return;
                }
                this.restoreDrawings(this.stxx, this.stxx.chart.symbol);
            });
        };

        this.context.setLookupDriver(this.driver);

        const symbolLookup = this.rootNode.querySelector('.ciq-search cq-lookup');
        symbolLookup.setCallback((context, data) => {
            context.changeSymbol(data);
        });

        new CIQ.UI.KeystrokeHub(document.querySelector('body'), this.context, {
            cb: CIQ.UI.KeystrokeHub.defaultHotKeys,
        });

        new CIQ.UI.StudyEdit(null, this.context);

        const UIStorage = new CIQ.NameValueStore();

        const ciqDrawNode = this.rootNode.querySelector('.ciq-draw');
        ciqDrawNode.registerCallback((value) => {
            const ciqChart = this.rootNode.querySelector('.ciq-chart');
            if (value) {
                ciqDrawNode.node.addClass('active');
                CIQ.appendClassName(ciqChart, 'toolbar-on');
            } else {
                ciqDrawNode.node.removeClass('active');
                CIQ.unappendClassName(ciqChart, 'toolbar-on');
            }
            this.updateHeight();
            stxx.resizeChart();

            // a little code here to remember what the previous drawing tool was
            // and to re-enable it when the toolbar is reopened
            if (value) {
                stxx.changeVectorType(ciqDrawNode.priorVectorType);
            } else {
                ciqDrawNode.priorVectorType = stxx.currentVectorParameters.vectorType;
                stxx.changeVectorType('');
            }
        });

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
        const UIStudyMenu = new CIQ.UI.StudyMenu(this.rootNode.querySelector('*[cq-studies]'), this.context, params);
        UIStudyMenu.renderMenu();

        if (this.context.loader) this.context.loader.show();

        this.restorePreferences();
        this.restoreLayout(stxx);

        if (!stxx.chart.symbol) {
            symbolLookup.selectItem({
                symbol: 'R_100',
            }); // load an initial symbol
        }

        this.contextPromise.resolve(this.context);
        MainStore.Instance.timeperiod.context = this.context;
        CIQ.UI.begin();
        stxx.setStyle('stx_line_chart', 'color', '#4DAFEE'); // TODO => why is not working in css?

        // CIQ.I18N.setLanguage(stxx, "zh"); // Optionally set a language for the UI, after it has been initialized, and translate.
    }

    init(rootNode) {
        this.rootNode = rootNode;

        const stxx = this.stxx = new CIQ.ChartEngine({
            container: this.rootNode.querySelector('.chartContainer.primary'),
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
    }
}

export default ChartStore;
