import React, {Component} from 'react';
import contextAware from '../contextAware';
import '../../sass/components/_chart-size.scss';
import {getTimeUnit} from '../store/utils';

class ChartSize extends Component {
    state = {text: ''};

    onContextReady (context) {
        const func = (data) => {
            const {stx, layout} = data;
            const interval = +layout.interval ? Math.floor(layout.interval / 60) || layout.interval : 1;
            let total = interval * stx.chart.maxTicks;
            let timeUnit = getTimeUnit(layout);
            console.log(total);
            if(total >= 1000) {
                total = Math.round(total/60);
                if(timeUnit === 'minute') {
                    timeUnit = 'hour';
                } else {
                    timeUnit = 'day';
                }
            }
            this.setState({text: `${total} ${timeUnit}s`});
        };

        context.stx.addEventListener('layout', func);
        func({stx: context.stx, layout: context.stx.layout});
    }

    render () {
        return (
            <div id="chartSize">
                <span
                    id='zoomOut'
                >
                </span>
                <span class="interval-title">{this.state.text}</span>
                <span
                    id='zoomIn'
                >
                </span>
            </div>
        );
    }
};

export default contextAware(ChartSize);
