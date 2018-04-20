import {
    SmartChart,
    Barrier,
    TradeStartLine,
    TradeEndLine
} from '@binary-com/smartcharts';
import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';
import './doorbell';

class App extends React.Component {
    render() {
        return (
            <SmartChart
                onSymbolChange={(symbol) => console.log('Symbol has changed to:', symbol)}
                isMobile={false}
            >
            </SmartChart>
        );
    }

}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
