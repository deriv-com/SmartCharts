/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CIQ from 'chartiq'; // eslint-disable-line

/* css + scss */
import '../../css/stx-chart.css';
import '../../sass/chartiq.scss';
import '../../sass/_ciq-custom.scss';

import '../AddOns';
import '../Plugin';

import './Attribution';
import './Close';
import './ColorPicker';
import './FibSettingsDialog';
import './Loader';
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
import './Undo';
import './ViewDialog';
import './Clickable';
import ChartControls from './ChartControls.jsx';
import ComparisonList from './ComparisonList.jsx';
import SettingsDialog from './SettingsDialog.jsx';
import Toolbar from './Toolbar.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';
import Notification from './Notification.jsx';
import Crosshair from './Crosshair.jsx';
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
        const { DrawToolsSettingsDialog, StudySettingsDialog } = this.props;
        return (
            <cq-context ref={(root) => { this.root = root; }}>
                <cq-color-picker>
                    <cq-colors />
                </cq-color-picker>
                <cq-loader />
                <div className="ciq-chart-area">
                    <div className="ciq-chart">
                        <div className='beta-version'>Beta Version 0.1.7</div>
                        <Toolbar />
                        <div className="cq-top-ui-widgets">
                            <ChartTitle />
                            <AssetInformation />
                            <ComparisonList />
                        </div>
                        <ChartControls />
                        <Crosshair />
                        <div className="chartContainer primary"> </div>
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

                <DrawToolsSettingsDialog />
                <StudySettingsDialog />
                <Notification />
            </cq-context>
        );
    }
}

export default connect(
    ({chart, drawTools, studies}) => ({
        contextPromise: chart.contextPromise,
        init: chart.init,
        StudySettingsDialog : studies.settingsDialog.connect(SettingsDialog),
        DrawToolsSettingsDialog : drawTools.settingsDialog.connect(SettingsDialog),
    })
)(Chart);
