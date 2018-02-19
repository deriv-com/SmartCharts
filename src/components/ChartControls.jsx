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
                    <cq-toggle class="ciq-CH toggle-icon" cq-member="crosshair">
                        <span className='tooltip' tooltip-title='Crosshair'></span>
                    </cq-toggle>
                    <cq-toggle class="ciq-HU toggle-icon" cq-member="headsUp" cq-toggles="static,null">
                        <span className='tooltip' tooltip-title='Info'></span>
                    </cq-toggle>
                    <cq-toggle class="ciq-draw toggle-icon">
                        <span className='tooltip' tooltip-title='Draw'></span>
                    </cq-toggle>
                </div>
                <Timeperiod />
                <ChartSize />
            </div>
        );
    }
}

export default contextAware(ChartControls);
