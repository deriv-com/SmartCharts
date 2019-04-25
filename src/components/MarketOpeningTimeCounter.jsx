import React from 'react';
import { displayMilliseconds } from '../utils/index';

export class MarketOpeningTimeCounter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().getTime(),
        };
    }
    componentDidMount() {
        this.timerInterval = setInterval(
            () => this.tick(),
            1000,
        );
    }
    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }
    tick() {
        this.setState({
            time: new Date().getTime(),
        });
    }
    // 86400000 = 24 hour * 60 min * 60s * 1000ms
    render() {
        let timeUntilOpenTime = null;
        const symbolOpenTime = this.props.symbolOpenTime.symbolOpenTime || {};
        const openTime = symbolOpenTime.openTime || null;
        const openTimeIsToday = symbolOpenTime ? symbolOpenTime.isToday : false;
        if (openTime) {
            timeUntilOpenTime = openTimeIsToday
                ? displayMilliseconds(openTime.getTime() - this.state.time) : displayMilliseconds(86400000 - (this.state.time - openTime.getTime()));
        }
        return (
            <span>
                {timeUntilOpenTime}
            </span>
        );
    }
}
