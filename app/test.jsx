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

class App extends React.Component {
    state = {
        highLow: {},
        draggable: true,
    };

    onPriceLineDisableChange = (evt) => {
        this.setState({ hidePriceLines: evt.target.checked });
    };

    onColorChange =(evt) => {
        this.setState({ shadeColor: evt.target.value });
    }

    onHighLowChange = (evt) => {
        this.setState({ highLow: { [evt.target.id]: +evt.target.value } });
    };

    onRelativeChange = (evt) => {
        this.setState({ relative: evt.target.checked });
    };

    onDraggableChange = (evt) => {
        this.setState({ draggable: evt.target.checked });
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
        const { barrierType, highLow : { high, low }, hidePriceLines, draggable, relative, shadeColor } = this.state;
        const barriers = barrierType ? [{
            shade: barrierType,
            shadeColor,
            color: '#f44336',
            onChange: this.handleBarrierChange,
            relative,
            draggable,
            lineStyle: 'dotted',
            hidePriceLines,
            high,
            low,
        }] : [];
        return (
            <div className="grid">
                <div className="chart-instance">
                    <SmartChart
                        id="1"
                        onSymbolChange={symbol => console.log('Symbol has changed to:', symbol)}
                        isMobile={CIQ.isMobile}
                        chartControlsWidgets={renderControls}
                        requestAPI={requestAPI}
                        requestSubscribe={requestSubscribe}
                        requestForget={requestForget}
                        barriers={barriers}
                    />
                </div>
                <div>
                    <SmartChart
                        id="2"
                        onSymbolChange={symbol => console.log('Symbol has changed to:', symbol)}
                        isMobile={CIQ.isMobile}
                        chartControlsWidgets={renderControls}
                        requestAPI={requestAPI}
                        requestSubscribe={requestSubscribe}
                        requestForget={requestForget}
                        barriers={barriers}
                    />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
