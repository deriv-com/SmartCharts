import React, { Component } from 'react';
import { connect } from '../store/Connect';
import ChartTypes from './ChartTypes.jsx';
import StudyLegend from './StudyLegend.jsx';
import Comparison from './Comparison.jsx';
import Views from './Views.jsx';
import CrosshairToggle from './CrosshairToggle.jsx';
import Timeperiod from './Timeperiod.jsx';
import ChartSize from './ChartSize.jsx';
import DrawTools from './DrawTools.jsx';
import ChartSetting from './ChartSetting.jsx';
import Share from './Share.jsx';

class ChartControls extends Component {
    render(){
        const { isMobile , hasOpenMenu } = this.props;

        return (
            <div className={`cq-chart-controls ${hasOpenMenu ? ' active' : ''}`}>
                {isMobile ? '' : <CrosshairToggle />}
                <ChartTypes /> 
                <StudyLegend />
                <Comparison />
                <DrawTools />
                <Views />
                <Share />
                <Timeperiod />
                <ChartSize />
                <ChartSetting />
            </div>
        ) 
    }
}

export default connect(
    ({chart,
    chartType,
    studies,
    comparison,
    drawTools,
    view,
    share,
    timeperiod,
    chartSetting }) => ({
        isMobile: chart.isMobile,
        hasOpenMenu: ( 
            chartType.menu.open ||
            studies.menu.open ||
            comparison.menu.open ||
            drawTools.menu.open ||
            view.menu.open ||
            share.menu.open ||
            timeperiod.menu.open ||
            chartSetting.menu.open
        )
    })
)(ChartControls);