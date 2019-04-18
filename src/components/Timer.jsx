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
    render() {
        console.log(this.props.symbolOpenTime.symbolOpenTime);
        const until = () => {
            const until = this.props.symbolOpenTime.symbolOpenTime - this.state.time;
            while (until < 0) {

            }
        };

        return (
            <p className="App-clock">
                {/* The time is {this.props.symbolOpenTime.symbolOpenTime - this.state.time} */}
            </p>
        );
    }
}
