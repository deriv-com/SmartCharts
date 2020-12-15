import React from 'react';
import { displayMilliseconds } from '../utils/index';
import ServerTime from '../utils/ServerTime';

export class MarketOpeningTimeCounter extends React.Component {
    constructor(props) {
        super(props);
        this.serverTime = ServerTime.getInstance();

        this.state = {
            time: this.serverTime.getLocalDate().getTime(),
        };
    }
    componentDidMount() {
        this.timerInterval = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
        clearInterval(this.timerInterval);
    }
    tick() {
        this.setState({
            time: this.serverTime.getLocalDate().getTime(),
        });
    }
    // 86400000 = 24 hour * 60 min * 60s * 1000ms
    render() {
        let timeUntilOpenTime = null;
        const symbolOpenTime = this.props.symbolOpenTime.symbolOpenTime || {};
        const openTime = symbolOpenTime.openTime || null;
        if (openTime) {
            timeUntilOpenTime = displayMilliseconds(openTime.getTime() - this.state.time);
        }
        return <span>{timeUntilOpenTime}</span>;
    }
}
