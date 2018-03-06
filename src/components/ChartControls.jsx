import React, { Component } from 'react';
import ChartTypes from './ChartTypes.jsx';
import StudyLegend from './StudyLegend.jsx';
import Comparison from './Comparison.jsx';
import Views from './Views.jsx';
import Toggles from './Toggles.jsx';
import Timeperiod from './Timeperiod.jsx';
import ChartSize from './ChartSize.jsx';
import DrawTools from './DrawTools.jsx';

const ChartControls = () => (
    <div className="cq-chart-controls">
        <Toggles />
        <ChartTypes />
        <StudyLegend />
        <Comparison />
        <DrawTools />
        <Views />
        <Timeperiod />
        <ChartSize />
    </div>
);

export default ChartControls;
