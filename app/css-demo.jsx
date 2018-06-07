import { // eslint-disable-line import/no-extraneous-dependencies
    SmartChart,
    // Barrier,
    // TradeStartLine,
    // TradeEndLine,
    ChartTypes,
    StudyLegend,
    Comparison,
    Views,
    CrosshairToggle,
    Timeperiod,
    ChartSize,
    DrawTools,
    ChartSetting,
    Share,
} from '@binary-com/smartcharts';
import React from 'react';
import ReactDOM from 'react-dom';
import './app.scss';
import './doorbell';
import { ConnectionManager, StreamManager } from './connection';

const getLanguageStorage = function () {
    const default_language = 'en';
    try {
        let setting_string = CIQ.localStorage.getItem('smartchart-setting'),
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
    <React.Fragment>
        {CIQ.isMobile ? '' : <CrosshairToggle />}
        <ChartTypes />
        <StudyLegend />
        <Comparison />
        <DrawTools />
        <Views />
        <Share />
        <Timeperiod />
        {CIQ.isMobile ? '' : <ChartSize />}
        <ChartSetting />
    </React.Fragment>
);

const requestAPI = connectionManager.send.bind(connectionManager);
const requestSubscribe = streamManager.subscribe.bind(streamManager);
const requestForget = streamManager.forget.bind(streamManager);
const shareOrigin = window.location.href.split('?')[0];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            yoyo: false,
        };
        // setInterval(() => this.setState({yoyo: !this.state.yoyo}), 1000);
    }

    render() {
        const { yoyo } = this.state;
        return (
            <div className="grid">
                <div className="chartshit">
                    <SmartChart
                        onSymbolChange={symbol => console.log('Symbol has changed to:', symbol)}
                        isMobile={CIQ.isMobile}
                        chartControlsWidgets={renderControls}
                        requestAPI={requestAPI}
                        requestSubscribe={requestSubscribe}
                        requestForget={requestForget}
                        shareOrigin={shareOrigin}
                    />
                </div>
                <div className={`bottom-blob ${yoyo ? 'yoyo' : ''}`}>
                    <svg className="icon-1">
                        <use href="./dist/smartcharts-spritemap.svg#ic-indices-normal" />
                    </svg>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
