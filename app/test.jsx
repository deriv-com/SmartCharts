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
    Timeperiod,
    ChartSize,
    DrawTools,
    ChartSetting,
    Share,
} from '@binary-com/smartcharts'; // eslint-disable-line import/no-unresolved
import React from 'react';
import ReactDOM from 'react-dom';
import './test.scss';
import './doorbell';
import { ConnectionManager, StreamManager } from './connection';

configure({ enforceActions: true });
const getLanguageStorage = function () {
    const default_language = 'en';
    try {
        const setting_string = CIQ.localStorage.getItem('smartchart-setting'),
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
    state = {
        barrierType: undefined,
        highLow: {},
    };

    onPriceLineDisableChange = (evt) => {
        this.setState({ disablePriceLines: evt.target.checked });
    };


    onHighLowChange = (evt) => {
        this.setState({ highLow: { [evt.target.id]: +evt.target.value } });
    };

    onRelativeChange = (evt) => {
        this.setState({ relative: evt.target.checked });
    };

    handleBarrierChange = (evt) => {
        this.setState({ highLow: evt });
    };

    handleBarrierTypeChange = (evt) => {
        const { value: barrierType } = evt.target;
        const nextState = (barrierType === '') ? { highLow : {} } : {};
        this.setState({ ...nextState, barrierType });
    };

    render() {
        const { barrierType, highLow : { high, low }, disablePriceLines, relative } = this.state;
        const barriers = barrierType ? [{
            shade: barrierType,
            onBarrierChange: this.handleBarrierChange,
            relative,
            // draggable: false,
            lineStyle: 'dotted',
            hidePriceLines: disablePriceLines,
            high,
            low,
        }] : [];
        return (
            <div className="grid">
                <div className="chart-instance">
                    <SmartChart
                        onSymbolChange={symbol => console.log('Symbol has changed to:', symbol)}
                        isMobile={CIQ.isMobile}
                        chartControlsWidgets={renderControls}
                        requestAPI={requestAPI}
                        requestSubscribe={requestSubscribe}
                        requestForget={requestForget}
                        shareOrigin={shareOrigin}
                        barriers={barriers}
                    />
                </div>
                <div className="bottom-blob">
                    <label htmlFor="barrierType">
                        Choose barrier type:&nbsp;
                        <select defaultValue="" id="barrierType" onChange={this.handleBarrierTypeChange}>
                            <option value="NONE_SINGLE">NONE_SINGLE</option>
                            <option value="NONE_DOUBLE">NONE_DOUBLE</option>
                            <option value="ABOVE">ABOVE</option>
                            <option value="BELOW">BELOW</option>
                            <option value="BETWEEN">BETWEEN</option>
                            <option value="OUTSIDE">OUTSIDE</option>
                            <option value="">disable</option>
                        </select>
                        &nbsp;
                        <b>low:</b> <input id="low" type="number" value={low === undefined ? '' : low} onChange={this.onHighLowChange} />,
                        <b>high:</b> <input id="high" type="number" value={high === undefined ? '' : high} onChange={this.onHighLowChange} />;
                        No PriceLine: <input type="checkbox" onChange={this.onPriceLineDisableChange} />
                        Relative: <input type="checkbox" onChange={this.onRelativeChange} />
                    </label>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
