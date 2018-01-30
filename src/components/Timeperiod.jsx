import React, {Component} from 'react';
import contextAware from '../contextAware';

function getTimeperiodString (layout) {
    let tpstr = '';
    const timeUnit_str = {
        second: 'Tick',
        minute: 'Min',
    };

    if (layout.timeUnit) {
        if(layout.interval % 60 === 0) {
            tpstr = `${layout.interval/60} Hour`;
        } else {
            tpstr = `${layout.interval} ${timeUnit_str[layout.timeUnit]}`;
        }
    } else { // 1 Day
        tpstr = '1 Day';
    }

    return tpstr;
}

class Timeperiod extends Component {
    state = { timeperiod: '' };

    onContextReady(context) {
        this.setState({timeperiod: getTimeperiodString(context.stx.layout)});
        this._context = context;
    }

    setPeriodicity(interval, timeUnit) {
        const stx = this._context.stx;
        stx.setPeriodicity({period: 1, interval, timeUnit}, () => {
            const isTick = timeUnit === 'second';
            const isCandle = ~['candle','hollow_condle','colored_bar'].indexOf(stx.layout.chartType);

            if( isCandle && isTick ) {
                stx.setChartType('mountain');
            } else if ( !isTick && !isCandle ) {
                stx.setChartType('candle');
            }
        });
        this.setState({timeperiod: getTimeperiodString(stx.layout)});
    }

    render() {
        return (
            <cq-menu class="ciq-menu ciq-period">
                <span>
                    <cq-clickable>{this.state.timeperiod}</cq-clickable>
                </span>
                <cq-menu-dropdown>
                    <cq-item onClick={() => this.setPeriodicity(1, 'second')}>1 Tick</cq-item>
                    <cq-separator></cq-separator>
                    <cq-item onClick={() => this.setPeriodicity(1, 'minute')}>1 Min</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(2, 'minute')}>2 Min</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(3, 'minute')}>3 Min</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(5, 'minute')}>5 Min</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(10, 'minute')}>10 Min</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(15, 'minute')}>15 Min</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(30, 'minute')}>30 Min</cq-item>
                    <cq-separator></cq-separator>
                    <cq-item onClick={() => this.setPeriodicity(60, 'minute')}>1 Hour</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(120, 'minute')}>2 Hour</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(240, 'minute')}>4 Hour</cq-item>
                    <cq-item onClick={() => this.setPeriodicity(480, 'minute')}>8 Hour</cq-item>
                    <cq-separator></cq-separator>
                    <cq-item onClick={() => this.setPeriodicity(1, 'day')}>1 Day</cq-item>
                </cq-menu-dropdown>
            </cq-menu>
        );
    }
}

export default contextAware(Timeperiod);
