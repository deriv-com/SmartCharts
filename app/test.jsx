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
    setSmartChartsPublicPath,
    Share,
    ChartTitle,
    AssetInformation,
    ComparisonList,
    logEvent,
    LogCategories,
    LogActions,
    Marker,
} from '@binary-com/smartcharts'; // eslint-disable-line import/no-unresolved
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'url-search-params-polyfill';
import { configure } from 'mobx';
import './app.scss';
import './test.scss';
import whyDidYouRender  from '@welldone-software/why-did-you-render';
import { ConnectionManager, StreamManager } from './connection';
import Notification from './Notification.jsx';
import ChartNotifier from './ChartNotifier.js';
import ChartHistory from './ChartHistory.jsx';

setSmartChartsPublicPath('./dist/');

const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');

if (process.env.NODE_ENV !== 'production') {
    whyDidYouRender(React, {
        collapseGroups: true,
        include: [/.*/],
        exclude: [/^RenderInsideChart$/, /^inject-/],
    });
}

const trackJSDomains = ['binary.com', 'binary.me'];
window.isProductionWebsite = trackJSDomains.reduce((acc, val) => (acc || window.location.host.endsWith(val)), false);

if (window.isProductionWebsite) {
    window._trackJs = { token: '346262e7ffef497d85874322fff3bbf8', application: 'smartcharts' };
    const s = document.createElement('script');
    s.src = 'https://cdn.trackjs.com/releases/current/tracker.js';
    document.body.appendChild(s);
}

/* // PWA support is temporarily removed until its issues can be sorted out
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register(`${window.location.origin + window.location.pathname}sw.js`)
        .then(() => {
            console.log('Service Worker Registered');
        }).catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
        });
}
*/

configure({ enforceActions: 'observed' });

function getLanguageStorage() {
    const default_language = 'en';
    try {
        const setting_string = localStorage.getItem('smartchart-setting'),
            setting = JSON.parse(setting_string !== '' ? setting_string : '{}');

        return setting.language || default_language;
    } catch (e) {
        return default_language;
    }
}

function getServerUrl() {
    const local = localStorage.getItem('config.server_url');
    return `wss://${local || 'ws.binaryws.com'}/websockets/v3`;
}

const chartId = '1';
const appId  = localStorage.getItem('config.app_id') || 12812;
const serverUrl = getServerUrl();
const language = new URLSearchParams(window.location.search).get('l') || getLanguageStorage();
const today = moment().format('YYYY/MM/DD 00:00');
const connectionManager = new ConnectionManager({
    appId,
    language,
    endpoint: serverUrl,
});
const IntervalEnum = {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 24 * 3600,
    year: 365 * 24 * 3600,
};
const activeLanguagesList = ['ID', 'FR', 'IT', 'PT', 'DE'];

const streamManager = new StreamManager(connectionManager);
const requestAPI = connectionManager.send.bind(connectionManager);
const requestSubscribe = streamManager.subscribe.bind(streamManager);
const requestForget = streamManager.forget.bind(streamManager);

class App extends Component {
    startingLanguage = 'en';

    constructor(props) {
        super(props);
        this.notifier = new ChartNotifier();
        const layoutString = localStorage.getItem(`layout-${chartId}`),
            layout = JSON.parse(layoutString !== '' ? layoutString : '{}');
        let chartType;
        let isChartTypeCandle;
        let granularity = 0;
        let endEpoch;
        let settings = createObjectFromLocalStorage('smartchart-setting');
        const activeLanguage = new URLSearchParams(window.location.search).get('activeLanguage') === 'true';

        if (settings) {
            settings.language = language;
            this.startingLanguage = settings.language;
        } else {
            settings = { language };
        }
        settings.activeLanguages = activeLanguage ? activeLanguagesList : null;
        if (settings.historical) {
            this.removeAllComparisons();
            endEpoch = (new Date(`${today}:00Z`).valueOf() / 1000);
            chartType = 'line';
            isChartTypeCandle = false;
            if (layout) {
                granularity = layout.timeUnit === 'second' ? 0 : parseInt(layout.interval * IntervalEnum[layout.timeUnit], 10);

                if (layout.chartType === 'candle' && layout.aggregationType !== 'ohlc') {
                    chartType = layout.aggregationType;
                } else {
                    chartType = layout.chartType;
                }

                if (['mountain', 'line', 'colored_line', 'spline', 'baseline'].indexOf(chartType) === -1) {
                    isChartTypeCandle = true;
                }
            }
        }

        connectionManager.on(
            ConnectionManager.EVENT_CONNECTION_CLOSE,
            () => this.setState({ isConnectionOpened: false }),
        );
        connectionManager.on(
            ConnectionManager.EVENT_CONNECTION_REOPEN,
            () => this.setState({ isConnectionOpened: true }),
        );

        this.state = {
            settings,
            endEpoch,
            chartType,
            isChartTypeCandle,
            granularity,
            activeLanguage,
            isConnectionOpened: true,
            highLow: {},
            barrierType: '',
            draggable: true,
            markers: [],
            crosshairState: 1,
        };
    }

    /*
    shouldComponentUpdate(nextProps, nextState) {
        return this.state.symbol !== nextState.symbol
            || JSON.stringify(this.state.settings) !== JSON.stringify(nextState.settings);
    }
    */
    removeAllComparisons = () => {
        try {
            const layoutString = localStorage.getItem(`layout-${chartId}`),
                layout = JSON.parse(layoutString !== '' ? layoutString : '{}');

            layout.symbols.splice(1, layout.symbols.length - 1);
            localStorage.setItem(`layout-${chartId}`, JSON.stringify(layout));
        } catch (e) {
            console.log(e);
        }
    }

    symbolChange = (symbol) => {
        logEvent(LogCategories.ChartTitle, LogActions.MarketSelector, symbol);
        this.notifier.removeByCategory('activesymbol');
        this.setState({ symbol });
    };

    saveSettings = (settings) => {
        const prevSetting = this.state.settings;
        console.log('settings updated:', settings);
        localStorage.setItem('smartchart-setting', JSON.stringify(settings));


        if (!prevSetting.historical && settings.historical) {
            this.setState({
                chartType: 'mountain',
                isChartTypeCandle: false,
                granularity: 0,
                endEpoch: (new Date(`${today}:00Z`).valueOf() / 1000),
            });
            this.removeAllComparisons();
        } else if (!settings.historical) {
            this.handleDateChange('');
        }

        this.setState({ settings });
        if (this.startingLanguage !== settings.language) {
            // Place language in URL:
            const { origin, search, pathname } = window.location;
            const url = new URLSearchParams(search);
            url.delete('l');
            url.set('l', settings.language);
            url.set('activeLanguage', prevSetting.activeLanguages ? 'true' : 'false');
            window.location.href = `${origin}${pathname}?${url.toString()}`;
        }
    };

    handleDateChange = (value) => {
        this.setState({ endEpoch: (value !== '') ? (new Date(`${value}:00Z`).valueOf() / 1000) : undefined });
    };

    renderTopWidgets = () => (
        <>
            <ChartTitle onChange={this.symbolChange} />
            {this.state.settings.historical ? <ChartHistory onChange={this.handleDateChange} /> : ''}
            <AssetInformation />
            <ComparisonList />
            <Notification
                notifier={this.notifier}
            />
        </>
    );

    renderControls = () => (
        <>
            {isMobile ? '' : (
                <CrosshairToggle
                    isVisible={false}
                    onChange={crosshair => this.setState({ crosshairState: crosshair })}
                />
            )}
            <ChartTypes
                onChange={(chartType, isChartTypeCandle) => {
                    this.setState({
                        chartType,
                        isChartTypeCandle,
                    });
                }}
            />
            <Timeperiod
                onChange={(timePeriod) => {
                    this.setState({
                        granularity: timePeriod,
                    });
                    const isCandle = this.state.isChartTypeCandle;
                    if (isCandle && timePeriod === 0) {
                        this.setState({
                            chartType: 'mountain',
                            isChartTypeCandle: false,
                        });
                    } else if (!isCandle && timePeriod !== 0) {
                        this.setState({
                            chartType: 'candle',
                            isChartTypeCandle: true,
                        });
                    }
                }}
            />
            <StudyLegend />
            {this.state.settings.historical ? '' : <Comparison />}
            <DrawTools />
            <Views />
            <Share />
            {isMobile ? '' : <ChartSize />}
            <ChartSetting />
        </>
    );

    onMessage = (e) => {
        this.notifier.notify(e);
    }

    onPriceLineDisableChange = (evt) => {
        this.setState({ hidePriceLines: evt.target.checked });
    };

    onShadeColorChange = (evt) => {
        this.setState({ shadeColor: evt.target.value });
    }

    onColorChange = (evt) => {
        this.setState({ color: evt.target.value });
    }

    onFGColorChange = (evt) => {
        this.setState({ foregroundColor: evt.target.value });
    }

    onHighLowChange = (evt) => {
        const { highLow } = this.state;

        this.setState({
            highLow: Object.assign(highLow, { [evt.target.id]: +evt.target.value }),
        });
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

    onBarrierTypeChange = (evt) => {
        const { value: barrierType } = evt.target;
        const nextState = (barrierType === '') ? { highLow : {} } : {};
        this.setState({ ...nextState, barrierType });
    };

    onAddMArker = (evt) => {
        let { markers } = this.state;
        markers = [];

        switch (evt.target.value) {
        case 'LINE':
            for (let i = 0; i < 5; i++) {
                markers.push({
                    ts: moment().utc().second(0).subtract(i + 3, 'minutes')
                        .unix(),
                    className: 'chart-marker-line',
                    xPositioner: 'epoch',
                    yPositioner: 'top',
                });
            }
            break;
        case 'CIRCLE':
            for (let i = 0; i < 15; i++) {
                markers.push({
                    ts: moment().utc().second(0).subtract(i + 3, 'minutes')
                        .unix(),
                    className: 'chart-marker-circle',
                    xPositioner: 'epoch',
                    yPositioner: 'value',
                });
            }
            break;
        default:
            markers = [];
        }
        this.setState({ markers });
    }

    onWidget = () => {
        this.setState(prevState => ({ enabledNavigationWidget: !prevState.enabledNavigationWidget }));
    }

    toggleStartEpoch = () => {
        if (this.state.scrollToEpoch) {
            this.setState({
                scrollToEpoch: undefined,
            });
        } else {
            this.setState({
                scrollToEpoch: moment.utc().unix(),
            });
        }
    };

    onLeftOffset = (evt) => {
        this.setState({
            leftOffset: +evt.target.value,
        });
    };

    onActiveLanguage = () => {
        this.setState(prevState => ({
            activeLanguage: !prevState.activeLanguage,
            settings: {
                ...prevState.settings,
                activeLanguages: !prevState.activeLanguage ? activeLanguagesList : null,
            },
        }));
    }

    onLanguage = (evt) => {
        const { settings } = this.state;
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.location.href = `${baseUrl}?l=${evt.target.value}&activeLanguage=${settings.activeLanguages ? 'true' : 'false'}`;
    }

    onCrosshair = (evt) => {
        const value = evt.target.value;
        this.setState({
            crosshairState: value === 'null' ? null : parseInt(value, 10),
        });
    }

    onChartSize = (state) => {
        this.setState({
            zoom: state,
        });

        setTimeout(() => {
            this.setState({
                zoom: 0,
            });
        }, 300);
    }

    onMaxTick = (evt) => {
        const value = evt.target.value;
        this.setState({
            maxTick: value === 'null' ? null : parseInt(value, 10),
        });
    }

    render() {
        const { settings, isConnectionOpened, symbol, endEpoch,
            barrierType, highLow : { high, low }, hidePriceLines,
            draggable, relative, shadeColor, scrollToEpoch,
            leftOffset, color, foregroundColor, markers,
            enabledNavigationWidget, activeLanguage,
            crosshairState, zoom, maxTick } = this.state;
        const barriers = barrierType ? [{
            shade: barrierType,
            shadeColor,
            foregroundColor: foregroundColor || null,
            color: color || (settings.theme === 'light' ? '#39b19d' : '#555975'),
            onChange: this.handleBarrierChange,
            relative,
            draggable,
            lineStyle: 'solid',
            hidePriceLines,
            high,
            low,
        }] : [];

        return (
            <div className="test-container" style={{ diplay: 'block' }}>
                <div className="chart-section">
                    <SmartChart
                        id={chartId}
                        symbol={symbol}
                        isMobile={isMobile}
                        onMessage={this.onMessage}
                        enableRouting
                        enabledNavigationWidget={enabledNavigationWidget}
                        removeAllComparisons={settings.historical}
                        topWidgets={this.renderTopWidgets}
                        chartControlsWidgets={this.renderControls}
                        requestAPI={requestAPI}
                        requestSubscribe={requestSubscribe}
                        requestForget={requestForget}
                        settings={settings}
                        endEpoch={endEpoch}
                        chartType={this.state.chartType}
                        granularity={this.state.granularity}
                        onSettingsChange={this.saveSettings}
                        isConnectionOpened={isConnectionOpened}
                        barriers={barriers}
                        scrollToEpoch={scrollToEpoch}
                        scrollToEpochOffset={leftOffset}
                        crosshairState={crosshairState}
                        zoom={zoom}
                        maxTick={maxTick}
                    >
                        {endEpoch ? (
                            <Marker
                                className="chart-marker-historical"
                                x={endEpoch}
                                xPositioner="epoch"
                                yPositioner="top"
                            ><span>{moment(endEpoch * 1000).utc().format('DD MMMM YYYY - HH:mm')}</span>
                            </Marker>
                        ) : ''}
                        {markers.map(x => (
                            <Marker
                                key={x.ts}
                                className={x.className}
                                x={x.ts}
                                xPositioner={x.xPositioner}
                                yPositioner={x.yPositioner}
                            />
                        ))}
                    </SmartChart>
                </div>
                <div className="action-section">
                    <div className="form-row">
                        Navigation Widget <br />
                        <button type="button" onClick={this.onWidget}>Toggle</button>
                    </div>
                    <div className="form-row">
                        Zoom <br />
                        <button type="button" onClick={() => this.onChartSize(1)}>Zoom in</button>
                        <button type="button" onClick={() => this.onChartSize(-1)}>Zoom out</button>
                    </div>
                    <div className="form-row">
                        Crosshair State <br />
                        <select onChange={this.onCrosshair}>
                            <option value="null">not set</option>
                            <option value="0">state 0</option>
                            <option value="1">state 1</option>
                            <option value="2">state 2</option>
                        </select>
                    </div>
                    <div className="form-row">
                        Max Tick <br />
                        <select onChange={this.onMaxTick}>
                            <option value="null">not set</option>
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="20">20</option>
                        </select>
                    </div>
                    <div className="form-row">
                        Active Language:
                        <button type="button" onClick={this.onActiveLanguage}>{activeLanguage ? 'ON' : 'OFF'}</button>
                    </div>
                    <div className="form-row">
                        Language <br />
                        <select onChange={this.onLanguage}>
                            <option value="">None</option>
                            <option value="en">English</option>
                            <option value="pt">Português</option>
                            <option value="de">Deutsch</option>
                            <option value="fr">French</option>
                            <option value="pl">Polish</option>
                            <option value="ar">Arabic(not supported)</option>
                        </select>
                    </div>
                    <div className="form-row">
                        Markers <br />
                        <select onChange={this.onAddMArker}>
                            <option value="">None</option>
                            <option value="LINE">Line</option>
                            <option value="CIRCLE">Circle</option>
                        </select>
                    </div>
                    <div className="form-row">
                        barrier type:&nbsp;
                        <select onChange={this.onBarrierTypeChange} defaultValue={barrierType}>
                            <option value="">disable</option>
                            <option value="NONE_SINGLE">NONE_SINGLE</option>
                            <option value="NONE_DOUBLE">NONE_DOUBLE</option>
                            <option value="ABOVE">ABOVE</option>
                            <option value="BELOW">BELOW</option>
                            <option value="BETWEEN">BETWEEN</option>
                            <option value="OUTSIDE">OUTSIDE</option>
                        </select>
                    </div>
                    <div className="form-row">
                        barrier shade bg color:&nbsp;
                        <select onChange={this.onShadeColorChange}>
                            <option value="GREEN">GREEN</option>
                            <option value="RED">RED</option>
                            <option value="YELLOW">YELLOW</option>
                            <option value="ORANGERED">ORANGERED</option>
                            <option value="PURPLE">PURPLE</option>
                            <option value="BLUE">BLUE</option>
                            <option value="DEEPPINK">DEEPPINK</option>
                        </select>
                    </div>
                    <div className="form-row">
                        barrier bg color:&nbsp;
                        <select onChange={this.onColorChange}>
                            <option value="GREEN">GREEN</option>
                            <option value="RED">RED</option>
                            <option value="YELLOW">YELLOW</option>
                            <option value="ORANGERED">ORANGERED</option>
                            <option value="PURPLE">PURPLE</option>
                            <option value="BLUE">BLUE</option>
                            <option value="DEEPPINK">DEEPPINK</option>
                        </select>
                    </div>
                    <div className="form-row">
                        barrier foreground color:<br />
                        <select id="barrierFGColor" onChange={this.onFGColorChange}>
                            <option>NONE</option>
                            <option value="#ffffff">WHITE</option>
                            <option value="#00ff00">GREEN</option>
                            <option value="#ff0000">RED</option>
                            <option value="#000000">BLACK</option>
                        </select>
                    </div>
                    <div className="form-row">
                        <b>low:</b> <input id="low" type="number" value={low === undefined ? '' : low} onChange={this.onHighLowChange} />
                    </div>
                    <div className="form-row">
                        <b>high:</b> <input id="high" type="number" value={high === undefined ? '' : high} onChange={this.onHighLowChange} />
                    </div>
                    <div className="form-row">
                        No PriceLine: <input type="checkbox" checked={hidePriceLines === undefined ? '' : hidePriceLines} onChange={this.onPriceLineDisableChange} />
                    </div>
                    <div className="form-row">
                        Relative: <input type="checkbox" checked={relative === undefined ? '' : relative} onChange={this.onRelativeChange} />
                    </div>
                    <div className="form-row">
                        Draggable: <input type="checkbox" checked={draggable === undefined ? '' : draggable} onChange={this.onDraggableChange} />
                    </div>
                    <div className="form-row">
                        Toggle StartEpoch: <button type="button" onClick={this.toggleStartEpoch}>Toggle</button> <br />
                        LeftOffset(bars): <input type="number" value={leftOffset || 0} onChange={this.onLeftOffset} />
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);
