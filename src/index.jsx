/* eslint-disable no-new */
import $ from 'jquery';

import StreamManager from './stream-manager';
import Feed from './feed';
import ActiveSymbolDriver from './ActiveSymbolDriver';
import ConnectionManager from './connection-manager';
import Context from './components/ui/Context';

import '../js/thirdparty/html2canvas';
import '../js/thirdparty/iscroll';

import { CIQ, $$$ } from '../js/chartiq';

/* css + scss */
import '../css/stx-chart.css';
import '../sass/chartiq.scss';

import '../js/addOns';
import '../js/translations';
// import '../plugins/tfc/tfc';
import '../js/plugin';

import './components/Advertisement';
import './components/AggregationDialog';
import './components/Attribution';
import './components/ChartTitle';
import './components/Close';
import './components/ColorPicker';
import './components/Comparison';
import './components/DrawingToolbar';
import './components/FibSettingsDialog';
import './components/LanguageDialog';
import './components/Loader';
import './components/Lookup';
import './components/Menu';
import './components/MenuDropDown';
import './components/Redo';
import './components/Scroll';
import './components/ShareButton';
import './components/ShareDialog';
import './components/ShowRange';
import './components/SidePanel';
import './components/StudyContext';
import './components/StudyDialog';
import './components/StudyInput';
import './components/StudyLegend';
import './components/StudyOutput';
import './components/StudyParameter';
import './components/Swatch';
import './components/TFC';
import './components/ThemeDialog';
import './components/ThemePiece';
import './components/Themes';
import './components/TimezoneDialog';
import './components/Toggle';
import './components/Undo';
import './components/ViewDialog';
import './components/Views';
import './components/Clickable';
import './components/ChartControls';

import Line from './draw/line';

window.Line = Line;
window.CIQ = CIQ;
window.stxx = stxx;

let UIContext;

const _connectionManager = new ConnectionManager({
    appId: 1,
    language: 'en',
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',
});

const _streamManager = new StreamManager(_connectionManager);

const stxx = new CIQ.ChartEngine({
    container: $$$('#chartContainer'),
});


CIQ.Animation(stxx, { tension: 0.3, stayPut: true });

function setHeight() {
    let windowHeight = $(window).height();
    let ciqHeight = $('.ciq-chart').height();

    if ($('body').hasClass('toolbar-on')) {
        $('#chartContainer').height(ciqHeight - 45);
    } else {
        $('#chartContainer').height(ciqHeight);
    }
    // This little snippet will ensure that dialog boxes are never larger than the screen height
    $('#maxHeightCSS').remove();
    $('head').append(`<style id="maxHeightCSS">cq-dialog { max-height: ${windowHeight}px }</style>`);
}


// connect chart to data
// stxx.attachQuoteFeed(quotefeedSimulator,{refreshInterval:1});
stxx.attachQuoteFeed(new Feed(_streamManager, stxx), {
    refreshInterval: null,
});

// Extended hours trading zones -- Make sure this is instantiated before calling startUI as a timing issue with may occur
new CIQ.ExtendedHours({
    stx: stxx,
    filter: true,
});

// Floating tooltip on mousehover
// comment in the following line if you want a tooltip to display when the crosshair toggle is turned on
// This should be used as an *alternative* to the HeadsUP (HUD).
new CIQ.Tooltip({
    stx: stxx, ohl: true, volume: false, series: true, studies: true,
});

// Inactivity timer
new CIQ.InactivityTimer({
    stx: stxx,
    minutes: 30,
});

// Animation (using tension requires splines.js)
// new CIQ.Animation(stxx, {tension:0.3});


function resizeScreen() {
    if (!UIContext) return;
    setHeight();
    let sidePanel = $('cq-side-panel')[0];
    if (sidePanel) {
        $('.ciq-chart-area').css({ right: `${sidePanel.nonAnimatedWidth()}px` });
        $('cq-tradingcentral').css({ 'margin-right': `${sidePanel.nonAnimatedWidth() + 15}px` });
    }
    stxx.resizeChart();
    if (stxx.slider) stxx.slider.display(stxx.layout.rangeSlider);
}

function restoreDrawings(stx, symbol) {
    let memory = CIQ.localStorage.getItem(symbol);
    if (memory !== null) {
        let parsed = JSON.parse(memory);
        if (parsed) {
            stx.importDrawings(parsed);
            stx.draw();
        }
    }
}

// TODO, encapsulate these in a helper object
function restoreLayout(stx, cb) {
    const datum = CIQ.localStorage.getItem('myChartLayout');
    if (datum === null) return;

    function closure() {
        restoreDrawings(stx, stx.chart.symbol);
        if (cb) cb();
    }
    stx.importLayout(JSON.parse(datum), {
        managePeriodicity: true,
        cb: closure,
    });
}

// save the chart's layout when the symbol or layout changes
function saveLayout(obj) {
    const s = JSON.stringify(obj.stx.exportLayout(true));
    CIQ.localStorageSetItem('myChartLayout', s);
}


function saveDrawings(obj) {
    let tmp = obj.stx.exportDrawings();
    if (tmp.length === 0) {
        CIQ.localStorage.removeItem(obj.symbol);
    } else {
        CIQ.localStorageSetItem(obj.symbol, JSON.stringify(tmp));
    }
}

function restorePreferences() {
    let pref = CIQ.localStorage.getItem('myChartPreferences');
    if (pref) stxx.importPreferences(JSON.parse(pref));
}

function savePreferences() {
    CIQ.localStorageSetItem('myChartPreferences', JSON.stringify(stxx.exportPreferences()));
}

function retoggleEvents() {
    let active = $('.stx-markers .ciq-radio.ciq-active');
    active.parent().triggerHandler('stxtap');
}

stxx.callbacks.layout = saveLayout;
stxx.callbacks.symbolChange = saveLayout;
stxx.callbacks.drawing = saveDrawings;
stxx.callbacks.newChart = retoggleEvents;
stxx.callbacks.preferences = savePreferences;

function startUI() {
    const contextNode = $('cq-context,[cq-context]');
    UIContext = new Context(stxx, contextNode);
    new CIQ.UI.Layout(UIContext);

    UIContext.changeSymbol = function (data) {
        let stx = this.stx;
        if (this.loader) this.loader.show();

        // reset comparisons - remove this loop to transfer from symbol to symbol.
        for (let field in stx.chart.series) {
            // keep studies
            if (stxx.chart.series[field].parameters.bucket !== 'study') stx.removeSeries(field);
        }

        let self = this;
        stx.newChart(data, null, null, (err) => {
            if (err) {
                // TODO, symbol not found error
                if (self.loader) self.loader.hide();
                return;
            }
            // The user has changed the symbol, populate $("cq-chart-title")[0].previousClose with yesterday's closing price

            if (stx.tfc) stx.tfc.changeSymbol(); // Update trade from chart
            if (self.loader) self.loader.hide();
            restoreDrawings(stx, stx.chart.symbol);
        });
    };

    const driver = new ActiveSymbolDriver(_connectionManager);

    UIContext.setLookupDriver(driver);

    const symbolLookup = $$$('.ciq-search cq-lookup');
    symbolLookup.setCallback((context, data) => {
        context.changeSymbol(data);
    });

    new CIQ.UI.KeystrokeHub($$$('body'), UIContext, {
        cb: CIQ.UI.KeystrokeHub.defaultHotKeys,
    });

    new CIQ.UI.StudyEdit(null, UIContext);

    let UIStorage = new CIQ.NameValueStore();

    $('.ciq-draw')[0].registerCallback(function (value) {
        if (value) {
            this.node.addClass('active');
            $('body').addClass('toolbar-on');
        } else {
            this.node.removeClass('active');
            $('body').removeClass('toolbar-on');
        }
        setHeight();
        let stx = this.context.stx;
        stx.resizeChart();

        // a little code here to remember what the previous drawing tool was
        // and to re-enable it when the toolbar is reopened
        if (value) {
            stx.changeVectorType(this.priorVectorType);
        } else {
            this.priorVectorType = stx.currentVectorParameters.vectorType;
            stx.changeVectorType('');
        }
    });

    $('cq-redo')[0].pairUp($('cq-undo'));

    let params = {
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
    let UIStudyMenu = new CIQ.UI.StudyMenu($('*[cq-studies]'), UIContext, params);
    UIStudyMenu.renderMenu();

    $('cq-views').each(function () {
        this.initialize();
    });

    if (UIContext.loader) UIContext.loader.show();
    restorePreferences();
    restoreLayout(stxx, () => {
        if (UIContext.loader) UIContext.loader.hide();
    });

    if (!stxx.chart.symbol) {
        symbolLookup.selectItem({
            symbol: 'R_100',
        }); // load an initial symbol
    }

    CIQ.UI.begin();
    stxx.setStyle('stx_line_chart', 'color', '#4DAFEE'); // TODO => why is not working in css?

    // CIQ.I18N.setLanguage(stxx, "zh"); // Optionally set a language for the UI, after it has been initialized, and translate.
}

// Range Slider; needs to be created before startUI() is called for custom themes to apply
new CIQ.RangeSlider({ stx: stxx, });

let webComponentsSupported = ('registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template'));

if (webComponentsSupported) {
    startUI();
    resizeScreen();
} else {
    window.addEventListener('WebComponentsReady', () => {
        startUI();
        resizeScreen();
    });
}

$(window).resize(resizeScreen);
