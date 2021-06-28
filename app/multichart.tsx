import { configure } from 'mobx';
import {
    // eslint-disable-line import/no-extraneous-dependencies
    SmartChart,
    // TradeStartLine,
    // TradeEndLine,
    ChartTypes,
    StudyLegend,
    Views,
    CrosshairToggle,
    setSmartChartsPublicPath,
    Timeperiod,
    ChartSize,
    DrawTools,
    ChartSetting,
    Share,
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '@binary-com/smartcharts' or it... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
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
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {isMobile ? '' : <CrosshairToggle />}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ChartTypes />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <StudyLegend />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <DrawTools />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Views />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Share />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Timeperiod />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {isMobile ? '' : <ChartSize />}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ChartSetting />
    </>
);

const requestAPI = connectionManager.send.bind(connectionManager);
const requestSubscribe = streamManager.subscribe.bind(streamManager);
const requestForget = streamManager.forget.bind(streamManager);

const App = () => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <div className='grid'>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <div className='chart-instance'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <SmartChart
                onSymbolChange={(symbol: any) => console.log('Symbol has changed to:', symbol)}
                isMobile={isMobile}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
            />
        </div>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <div className='side-chart'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <SmartChart
                isMobile={isMobile}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
                id='side'
            />
        </div>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <div className='bottom-chart'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <SmartChart
                chartControlsWidgets={renderControls}
                settings={{ theme: 'dark' }}
                isMobile={isMobile}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
                id='bottom'
            />
        </div>
    </div>
);

// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
ReactDOM.render(<App />, document.getElementById('root'));
