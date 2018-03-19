/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import $ from 'jquery';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import CIQ from 'chartiq'; // eslint-disable-line
import RenderInsideChart from './RenderInsideChart.jsx';
import ComparisonList from './ComparisonList.jsx';
import ChartTitle from './ChartTitle.jsx';
import AssetInformation from './AssetInformation.jsx';
import Loader from './Loader.jsx'

/* css + scss */
import '../../sass/chartiq.scss';
import '../../sass/_ciq-custom.scss';

import '../AddOns';
import '../Plugin';
import './ui';

/* To do convert this to jsx*/
// import './Loader';
import ChartControls from './ChartControls.jsx';
import SettingsDialog from './SettingsDialog.jsx';
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
                <div className="ciq-chart-area">
                    <div className="ciq-chart">
                        <div className='beta-version'>Beta Version</div>
                        <RenderInsideChart>
                            <div className="cq-top-ui-widgets">
                                <ChartTitle />
                                <AssetInformation />
                                <ComparisonList />
                            </div>
                        </RenderInsideChart>
                        <ChartControls />
                        <Crosshair />
                        <div className="chartContainer primary"> </div>
                        <Loader />
                    </div>
                </div>
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
