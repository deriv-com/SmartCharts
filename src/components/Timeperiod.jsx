import React, {Component} from 'react';
import contextAware from '../contextAware';
import '../../sass/components/timeperiod.scss';


class Timeperiod extends Component {
    state = { timeperiod: '', open: false };

    onContextReady(context) {
        this.setState({
            timeUnit: this.getTimeUnit(context.stx.layout),
            interval: context.stx.layout.interval,
        });
        this._context = context;
    }

    setPeriodicity(interval, timeUnit) {
        const stx = this._context.stx;

        if(this._context.loader) {
            this._context.loader.show();
        }

        stx.setPeriodicity({period: 1, interval, timeUnit}, () => {
            const isTick = timeUnit === 'second';
            const isCandle = ~['candle','hollow_condle','colored_bar'].indexOf(stx.layout.chartType);
            if (this._context.loader) {
                this._context.loader.hide();
            }
            if( isCandle && isTick ) {
                stx.setChartType('mountain');
            } else if ( !isTick && !isCandle ) {
                stx.setChartType('candle');
            }
        });
        this.setState({
            timeUnit: this.getTimeUnit(stx.layout),
            interval: stx.layout.interval,
            open: false,
        });
    }

    getTimeUnit (layout) {
        if(layout.timeUnit === null && layout.interval === 'day') {
            return 'day';
        } else if(layout.timeUnit === 'minute' && layout.interval % 60 === 0) {
            return 'hour';
        } else if(layout.timeUnit === 'second') {
            return 'tick';
        } else {
            return layout.timeUnit;
        }
    }

    Interval () {
        const interval = this.state.interval;
        if(interval % 60 === 0) {
            return interval/60;
        }

        return +interval ? interval : 1;
    }

    Toggle () {
        this.setState({open: !this.state.open});
    }

    render() {
        return (
            <cq-menu class='ciq-menu ciq-period'>
                <div>
                    <span>
                        <span className="icon"></span>
                        <span className="unit_display">{this.state.timeUnit}</span>
                        <span className="interval_display">{this.Interval()}</span>
                    </span>
                </div>
                <cq-menu-dropdown class="dropdown timePeriod">
                    <div className="timeUnit">
                        <span className={this.state.timeUnit === 'tick' ? 'selected' : ''}>Tick</span>
                        <span className={this.state.timeUnit === 'minute' ? 'selected' : ''}>Minute</span>
                        <span className={this.state.timeUnit === 'hour' ? 'selected' : ''}>Hour</span>
                        <span className={this.state.timeUnit === 'day' ? 'selected' : ''}>Day</span>
                    </div>
                    <div className="interval">
                        <div className="row">
                            <span
                                onClick={() => this.setPeriodicity(1, 'second')}
                                className={this.state.timeUnit === 'tick' && this.state.interval === 1 ? 'selected' : ''}
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
