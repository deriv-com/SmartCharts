import React from 'react';
import { displayMilliseconds } from '../utils/index';

export class Timer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date().getTime(),
        };
    }
    componentDidMount() {
        this.intervalID = setInterval(
            () => this.tick(),
            1000,
        );
    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    tick() {
        this.setState({
            time: new Date().getTime(),
        });
    }
    // 86400000 = 24 hour * 60 min * 60s * 1000ms
    render() {
        return (
            <span>
                {displayMilliseconds(86400000 - (this.state.time - this.props.symbolOpenTime.symbolOpenTime))}
            </span>
        );
    }
}
