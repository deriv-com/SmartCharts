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

const getLanguageStorage = function(){
    let default_language = 'en';
    try {
        let setting_string = CIQ.localStorage.getItem('smartchart-setting'),
            setting = JSON.parse(setting_string !== '' ? setting_string : '{}');

        return setting.language || default_language;
    } catch (e) {
        return default_language;
    }
};

const connectionManager = new ConnectionManager({
    appId: 1,
    language: getLanguageStorage(),
    endpoint: 'wss://frontend.binaryws.com/websockets/v3',
});

class App extends React.Component {
    render() {
        return (
            <SmartChart
                onSymbolChange={(symbol) => console.log('Symbol has changed to:', symbol)}
                isMobile={CIQ.isMobile}
                requestAPI={connectionManager.send.bind(connectionManager)}
                requestSubscribe={connectionManager.subscribe.bind(connectionManager)}
                requestForget={connectionManager.forget.bind(connectionManager)}
            >
            </SmartChart>
        );
    }

}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
