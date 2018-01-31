import React, {Component} from 'react';
import contextAware from '../contextAware';
import '../../sass/components/timeperiod.scss';

function getTimeperiodString (layout) {
    const timeUnit_str = {
        second: 'Tick',
        minute: 'Min',
        hour: 'Hour',
        day: 'Day',
    };
    const interval = layout.interval % 60 === 0
        ? layout.interval/60 : +layout.interval ? layout.interval : 1;

    return `${interval} ${timeUnit_str[getTimeUnit(layout)]}`;
}

function getTimeUnit (layout) {
    if(layout.timeUnit === null && layout.interval === 'day') {
        return 'day';
    } else if(layout.timeUnit === 'minute' && layout.interval % 60 === 0) {
        return 'hour';
    } else {
        return layout.timeUnit;
    }
}

class Timeperiod extends Component {
    state = { timeperiod: '' };

    onContextReady(context) {
        this.setState({
            timeperiod: getTimeperiodString(context.stx.layout),
            timeUnit: getTimeUnit(context.stx.layout),
            interval: context.stx.layout.interval,
        });
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
        this.setState({
            timeperiod: getTimeperiodString(stx.layout),
            timeUnit: getTimeUnit(stx.layout),
            interval: stx.layout.interval,
        });
    }

    render() {
        return (
            <cq-menu class="ciq-menu ciq-period">
                <span>
                    <cq-clickable>{this.state.timeperiod}</cq-clickable>
                </span>
                <cq-menu-dropdown class="dropdown timePeriod">
                    <div className="timeUnit">
                        <span className={this.state.timeUnit === 'second' ? 'selected' : ''}>Tick</span>
                        <span className={this.state.timeUnit === 'minute' ? 'selected' : ''}>Minute</span>
                        <span className={this.state.timeUnit === 'hour' ? 'selected' : ''}>Hour</span>
                        <span className={this.state.timeUnit === 'day' ? 'selected' : ''}>Day</span>
                    </div>
                    <div className="interval">
                        <div className="row">
                            <span
                                onClick={() => this.setPeriodicity(1, 'second')}
                                className={this.state.timeUnit === 'second' && this.state.interval === 1 ? 'selected' : ''}
                            >1</span>
                        </div>
                        <div className="row">
                            <span
                                onClick={() => this.setPeriodicity(1, 'minute')}
                                className={this.state.timeUnit === 'minute' && this.state.interval === 1 ? 'selected' : ''}
                            >1</span>
                            <span
                                onClick={() => this.setPeriodicity(2, 'minute')}
                                className={this.state.interval === 2 ? 'selected' : ''}
                            >2</span>
                            <span
                                onClick={() => this.setPeriodicity(3, 'minute')}
                                className={this.state.interval === 3 ? 'selected' : ''}
                            >3</span>
                            <span
                                onClick={() => this.setPeriodicity(5, 'minute')}
                                className={this.state.interval === 5 ? 'selected' : ''}
                            >5</span>
                            <span
                                onClick={() => this.setPeriodicity(10, 'minute')}
                                className={this.state.interval === 10 ? 'selected' : ''}
                            >10</span>
                            <span
                                onClick={() => this.setPeriodicity(15, 'minute')}
                                className={this.state.interval === 15 ? 'selected' : ''}
                            >15</span>
                            <span
                                onClick={() => this.setPeriodicity(30, 'minute')}
                                className={this.state.interval === 30 ? 'selected' : ''}
                            >30</span>
                        </div>
                        <div className="row">
                            <span
                                onClick={() => this.setPeriodicity(60, 'minute')}
                                className={this.state.interval === 60 ? 'selected' : ''}
                            >1</span>
                            <span
                                onClick={() => this.setPeriodicity(120, 'minute')}
                                className={this.state.interval === 120 ? 'selected' : ''}
                            >2</span>
                            <span
                                onClick={() => this.setPeriodicity(240, 'minute')}
                                className={this.state.interval === 240 ? 'selected' : ''}
                            >4</span>
                            <span
                                onClick={() => this.setPeriodicity(480, 'minute')}
                                className={this.state.interval === 480 ? 'selected' : ''}
                            >8</span>
                        </div>
                        <div className="row">
                        <span
                            onClick={() => this.setPeriodicity(1, 'day')}
                            className={this.state.timeUnit === 'day' ? 'selected' : ''}
                        >1</span>
                        </div>
                    </div>
                </cq-menu-dropdown>
            </cq-menu>
        );
    }
}

export default contextAware(Timeperiod);
