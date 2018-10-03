import { // eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved
    SmartChart,
    ChartTypes,
    StudyLegend,
    Comparison,
    Views,
    CrosshairToggle,
    Timeperiod,
    ChartSize,
    DrawTools,
    ChartSetting,
    createObjectFromLocalStorage,
    Share,
    ChartTitle,
    AssetInformation,
    ComparisonList,
} from '@binary-com/smartcharts'; // eslint-disable-line import/no-unresolved
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { configure } from 'mobx';
import './app.scss';
import './doorbell';
import { ConnectionManager, StreamManager } from './connection';
import Notification from './Notification.jsx';
import ChartNotifier from './ChartNotifier.js';


if (window.location.host.endsWith('binary.com')) {
    window._trackJs = { token: '346262e7ffef497d85874322fff3bbf8', application: 'smartcharts' };
    const s = document.createElement('script');
    s.src = 'https://cdn.trackjs.com/releases/current/tracker.js';
    document.body.appendChild(s);
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${window.location.origin + window.location.pathname}sw.js`)
        .then(() => {
            console.log('Service Worker Registered');
        }).catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
}

configure({ enforceActions: 'observed' });

function getLanguageStorage() {
    const default_language = 'en';
    try {
        const setting_string = CIQ.localStorage.getItem('smartchart-setting'),
            setting = JSON.parse(setting_string !== '' ? setting_string : '{}');

        return setting.language || default_language;
    } catch (e) {
        return default_language;
    }
}

function getServerUrl() {
    const local = CIQ.localStorage.getItem('config.server_url');
    return `wss://${local || 'ws.binaryws.com'}/websockets/v3`;
}

const chartId = '1';
const appId  = CIQ.localStorage.getItem('config.app_id') || 12812;
const serverUrl = getServerUrl();
const language = new URLSearchParams(window.location.search).get('l') || getLanguageStorage();

const connectionManager = new ConnectionManager({
    appId,
    language,
    endpoint: serverUrl,
});

const streamManager = new StreamManager(connectionManager);
const requestAPI = connectionManager.send.bind(connectionManager);
const requestSubscribe = streamManager.subscribe.bind(streamManager);
const requestForget = streamManager.forget.bind(streamManager);

class App extends Component {
    startingLanguage = 'en';

    constructor(props) {
        super(props);
        this.notifier = new ChartNotifier();
        let settings = createObjectFromLocalStorage('smartchart-setting');
        if (settings) {
            settings.language = language;
            this.startingLanguage = settings.language;
        } else {
            settings = { language };
        }
        connectionManager.on(
            ConnectionManager.EVENT_CONNECTION_CLOSE,
            () => this.setState({ isConnectionOpened: false }),
        );
        connectionManager.on(
            ConnectionManager.EVENT_CONNECTION_REOPEN,
            () => this.setState({ isConnectionOpened: true }),
        );
        this.state = { settings, isConnectionOpened: true };
    }

    symbolChange = (symbol) => {
        this.notifier.removeByCategory('activesymbol');
        this.setState({ symbol });
    };

    saveSettings = (settings) => {
        console.log('settings updated:', settings);
        CIQ.localStorageSetItem('smartchart-setting', JSON.stringify(settings));

        this.setState({ settings });
        if (this.startingLanguage !== settings.language) {
            // Place language in URL:
            const url = new URL(window.location.href);
            url.searchParams.delete('l');
            url.searchParams.set('l', settings.language);
            window.location.href = url.href;
        }
    };

    renderTopWidgets = () => (
        <>
            <ChartTitle onChange={this.symbolChange} />
            <AssetInformation />
            <ComparisonList />
            <Notification
                notifier={this.notifier}
            />
        </>
    );

    renderControls = () => (
        <>
            {CIQ.isMobile ? '' : <CrosshairToggle />}
            <ChartTypes />
            <Timeperiod />
            <StudyLegend />
            <Comparison />
            <DrawTools />
            <Views />
            <Share />
            {CIQ.isMobile ? '' : <ChartSize />}
            <ChartSetting />
        </>
    );

    render() {
        const { settings, isConnectionOpened, symbol } = this.state;

        return (
            <SmartChart
                id={chartId}
                symbol={symbol}
                onMessage={e => this.notifier.notify(e)}
                isMobile={CIQ.isMobile}
                enableRouting
                topWidgets={this.renderTopWidgets}
                chartControlsWidgets={this.renderControls}
                requestAPI={requestAPI}
                requestSubscribe={requestSubscribe}
                requestForget={requestForget}
                settings={settings}
                onSettingsChange={this.saveSettings}
                isConnectionOpened={isConnectionOpened}
            />
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
