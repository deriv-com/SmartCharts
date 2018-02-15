/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CIQ from 'chartiq'; // eslint-disable-line

import '../../chartiq/iscroll';
/* css + scss */
import '../../css/stx-chart.css';
import '../../sass/chartiq.scss';

import '../AddOns';
import '../Plugin';

import './Attribution';
import './ChartTitle';
import './Close';
import './ColorPicker';
import './ComparisonList';
import './DrawingToolbar';
import './FibSettingsDialog';
import './Loader';
import './Lookup';
import './Menu';
import './MenuDropDown';
import './Redo';
import './Scroll';
import './ShowRange';
import './StudyContext';
import './StudyDialog';
import './StudyInput';
import './StudyOutput';
import './StudyParameter';
import './Swatch';
import './Toggle';
import './Undo';
import './ViewDialog';
import './Clickable';
import ChartControls from './ChartControls.jsx';
import { MobxProvider, connect } from '../store/Connect';

class Chart extends Component {
    static childContextTypes = { promise: PropTypes.object };

    getChildContext() {
        return { promise: this.props.contextPromise };
    }

    componentDidMount() {
        this.props.init(this.root);
    }

    render() {
        return (
            <cq-context ref={(root) => { this.root = root; }}>
                <cq-color-picker>
                    <cq-colors />
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
                        <div className="chartContainer primary">

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
                                                <cq-filter>OTC Stocks</cq-filter>
                                                <cq-filter>Commodities</cq-filter>
                                                <cq-filter>Volatility Indices</cq-filter>
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
                                        <cq-todays-change /> (<cq-todays-change-pct />)
                                    </cq-change>
                                </cq-chart-price>
                            </cq-chart-title>
                            <cq-comparison cq-marker>
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

export default connect(
    ({chart}) => ({
        contextPromise: chart.contextPromise,
        init: chart.init
    })
)(Chart);

