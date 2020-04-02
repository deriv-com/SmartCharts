import { configure } from 'mobx';
import { // eslint-disable-line import/no-extraneous-dependencies
    SmartChart,
    // TradeStartLine,
    // TradeEndLine,
    ChartTypes,
    StudyLegend,
    Comparison,
    Views,
    CrosshairToggle,
    setSmartChartsPublicPath,
    Timeperiod,
    ChartSize,
    DrawTools,
    ChartSetting,
    Share,
} from '@binary-com/smartcharts'; // eslint-disable-line import/no-unresolved
import React from 'react';
import ReactDOM from 'react-dom';
import './test.scss';
import { ConnectionManager, StreamManager } from './connection';

setSmartChartsPublicPath('./dist/');

configure({ enforceActions: 'observed' });

const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');

const getLanguageStorage = function () {
    const default_language = 'en';
    try {
        const setting_string = localStorage.getItem('smartchart-setting'),
            setting = JSON.parse(setting_string !== '' ? setting_string : '{}');

        return setting.language || default_language;
    } catch (e) {
        return default_language;
    }
};

const connectionManager = new ConnectionManager({
    appId: 12812,
    language: getLanguageStorage(),
    endpoint: 'wss://ws.binaryws.com/websockets/v3',
});

const streamManager = new StreamManager(connectionManager);

const renderControls = () => (
    <>
        {isMobile ? '' : <CrosshairToggle />}
        <ChartTypes />
        <StudyLegend />
        <Comparison />
        <DrawTools />
        <Views />
        <Share />
        <Timeperiod />
        {isMobile ? '' : <ChartSize />}
        <ChartSetting />
    </>
);

const requestAPI = connectionManager.send.bind(connectionManager);
const requestSubscribe = streamManager.subscribe.bind(streamManager);
const requestForget = streamManager.forget.bind(streamManager);

const App = () => (
    <div className="grid">
        <div className="chart-instance">
            <SmartChart
                onSymbolChange={symbol => console.log('Symbol has changed to:', symbol)}
                isMobile={isMobile}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
            />
        </div>
        <div className="side-chart">
            <SmartChart
                isMobile={isMobile}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
                id="side"
            />
        </div>
        <div className="bottom-chart">
            <SmartChart
                chartControlsWidgets={renderControls}
                settings={{ theme: 'dark' }}
                isMobile={isMobile}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
                id="bottom"
            />
        </div>
    </div>
);

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
