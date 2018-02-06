/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CIQ from 'chartiq'; // eslint-disable-line
import StreamManager from './StreamManager';
import Feed from './Feed';
import ActiveSymbolDriver from './ActiveSymbolDriver';
import ConnectionManager from './ConnectionManager';
import Context from './components/ui/Context';

import '../chartiq/html2canvas';
import '../chartiq/iscroll';
/* css + scss */
import '../css/stx-chart.css';
import '../sass/chartiq.scss';

import './AddOns';
import './Plugin';

import './components/Attribution';
import './components/ChartTitle';
import './components/Close';
import './components/ColorPicker';
import './components/Comparison';
import './components/DrawingToolbar';
import './components/FibSettingsDialog';
import './components/Loader';
import './components/Lookup';
import './components/Menu';
import './components/MenuDropDown';
import './components/Redo';
import './components/Scroll';
import './components/ShowRange';
import './components/StudyContext';
import './components/StudyDialog';
import './components/StudyInput';
import './components/StudyOutput';
import './components/StudyParameter';
import './components/Swatch';
import './components/Toggle';
import './components/Undo';
import './components/ViewDialog';
import './components/Clickable';
import ChartControls from './components/ChartControls.jsx';
import PendingPromise from './utils/PendingPromise';
import { TradeEndLine, TradeStartLine } from './draw/DateLine';

class BinaryChartiq extends Component {
    static childContextTypes = { promise: PropTypes.object };

    constructor() {
        super();
        this._contextPromise = new PendingPromise();
    }

    static initConnection() {
        if (BinaryChartiq._connectionManager === undefined) {
            BinaryChartiq._connectionManager = new ConnectionManager({
                appId: 1,
                language: 'en',
                endpoint: 'wss://frontend.binaryws.com/websockets/v3',
            });
            BinaryChartiq._streamManager = new StreamManager(BinaryChartiq._connectionManager);
        }
    }

    static getConnectionManager() {
        BinaryChartiq.initConnection();
        return BinaryChartiq._connectionManager;
    }

    static getStreamManager() {
        BinaryChartiq.initConnection();
        return BinaryChartiq._streamManager;
    }

    getChildContext() {
        return { promise: this._contextPromise };
    }

    componentWillMount() {
        const { id } = this.props;
        this._id = id;
        this._elementId = `binarychartiq-${this._id}`;
        this._containerId = `binarychartiq-container-${this._id}`;
        this._preferenceKey = `binarychartiq-${this._id}-preference`;
        this._layoutKey = `binarychartiq-${this._id}-layout`;
    }

    componentDidMount() {
        let UIContext = null;
        const streamManager = BinaryChartiq.getStreamManager();
        const connectionManager = BinaryChartiq.getConnectionManager();
        const chartNode = $(`#${this._elementId}`);

        const stxx = new CIQ.ChartEngine({
            container: $$$(`#${this._containerId}`),
        });

        // Animation (using tension requires splines.js)
        CIQ.Animation(stxx, { stayPut: true });

        // connect chart to data
        stxx.attachQuoteFeed(new Feed(streamManager, stxx), {
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

        const updateHeight = () => {
            const ciqNode = chartNode.find('.ciq-chart');
            const ciqHeight = ciqNode.height();
            const containerNode = $(`#${this._containerId}`);

            if (ciqNode.hasClass('toolbar-on')) {
                containerNode.height(ciqHeight - 45);
            } else {
                containerNode.height(ciqHeight);
            }
        };

        const resizeScreen = () => {
            if (!UIContext) return;
            updateHeight();
            let sidePanel = chartNode.find('cq-side-panel')[0];
            if (sidePanel) {
                chartNode.find('.ciq-chart-area')
                    .css({ right: `${sidePanel.nonAnimatedWidth()}px` });
                chartNode.find('cq-tradingcentral')
                    .css({ 'margin-right': `${sidePanel.nonAnimatedWidth() + 15}px` });
            }
            stxx.resizeChart();
            if (stxx.slider) stxx.slider.display(stxx.layout.rangeSlider);
        };

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

        const restoreLayout = (stx, cb) => {
            const datum = CIQ.localStorage.getItem(this._layoutKey);
            if (datum === null) return;

            function closure() {
                restoreDrawings(stx, stx.chart.symbol);
                if (cb) cb();
            }

            stx.importLayout(JSON.parse(datum), {
                managePeriodicity: true,
                cb: closure,
            });
        };

        // save the chart's layout when the symbol or layout changes
        const saveLayout = (obj) => {
            const s = JSON.stringify(obj.stx.exportLayout(true));
            CIQ.localStorageSetItem(this._layoutKey, s);
        };

        const saveDrawings = (obj) => {
            let tmp = obj.stx.exportDrawings();
            if (tmp.length === 0) {
                CIQ.localStorage.removeItem(obj.symbol);
            } else {
                CIQ.localStorageSetItem(obj.symbol, JSON.stringify(tmp));
            }
        };

        const restorePreferences = () => {
            let pref = CIQ.localStorage.getItem(this._preferenceKey);
            if (pref) stxx.importPreferences(JSON.parse(pref));
        };

        const savePreferences = () => {
            CIQ.localStorageSetItem(this._preferenceKey, JSON.stringify(stxx.exportPreferences()));
        };

        const retoggleEvents = () => {
            let active = chartNode.find('.stx-markers .ciq-radio.ciq-active');
            active.parent()
                .triggerHandler('stxtap');
        };

        let start,
            end;
        const setupTradeDateLines = () => {
            if (start === undefined) {
                start = new TradeStartLine({ stx: stxx });
                // start.followsCurrentQuote = true;
                end = new TradeEndLine({ stx: stxx });
                end.epoch += 25;
            } else {
                end.epoch = (new Date().getTime() / 1000) + 25;
            }
        };

        stxx.addEventListener('layout', saveLayout);
        stxx.addEventListener('symbolChange', saveLayout);
        stxx.addEventListener('drawing', saveDrawings);
        stxx.addEventListener('newChart', () => {
            retoggleEvents();
            setupTradeDateLines();
        });
        stxx.addEventListener('preferences', savePreferences);

        const startUI = () => {
            stxx.chart.allowScrollPast = false;
            const contextNode = chartNode;
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

            const driver = new ActiveSymbolDriver(connectionManager);

            UIContext.setLookupDriver(driver);

            const symbolLookup = chartNode.find('.ciq-search cq-lookup')[0];
            symbolLookup.setCallback((context, data) => {
                context.changeSymbol(data);
            });

            new CIQ.UI.KeystrokeHub($$$('body'), UIContext, {
                cb: CIQ.UI.KeystrokeHub.defaultHotKeys,
            });

            new CIQ.UI.StudyEdit(null, UIContext);

            let UIStorage = new CIQ.NameValueStore();

            const self = this;
            chartNode.find('.ciq-draw')[0].registerCallback(function (value) {
                const ciqChart = chartNode.find('.ciq-chart')[0];
                if (value) {
                    this.node.addClass('active');
                    CIQ.appendClassName(ciqChart, 'toolbar-on');
                } else {
                    this.node.removeClass('active');
                    CIQ.unappendClassName(ciqChart, 'toolbar-on');
                }
                updateHeight();
                stxx.resizeChart();

                // a little code here to remember what the previous drawing tool was
                // and to re-enable it when the toolbar is reopened
                if (value) {
                    stxx.changeVectorType(this.priorVectorType);
                } else {
                    this.priorVectorType = stxx.currentVectorParameters.vectorType;
                    stxx.changeVectorType('');
                }
            });

            chartNode.find('cq-redo')[0].pairUp(chartNode.find('cq-undo'));

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
            let UIStudyMenu = new CIQ.UI.StudyMenu(chartNode.find('*[cq-studies]'), UIContext, params);
            UIStudyMenu.renderMenu();


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

            this._contextPromise.resolve(UIContext);
            CIQ.UI.begin();
            stxx.setStyle('stx_line_chart', 'color', '#4DAFEE'); // TODO => why is not working in css?

            // CIQ.I18N.setLanguage(stxx, "zh"); // Optionally set a language for the UI, after it has been initialized, and translate.
        };

        // Range Slider; needs to be created before startUI() is called for custom themes to apply
        new CIQ.RangeSlider({ stx: stxx });

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

        $(window)
            .resize(resizeScreen);
    }

    render() {
        return (
            <cq-context id={this._elementId}>
                <cq-color-picker>
                    <cq-colors />
                    <cq-overrides dangerouslySetInnerHTML={{
                        /* TODO: fix this */
                        __html: `
                            <template>
                                <div class="ciq-btn" />
                            </template>
                            `,
                    }}>
                    </cq-overrides>
                </cq-color-picker>
                <cq-loader />
                <div className="ciq-chart-area">
                    <div className="ciq-chart">
                        <cq-toolbar>
                            <cq-menu class="ciq-select">
                                <span cq-current-tool="">Select Tool</span>
                                <cq-menu-dropdown>
                                    <cq-item stxtap="noTool()">None</cq-item>
                                    <cq-item stxtap="clearDrawings()">Clear Drawings</cq-item>
                                    <cq-item stxtap="tool('measure')">Measure</cq-item>
                                    <cq-separator />
                                    <cq-item stxtap="tool('annotation')">Annotation</cq-item>
                                    <cq-item stxtap="tool('average')">Average Line</cq-item>
                                    <cq-item stxtap="tool('callout')">Callout</cq-item>
                                    <cq-item stxtap="tool('channel')">Channel</cq-item>
                                    <cq-item stxtap="tool('continuous')">Continuous</cq-item>
                                    <cq-item stxtap="tool('crossline')">Crossline</cq-item>
                                    <cq-item stxtap="tool('freeform')">Doodle</cq-item>
                                    <cq-item stxtap="tool('ellipse')">Ellipse</cq-item>
                                    <cq-item stxtap="tool('fibonacci')">Fibonacci</cq-item>
                                    <cq-item stxtap="tool('fibarc')">Fib Arc</cq-item>
                                    <cq-item stxtap="tool('fibfan')">Fib Fan</cq-item>
                                    <cq-item stxtap="tool('fibtimezone')">Fib Time Zone</cq-item>
                                    <cq-item stxtap="tool('gannfan')">Gann Fan</cq-item>
                                    <cq-item stxtap="tool('gartley')">Gartley</cq-item>
                                    <cq-item stxtap="tool('horizontal')">Horizontal</cq-item>
                                    <cq-item stxtap="tool('line')">Line</cq-item>
                                    <cq-item stxtap="tool('pitchfork')">Pitchfork</cq-item>
                                    <cq-item stxtap="tool('quadrant')">Quadrant Lines</cq-item>
                                    <cq-item stxtap="tool('ray')">Ray</cq-item>
                                    <cq-item stxtap="tool('rectangle')">Rectangle</cq-item>
                                    <cq-item stxtap="tool('regression')">Regression Line</cq-item>
                                    <cq-item stxtap="tool('segment')">Segment</cq-item>
                                    <cq-item stxtap="tool('arrow')">Shape - Arrow</cq-item>
                                    <cq-item stxtap="tool('check')">Shape - Check</cq-item>
                                    <cq-item stxtap="tool('xcross')">Shape - Cross</cq-item>
                                    <cq-item stxtap="tool('focusarrow')">Shape - Focus</cq-item>
                                    <cq-item stxtap="tool('heart')">Shape - Heart</cq-item>
                                    <cq-item stxtap="tool('star')">Shape - Star</cq-item>
                                    <cq-item stxtap="tool('speedarc')">Speed Resistance Arc</cq-item>
                                    <cq-item stxtap="tool('speedline')">Speed Resistance Line</cq-item>
                                    <cq-item stxtap="tool('timecycle')">Time Cycle</cq-item>
                                    <cq-item stxtap="tool('tirone')">Tirone Levels</cq-item>
                                    <cq-item stxtap="tool('vertical')">Vertical</cq-item>
                                </cq-menu-dropdown>
                            </cq-menu>
                            <cq-toolbar-settings>
                                <cq-fill-color
                                    cq-section
                                    class="ciq-color"
                                    stxbind="getFillColor()"
                                    stxtap="pickFillColor()"
                                >
                                    <span />
                                </cq-fill-color>
                                <div>
                                    <cq-line-color
                                        cq-section
                                        cq-overrides="auto"
                                        class="ciq-color"
                                        stxbind="getLineColor()"
                                        stxtap="pickLineColor()"
                                    >
                                        <span />
                                    </cq-line-color>
                                    <cq-line-style cq-section>
                                        <cq-menu class="ciq-select">
                                            <span cq-line-style="" className="ciq-line ciq-selected" />
                                            <cq-menu-dropdown class="ciq-line-style-menu">
                                                <cq-item stxtap="setLine(1,'solid')">
                                                    <span className="ciq-line-style-option ciq-solid-1" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(3,'solid')">
                                                    <span className="ciq-line-style-option ciq-solid-3" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(5,'solid')">
                                                    <span className="ciq-line-style-option ciq-solid-5" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(1,'dotted')">
                                                    <span className="ciq-line-style-option ciq-dotted-1" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(3,'dotted')">
                                                    <span className="ciq-line-style-option ciq-dotted-3" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(5,'dotted')">
                                                    <span className="ciq-line-style-option ciq-dotted-5" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(1,'dashed')">
                                                    <span className="ciq-line-style-option ciq-dashed-1" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(3,'dashed')">
                                                    <span className="ciq-line-style-option ciq-dashed-3" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(5,'dashed')">
                                                    <span className="ciq-line-style-option ciq-dashed-5" />
                                                </cq-item>
                                                <cq-item stxtap="setLine(0,'none')" class="ciq-none">None</cq-item>
                                            </cq-menu-dropdown>
                                        </cq-menu>
                                    </cq-line-style>
                                </div>
                                <cq-axis-label cq-section>
                                    <div className="ciq-heading">Axis Label:</div>
                                    <span stxtap="toggleAxisLabel()" className="ciq-checkbox ciq-active">
                                        <span />
                                    </span>
                                </cq-axis-label>
                                <cq-annotation cq-section>
                                    <div
                                        stxtap="toggleFontStyle('italic')"
                                        className="ciq-btn"
                                        style={{ fontStyle: 'italic' }}
                                    >I
                                    </div>
                                    <div
                                        stxtap="toggleFontStyle('bold')"
                                        className="ciq-btn"
                                        style={{ fontWeight: 'bold' }}
                                    >B
                                    </div>
                                    <cq-menu class="ciq-select">
                                        <span cq-font-size="">12px</span>
                                        <cq-menu-dropdown class="ciq-font-size">
                                            <cq-item stxtap="setFontSize('8px')">8</cq-item>
                                            <cq-item stxtap="setFontSize('10px')">10</cq-item>
                                            <cq-item stxtap="setFontSize('12px')">12</cq-item>
                                            <cq-item stxtap="setFontSize('13px')">13</cq-item>
                                            <cq-item stxtap="setFontSize('14px')">14</cq-item>
                                            <cq-item stxtap="setFontSize('16px')">16</cq-item>
                                            <cq-item stxtap="setFontSize('20px')">20</cq-item>
                                            <cq-item stxtap="setFontSize('28px')">28</cq-item>
                                            <cq-item stxtap="setFontSize('36px')">36</cq-item>
                                            <cq-item stxtap="setFontSize('48px')">48</cq-item>
                                            <cq-item stxtap="setFontSize('64px')">64</cq-item>
                                        </cq-menu-dropdown>
                                    </cq-menu>
                                    <cq-menu class="ciq-select">
                                        <span cq-font-family="">Default</span>
                                        <cq-menu-dropdown class="ciq-font-family">
                                            <cq-item stxtap="setFontFamily('Default')">Default</cq-item>
                                            <cq-item stxtap="setFontFamily('Helvetica')">Helvetica</cq-item>
                                            <cq-item stxtap="setFontFamily('Courier')">Courier</cq-item>
                                            <cq-item stxtap="setFontFamily('Garamond')">Garamond</cq-item>
                                            <cq-item stxtap="setFontFamily('Palatino')">Palatino</cq-item>
                                            <cq-item stxtap="setFontFamily('Times New Roman')">Times New Roman
                                            </cq-item>
                                        </cq-menu-dropdown>
                                    </cq-menu>
                                </cq-annotation>
                                <cq-clickable
                                    cq-fib-settings
                                    cq-selector="cq-fib-settings-dialog"
                                    cq-method="open"
                                    cq-section
                                >
                                    <span className="ciq-btn">Settings</span>
                                </cq-clickable>
                            </cq-toolbar-settings>
                            <cq-measure>
                                <span className="measureUnlit" id="mMeasure" />
                            </cq-measure>
                            <cq-undo-section>
                                <cq-undo class="ciq-btn">Undo</cq-undo>
                                <cq-redo class="ciq-btn">Redo</cq-redo>
                            </cq-undo-section>
                        </cq-toolbar>
                        <div className="chartContainer" id={`binarychartiq-container-${this._id}`}>

                            <ChartControls />

                            <stx-hu-tooltip>
                                <stx-hu-tooltip-field field="DT">
                                    <stx-hu-tooltip-field-name>Date/Time</stx-hu-tooltip-field-name>
                                    <stx-hu-tooltip-field-value />
                                </stx-hu-tooltip-field>
                                <stx-hu-tooltip-field field="Close">
                                    <stx-hu-tooltip-field-name />
                                    <stx-hu-tooltip-field-value />
                                </stx-hu-tooltip-field>
                            </stx-hu-tooltip>

                            <cq-chart-title cq-marker cq-browser-tab>
                                <cq-menu class="ciq-search">
                                    <cq-lookup cq-keystroke-claim cq-keystroke-default cq-uppercase>
                                        <cq-lookup-input cq-no-close>
                                            <input
                                                id="symbol"
                                                cq-focus=""
                                                type="text"
                                                spellCheck="off"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="off"
                                                name="symbol"
                                                placeholder=""
                                            />
                                            <cq-lookup-icon />
                                        </cq-lookup-input>
                                        <cq-lookup-results>
                                            <cq-lookup-filters cq-no-close>
                                                <cq-filter class="true">All</cq-filter>
                                                <cq-filter>Forex</cq-filter>
                                                <cq-filter>Indices</cq-filter>
                                                <cq-filter>OTC</cq-filter>
                                                <cq-filter>Commodities</cq-filter>
                                                <cq-filter>Volatility</cq-filter>
                                            </cq-lookup-filters>
                                            <cq-scroll />
                                        </cq-lookup-results>
                                    </cq-lookup>
                                </cq-menu>
                                <cq-symbol />
                                <cq-chart-price>
                                    <cq-current-price cq-animate />
                                    <cq-change>
                                        <div className="ico" />
                                        <cq-todays-change />
                                        <cq-todays-change-pct />
                                    </cq-change>
                                </cq-chart-price>
                            </cq-chart-title>
                            <cq-comparison cq-marker>
                                <cq-menu class="cq-comparison-new">
                                    <cq-comparison-add-label class="ciq-no-share">
                                        <cq-comparison-plus />
                                        <span>Compare</span>
                                        <span>...</span>
                                    </cq-comparison-add-label>
                                    <cq-comparison-add>
                                        <cq-comparison-lookup-frame>
                                            <cq-lookup cq-keystroke-claim cq-uppercase>
                                                <cq-lookup-input cq-no-close>
                                                    <input
                                                        type="text"
                                                        cq-focus=""
                                                        spellCheck="off"
                                                        autoComplete="off"
                                                        autoCorrect="off"
                                                        autoCapitalize="off"
                                                        placeholder="Enter Symbol"
                                                    />
                                                    <cq-lookup-icon />
                                                </cq-lookup-input>
                                                <cq-lookup-results>
                                                    <cq-lookup-filters cq-no-close>
                                                        <cq-filter class="true">All</cq-filter>
                                                        <cq-filter>Forex</cq-filter>
                                                        <cq-filter>Indices</cq-filter>
                                                        <cq-filter>OTC</cq-filter>
                                                        <cq-filter>Commodities</cq-filter>
                                                        <cq-filter>Volatility</cq-filter>
                                                    </cq-lookup-filters>
                                                    <cq-scroll />
                                                </cq-lookup-results>
                                            </cq-lookup>
                                        </cq-comparison-lookup-frame>
                                        <cq-swatch cq-no-close />
                                        <span>
                                            <cq-accept-btn class="stx-btn">ADD</cq-accept-btn>
                                        </span>
                                    </cq-comparison-add>
                                </cq-menu>
                                <cq-comparison-key
                                    dangerouslySetInnerHTML={{
                                        /* TODO: fix this */
                                        __html: `
                                <template cq-comparison-item>
                                    <cq-comparison-item>
                                        <cq-comparison-swatch></cq-comparison-swatch>
                                        <cq-comparison-label>AAPL</cq-comparison-label>
                                        <cq-comparison-price cq-animate></cq-comparison-price>
                                        <cq-comparison-loader></cq-comparison-loader>
                                        <div class="stx-btn-ico ciq-close"></div>
                                    </cq-comparison-item>
                                </template>
                                    `,
                                    }}
                                />
                            </cq-comparison>
                            <cq-hu-static>
                                <div>
                                    <div>Price</div>
                                    <cq-hu-price />
                                    <div>Open</div>
                                    <cq-hu-open />
                                    <div>Close</div>
                                    <cq-hu-close />
                                </div>
                                <div>
                                    <div>Vol</div>
                                    <cq-volume-section>
                                        <cq-hu-volume />
                                        <cq-volume-rollup />
                                    </cq-volume-section>
                                    <div>High</div>
                                    <cq-hu-high />
                                    <div>Low</div>
                                    <cq-hu-low />
                                </div>
                            </cq-hu-static>

                        </div>
                    </div>
                </div>


                <cq-attribution
                    dangerouslySetInnerHTML={{
                        /* TODO: fix this */
                        __html: `
                <template>
                    <cq-attrib-container>
                        <cq-attrib-source></cq-attrib-source>&nbsp;
                        <cq-attrib-quote-type></cq-attrib-quote-type>
                    </cq-attrib-container>
                </template>
                `,
                    }}
                />
                <cq-dialog>
                    <cq-view-dialog>
                        <h4>Save View</h4>
                        <div stxtap="close()" className="ciq-icon ciq-close" />
                        <div style={{
                            textAlign: 'center',
                            marginTop: '10px',
                        }}
                        >
                            <i>Enter name of view:</i>
                            <p>
                                <input
                                    spellCheck="false"
                                    autoCapitalize="off"
                                    autoCorrect="off"
                                    autoComplete="off"
                                    maxLength="40"
                                    placeholder="Name"
                                />
                                <br />
                            </p>
                            <span className="ciq-btn" stxtap="save()">Save</span>
                        </div>
                    </cq-view-dialog>
                </cq-dialog>

                <cq-dialog>
                    <cq-study-context>
                        <div stxtap="StudyEdit.edit()">Edit Settings...</div>
                        <div stxtap="StudyEdit.remove()">Delete Study</div>
                    </cq-study-context>
                </cq-dialog>

                <cq-dialog>
                    <cq-fib-settings-dialog>
                        <h4 className="title">Settings</h4>
                        <cq-scroll cq-no-maximize>
                            <cq-fibonacci-settings
                                dangerouslySetInnerHTML={{
                                    /* TODO: fix this */
                                    __html: `
                            <template cq-fibonacci-setting>
                                <cq-fibonacci-setting>
                                    <div class="ciq-heading"></div>
                                    <div class="stx-data">
                                        <input type="checkbox" />
                                    </div>
                                </cq-fibonacci-setting>
                            </template>
                            `,
                                }}
                            />
                        </cq-scroll>
                        <div className="ciq-dialog-cntrls">
                            <div className="ciq-btn" stxtap="close()">Done</div>
                        </div>
                    </cq-fib-settings-dialog>
                </cq-dialog>

                <cq-dialog>
                    <cq-study-dialog>
                        <h4 className="title">Study</h4>
                        <cq-scroll cq-no-maximize>
                            <cq-study-inputs
                                dangerouslySetInnerHTML={{
                                    /* TODO: fix this */
                                    __html: `
                            <template cq-study-input>
                                <cq-study-input>
                                    <div class="ciq-heading"></div>
                                    <div class="stx-data">
                                        <template cq-menu>
                                            <cq-menu class="ciq-select">
                                                <cq-selected></cq-selected>
                                                <cq-menu-dropdown cq-lift></cq-menu-dropdown>
                                            </cq-menu>
                                        </template>
                                    </div>
                                </cq-study-input>
                            </template>
                            `,
                                }}
                            />
                            <hr />
                            <cq-study-outputs
                                dangerouslySetInnerHTML={{
                                    /* TODO: fix this */
                                    __html: `
                            <template cq-study-output>
                                <cq-study-output>
                                    <div class="ciq-heading"></div>
                                    <cq-swatch cq-overrides="auto"></cq-swatch>
                                </cq-study-output>
                            </template>
                            `,
                                }}
                            />
                            <hr />
                            <cq-study-parameters
                                dangerouslySetInnerHTML={{
                                    /* TODO: fix this */
                                    __html: `
                            <template cq-study-parameters>
                                <cq-study-parameter>
                                    <div class="ciq-heading"></div>
                                    <div class="stx-data">
                                        <cq-swatch cq-overrides="auto"></cq-swatch>
                                    </div>
                                </cq-study-parameter>
                            </template>
                            `,
                                }}
                            />
                        </cq-scroll>
                        <div className="ciq-dialog-cntrls">
                            <div className="ciq-btn" stxtap="close()">Done</div>
                        </div>
                    </cq-study-dialog>
                </cq-dialog>

            </cq-context>
        );
    }
}

export default BinaryChartiq;
