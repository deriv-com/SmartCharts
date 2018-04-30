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
import ConnectionManager from './connection/ConnectionManager';

const connectionManager = new ConnectionManager({
    appId: 1,
    language: 'en',
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',
});

class App extends React.Component {
    render() {
        return (
            <SmartChart
                onSymbolChange={(symbol) => console.log('Symbol has changed to:', symbol)}
                isMobile={CIQ.isMobile}
                requestAPI={connectionManager.send.bind(connectionManager)}
            >
            </SmartChart>
        );
    }

}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
