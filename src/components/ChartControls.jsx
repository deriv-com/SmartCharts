import $ from 'jquery';
import React, { Component } from 'react';
import contextAware from '../contextAware';
import ChartTypes from './ChartTypes.jsx';
import Timeperiod from './Timeperiod.jsx';
import './ChartControls.scss';

class  ChartControls extends Component {
    onContextReady(context) {
        let UIHeadsUpStatic = new CIQ.UI.HeadsUp($('cq-hu-static'), context, {
            autoStart: true,
        });
        $('.ciq-HU')[0].registerCallback(function (value) {
            if (value === 'static') {
                UIHeadsUpStatic.begin();
                this.node.addClass('active');
            } else if (value === 'dynamic') {
                /* do nothing */
            } else {
                UIHeadsUpStatic.end();
                this.node.removeClass('active');
            }
        });
        $('cq-views').each(function () {
            this.initialize();
        });
    }
    render() {
        return (
            <div id='chartControls'>
                <div className="icon-toggles ciq-toggles">
                    <cq-toggle class="ciq-CH" cq-member="crosshair">
                        <span></span>
                        <cq-tooltip>Crosshair</cq-tooltip>
                    </cq-toggle>
                    <cq-toggle class="ciq-HU" cq-member="headsUp" cq-toggles="static,null">
                        <span></span>
                        <cq-tooltip>Info</cq-tooltip>
                    </cq-toggle>
                    <cq-toggle class="ciq-draw">
                        <span></span>
                        <cq-tooltip>Draw</cq-tooltip>
                    </cq-toggle>
                </div>
                <ChartTypes />
                <cq-menu class="ciq-menu ciq-studies collapse">
                    <span>Indicators</span>
                    <cq-menu-dropdown cq-no-scroll>
                        <cq-study-legend cq-no-close>
                            <cq-section-dynamic>
                                <cq-heading>Current Indicators</cq-heading>
                                <cq-study-legend-content
                                    dangerouslySetInnerHTML={{ /* TODO: fix this */
                                        __html: `
                                            <template>
                                                <cq-item>
                                                    <cq-label class="click-to-edit"></cq-label>
                                                    <div className="ciq-icon ciq-close"></div>
                                                </cq-item>
                                            </template>`,
                                    }}
                                >
                                </cq-study-legend-content>
                                <cq-placeholder>
                                    <div stxtap="Layout.clearStudies()" className="ciq-btn sm">Clear All</div>
                                </cq-placeholder>
                            </cq-section-dynamic>
                        </cq-study-legend>
                        <cq-scroll cq-studies>
                            <cq-item class="stxTemplate"></cq-item>
                        </cq-scroll>
                    </cq-menu-dropdown>
                </cq-menu>
                <cq-menu class="ciq-menu ciq-views collapse">
                    <span>Templates</span>
                    <cq-menu-dropdown>
                        <cq-views>
                            <cq-views-content
                                dangerouslySetInnerHTML={{ /* TODO: fix this */
                                    __html: `
                                        <template cq-view="">
                                            <cq-item>
                                                <cq-label></cq-label>
                                                <div className="ciq-icon ciq-close"></div>
                                            </cq-item>
                                        </template>`,
                                }}
                            >
                            </cq-views-content>
                            <cq-separator cq-partial></cq-separator>
                            <cq-view-save>
                                <cq-item>
                                    <cq-plus></cq-plus>Save Template</cq-item>
                            </cq-view-save>
                        </cq-views>
                    </cq-menu-dropdown>
                </cq-menu>
                <Timeperiod />
                <div id="chartSize">
                    <span id="zoomOut" className="stx-zoom-out">
                    </span>
                    <span id="zoomIn" className="stx-zoom-in">
                    </span>
                </div>
            </div>
        );
    }
}

export default contextAware(ChartControls);
