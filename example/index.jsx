import {
    SmartChart,
    Barrier,
    TradeStartLine,
    TradeEndLine
} from 'smartcharts';
import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            barrier: true,
            tradeLines: true
        };
        setInterval(() => this.setState({barrier: !this.state.barrier}), 3000);
        setInterval(() => this.setState({tradeLines: !this.state.tradeLines}), 2500);
    }

    render() {
        return (
            <SmartChart>
                {this.state.barrier ?
                    <Barrier 
                        color='green'
                        shade='above'
                        onBarrierChange={console.warn.bind(console)}
                    /> : null
                }
                {this.state.tradeLines ?
                    <React.Fragment>
                        <TradeEndLine
                            followsCurrentQuote
                        />
                        <TradeStartLine
                            quote={(new Date).getTime() | 0}
                        />
                    </React.Fragment> : null
                }
            </SmartChart>
        );
    }

};

ReactDOM.render(
    <App />,
    document.getElementById('root')
); 
