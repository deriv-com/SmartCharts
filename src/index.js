import $ from 'jquery';
import StreamManager from './stream-manager';
import Feed from './feed';
import '../js/thirdparty/perfect-scrollbar.jquery';
import '../js/thirdparty/html2canvas';
import '../js/thirdparty/iscroll';

import { CIQ } from '../js/chartiq';

import '../js/addOns';
import '../js/translations';
import '../plugins/tfc/tfc';
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

import ExampleDriver from './ExampleDriver';

window.CIQ = CIQ;

let UIContext;

const _streamManager = StreamManager.buildFor({
    appId: 1,
    language: 'en',
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',
});

const stxx = new CIQ.ChartEngine({
    container: $('#chartContainer')[0],
});

function checkWidth() {
    if ($(window).width() > 700) {
        $('body').removeClass('break-md break-sm').addClass('break-lg');
        $('.icon-toggles').removeClass('sidenav active').addClass('ciq-toggles');
        stxx.layout.sidenav = 'sidenavOff';
        $('#symbol').attr('placeholder', 'Enter Symbol');
        return;
    }
    if ($(window).width() <= 700 && $(window).width() > 584) {
        $('body').removeClass('break-lg break-sm').addClass('break-md');
        $('.icon-toggles').removeClass('sidenav active').addClass('ciq-toggles');
        stxx.layout.sidenav = 'sidenavOff';
        $('#symbol').attr('placeholder', 'Symbol');
        return;
    }
    if ($(window).width() <= 584) {
        $('body').removeClass('break-md break-lg').addClass('break-sm');
        $('.icon-toggles').removeClass('ciq-toggles').addClass('sidenav');
        $('#symbol').attr('placeholder', '');
    }
}

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

// Optionally set a market factory to the chart to make it market hours aware. Otherwise it will operate in 24x7 mode.
// This is required for the simulator, or if you intend to also enable Extended hours trading zones.
stxx.setMarketFactory(CIQ.Market.Symbology.factory);

// Extended hours trading zones -- Make sure this is instantiated before calling startUI as a timing issue with may occur
new CIQ.ExtendedHours({
    stx: stxx,
    filter: true,
});

// Floating tooltip on mousehover
// comment in the following line if you want a tooltip to display when the crosshair toggle is turned on
// This should be used as an *alternative* to the HeadsUP (HUD).
// new CIQ.Tooltip({stx:stxx, ohl:true, volume:true, series:true, studies:true});

// Inactivity timer
new CIQ.InactivityTimer({
    stx: stxx,
    minutes: 30,
});

// Animation (using tension requires splines.js)
// new CIQ.Animation(stxx, {tension:0.3});


function resizeScreen() {
    if (!UIContext) return;
    checkWidth();
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

function savePreferences(obj) {
    CIQ.localStorageSetItem('myChartPreferences', JSON.stringify(stxx.exportPreferences()));
}

function retoggleEvents(obj) {
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
    UIContext = new CIQ.UI.Context(stxx, contextNode);
    let UILayout = new CIQ.UI.Layout(UIContext);
    let UIHeadsUpDynamic = new CIQ.UI.HeadsUp($('cq-hu-dynamic'), UIContext, {
        followMouse: true,
        autoStart: false,
    });
    let UIHeadsUpStatic = new CIQ.UI.HeadsUp($('cq-hu-static'), UIContext, {
        autoStart: true,
    });


    UIContext.changeSymbol = function (data) {
        let stx = this.stx;
        if (this.loader) this.loader.show();
        data.symbol = data.symbol.toUpperCase(); // set a pretty display version


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


    UIContext.setLookupDriver(new ExampleDriver());

    UIContext.UISymbolLookup = $('.ciq-search cq-lookup')[0];
    UIContext.UISymbolLookup.setCallback((context, data) => {
        context.changeSymbol(data);
    });

    let KeystrokeHub = new CIQ.UI.KeystrokeHub($('body'), UIContext, {
        cb: CIQ.UI.KeystrokeHub.defaultHotKeys,
    });

    let UIStudyEdit = new CIQ.UI.StudyEdit(null, UIContext);

    let UIStorage = new CIQ.NameValueStore();

    let UIThemes = $('cq-themes');
    UIThemes[0].initialize({
        builtInThemes: {
            'ciq-day': 'Day',
            'ciq-night': 'Night',
        },
        defaultTheme: 'ciq-night',
        nameValueStore: UIStorage,
    });

    let sidePanel = $('cq-side-panel')[0];
    if (sidePanel) sidePanel.registerCallback(resizeScreen);

    $('.ciq-sidenav')[0].registerCallback(function (value) {
        let stx = this.context.stx,
            rightPx;
        let sidePanelWidth = sidePanel ? sidePanel.nonAnimatedWidth() : 0;
        if (value === 'sidenavOn') {
            let chartHolderHeight = $('.stx-holder').height();
            $('.sidenav').height(chartHolderHeight);
            this.node.addClass('active');
            stx.layout.sidenav = 'sidenavOn';
            $('.sidenav').addClass('active');
            rightPx = this.node.width() + sidePanelWidth;
        } else if (value === 'sidenavOff') {
            rightPx = sidePanelWidth;
            $('.sidenav').removeClass('active');
            this.node.removeClass('active');
            stx.layout.sidenav = 'sidenavOff';
        }
        $('cq-side-panel').css('right', `${rightPx - sidePanelWidth}px`);
        $('.ciq-chart-area').css({
            right: `${rightPx}px`,
        });
        $('cq-tradingcentral').css({
            'margin-right': `${rightPx + 15}px`,
        });
        if (stx.slider) stx.slider.display(stx.layout.rangeSlider);
    });

    $('.ciq-HU')[0].registerCallback(function (value) {
        if (value === 'static') {
            UIHeadsUpDynamic.end();
            UIHeadsUpStatic.begin();
            this.node.addClass('active');
        } else if (value === 'dynamic') {
            if (CIQ.isMobile) {
                // The dynamic headsUp doesn't make any sense on mobile devices so we skip that toggle
                // by manually setting the toggle to "static"
                this.set('static');
                UIHeadsUpDynamic.end();
                UIHeadsUpStatic.begin();
                this.node.addClass('active');
            } else {
                UIHeadsUpStatic.end();
                UIHeadsUpDynamic.begin();
                this.node.addClass('active');
            }
        } else {
            UIHeadsUpStatic.end();
            UIHeadsUpDynamic.end();
            this.node.removeClass('active');
        }
    });
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

    if ($('.stx-trade')[0]) {
        $('.stx-trade')[0].registerCallback(function (value) {
            let sidePanel = $('cq-side-panel')[0];
            if (value) {
                sidePanel.open({
                    selector: '.stx-trade-panel',
                    className: 'active',
                });
                this.node.addClass('active');
                $('.stx-trade-panel').removeClass('closed');
                stxx.layout.sidenav = 'sidenavOff'; // in break-sm hide sidenav when turning on tfc side panel
            } else {
                sidePanel.close();
                this.node.removeClass('active');
                $('.stx-trade-panel').addClass('closed');
            }
        });
    }

    if ($('.stx-tradingcentral')[0]) {
        $('.stx-tradingcentral')[0].registerCallback((value) => {
            let tcElement = $('cq-tradingcentral')[0];
            if (value) {
                tcElement.removeAttribute('disabled');
            } else {
                tcElement.setAttribute('disabled', 'disabled');
            }
        });
    }

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
        UIContext.UISymbolLookup.selectItem({
            symbol: 'R_100',
        }); // load an initial symbol
    }

    CIQ.UI.begin();

    // CIQ.I18N.setLanguage(stxx, "zh"); // Optionally set a language for the UI, after it has been initialized, and translate.
}

function hideMarkers() {
    CIQ.Marker.removeByLabel(stxx, 'circle');
    CIQ.Marker.removeByLabel(stxx, 'square');
    CIQ.Marker.removeByLabel(stxx, 'callout');
    CIQ.Marker.removeByLabel(stxx, 'helicopter');
}

function showMarkers(standardType) {
    // Remove any existing markers
    hideMarkers();
    let l = stxx.masterData.length;
    // An example of a data array to drive the marker creation
    let data = [{
        x: stxx.masterData[l - 5].DT,
        type: standardType,
        category: 'news',
        headline: 'This is a Marker for a News Item',
    },
    {
        x: stxx.masterData[l - 15].DT,
        type: standardType,
        category: 'earningsUp',
        headline: 'This is a Marker for Earnings (+)',
    },
    {
        x: stxx.masterData[l - 25].DT,
        type: standardType,
        category: 'earningsDown',
        headline: 'This is a Marker for Earnings (-)',
    },
    {
        x: stxx.masterData[l - 35].DT,
        type: standardType,
        category: 'dividend',
        headline: 'This is a Marker for Dividends',
    },
    {
        x: stxx.masterData[l - 45].DT,
        type: standardType,
        category: 'filing',
        headline: 'This is a Marker for a Filing',
    },
    {
        x: stxx.masterData[l - 55].DT,
        type: standardType,
        category: 'split',
        headline: 'This is a Marker for a Split',
    },
    ];
    let story = 'Like all ChartIQ markers, the object itself is managed by the chart, so when you scroll the chart the object moves with you. It is also destroyed automatically for you when the symbol is changed.';

    // Loop through the data and create markers
    for (let i = 0; i < data.length; i++) {
        let datum = data[i];
        datum.story = story;
        let params = {
            stx: stxx,
            label: standardType,
            xPositioner: 'date',
            x: datum.x,
            // chartContainer: true, // Allow markers to float out of chart. Set css .stx-marker{ z-index:20}
            node: new CIQ.Marker.Simple(datum),
        };

        let marker = new CIQ.Marker(params);
    }
    stxx.draw();
}


// Range Slider; needs to be created before startUI() is called for custom themes to apply
new CIQ.RangeSlider({
    stx: stxx,
});

let webComponentsSupported = ('registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template'));

if (webComponentsSupported) {
    startUI();
    resizeScreen();
} else {
    window.addEventListener('WebComponentsReady', (e) => {
        startUI();
        resizeScreen();
    });
}


$('.stx-markers cq-item.circle').stxtap(() => {
    $('.stx-markers .ciq-radio').removeClass('ciq-active');
    $('.stx-markers cq-item.circle .ciq-radio').addClass('ciq-active');
    showMarkers('circle');
});
$('.stx-markers cq-item.square').stxtap(() => {
    $('.stx-markers .ciq-radio').removeClass('ciq-active');
    $('.stx-markers cq-item.square .ciq-radio').addClass('ciq-active');
    showMarkers('square');
});
$('.stx-markers cq-item.callout').stxtap(() => {
    $('.stx-markers .ciq-radio').removeClass('ciq-active');
    $('.stx-markers cq-item.callout .ciq-radio').addClass('ciq-active');
    showMarkers('callout');
});
$('.stx-markers cq-item.abstract').stxtap(() => {
    $('.stx-markers .ciq-radio').removeClass('ciq-active');
    $('.stx-markers cq-item.abstract .ciq-radio').addClass('ciq-active');
    hideMarkers();
    let helicopter = $('.stx-marker.abstract').clone();
    helicopter.css({
        'z-index': '30',
        left: `${(0.4 * stxx.chart.width).toString()}px`,
    });
    let marker = new CIQ.Marker({
        stx: stxx,
        xPositioner: 'none',
        yPositioner: 'above_candle',
        label: 'helicopter',
        permanent: true,
        chartContainer: true,
        node: helicopter[0],
    });
    stxx.draw(); // call draw() when you're done adding markers. They will be positioned in batch.
});

$('.stx-markers cq-item.none').stxtap(() => {
    $('.stx-markers .ciq-radio').removeClass('ciq-active');
    $('.stx-markers cq-item.none .ciq-radio').addClass('ciq-active');
    hideMarkers();
});

if (typeof Promise === 'undefined') CIQ.loadScript('js/thirdparty/promise.min.js'); // Necessary for IE and MSFT Edge if you are using sharing (because html2canvas uses promises)
$(window).resize(resizeScreen);
