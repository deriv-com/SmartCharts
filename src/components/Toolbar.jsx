import React from 'react';
import './DrawingToolbar';

const Toolbar = () => {
    return (
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
    );
};

export default Toolbar;
