import $ from 'jquery';
import React, { Component } from 'react';
import contextAware from '../contextAware';
import ChartTypes from './ChartTypes.jsx';
import StudyLegend from './StudyLegend.jsx';
import Timeperiod from './Timeperiod.jsx';
import Comparison from './Comparison.jsx';
import ChartSize from './ChartSize.jsx';
import Views from './Views.jsx';

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
    }
    render() {
        return (
            <div id='chartControls'>
                <ChartTypes />
                <StudyLegend />
                <Comparison />
                <Views />
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
                <Timeperiod />
                <ChartSize />
            </div>
        );
    }
}

export default contextAware(ChartControls);
