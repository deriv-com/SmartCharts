import $ from 'jquery';
import React, { Component } from 'react';
import contextAware from '../contextAware';
import ChartTypes from './ChartTypes.jsx';
import StudyLegend from './StudyLegend.jsx';
import Timeperiod from './Timeperiod.jsx';
import Comparison from './Comparison.jsx';
import ChartSize from './ChartSize.jsx';
import Views from './Views.jsx';
import Toggles from './Toggles.jsx';

class  ChartControls extends Component {
    onContextReady(context) {
    }
    render() {
        return (
            <div id='chartControls'>
                <ChartTypes />
                <StudyLegend />
                <Comparison />
                <Views />
                <Toggles />
                <Timeperiod />
                <ChartSize />
            </div>
        );
    }
}

export default contextAware(ChartControls);
