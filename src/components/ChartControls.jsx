import React from 'react';
import { connect } from '../store/Connect';
import ChartTypes from './ChartTypes.jsx';
import StudyLegend from './StudyLegend.jsx';
import Comparison from './Comparison.jsx';
import Views from './Views.jsx';
import CrosshairToggle from './CrosshairToggle.jsx';
import Timeperiod from './Timeperiod.jsx';
import ChartSize from './ChartSize.jsx';
import DrawTools from './DrawTools.jsx';
import Download from './Download.jsx';
import '../../sass/components/_chart-controls.scss';


const renderDefaultControls = isMobile => () => (
    <React.Fragment>
        {isMobile ? '' : <CrosshairToggle />}
        <ChartTypes />
        <StudyLegend />
        <Comparison />
        <DrawTools />
        <Views />
        <Download />
        <Timeperiod />
        {isMobile ? '' : <ChartSize />}
    </React.Fragment>
);

const ChartControls = ({
    isMobile,
    hasOpenMenu,
    widgets,
    context,
}) => {
    const Controls =  widgets || renderDefaultControls(isMobile);

    return (
        <div className={`cq-chart-controls ${hasOpenMenu ? ' active' : ''}`}>
            { context ? <Controls /> : null }
        </div>
    );
};

export default connect(({ chart,
    chartType,
    studies,
    comparison,
    drawTools,
    view,
    download,
    timeperiod,
    chartSetting }) => ({
    isMobile: chart.isMobile,
    context: chart.context,
    hasOpenMenu: (
        chartType.menu.open
            || studies.menu.open
            || comparison.menu.open
            || drawTools.menu.open
            || view.menu.open
            || download.menu.open
            || timeperiod.menu.open
            || chartSetting.menu.open
    ),
}))(ChartControls);
