import {
    SmartChart,
    Barrier,
    TradeStartLine,
    TradeEndLine
} from '@binary-com/smartcharts';
import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            barrier: true,
            tradeLines: true
        };
        // setInterval(() => this.setState({barrier: !this.state.barrier}), 3000);
        // setInterval(() => this.setState({tradeLines: !this.state.tradeLines}), 2500);
    }

    render() {
        return (
            <SmartChart
                onSymbolChange={(symbol) => console.log('Symbol has changed to:', symbol)}
                isMobile={false}
            >
            </SmartChart>
        );
    }

};

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
