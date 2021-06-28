import { 
// @ts-expect-error ts-migrate(2307) FIXME: Cannot find module '@binary-com/smartcharts' or it... Remove this comment to see the full error message
// eslint-disable-line import/no-extraneous-dependencies,import/no-unresolved
SmartChart, ChartMode, StudyLegend, Views, DrawTools, createObjectFromLocalStorage, setSmartChartsPublicPath, Share, ChartTitle, logEvent, LogCategories, LogActions, Marker, ToolbarWidget } from '@binary-com/smartcharts'; // eslint-disable-line import/no-unresolved
import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import 'url-search-params-polyfill';
import { configure } from 'mobx';
import './app.scss';
import './test.scss';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { ConnectionManager, StreamManager } from './connection';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Notification.jsx' was resolved to '/User... Remove this comment to see the full error message
import Notification from './Notification.jsx';
import ChartNotifier from './ChartNotifier.js';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartHistory.jsx' was resolved to '/User... Remove this comment to see the full error message
import ChartHistory from './ChartHistory.jsx';
import NetworkMonitor from './connection/NetworkMonitor';
import { MockActiveSymbol, MockTradingTime, masterData } from './initialData';

setSmartChartsPublicPath('./dist/');
const isMobile = window.navigator.userAgent.toLowerCase().includes('mobi');
if (process.env.NODE_ENV === 'production') {
    whyDidYouRender(React, {
        collapseGroups: true,
        include: [/.*/],
        exclude: [/^RenderInsideChart$/, /^inject-/],
    });
}
const trackJSDomains = ['binary.com', 'binary.me'];
(window as any).isProductionWebsite = trackJSDomains.reduce((acc, val) => acc || window.location.host.endsWith(val), false);
if ((window as any).isProductionWebsite) {
    (window as any)._trackJs = { token: '346262e7ffef497d85874322fff3bbf8', application: 'smartcharts' };
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
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
        const setting_string = localStorage.getItem('smartchart-setting'), setting = JSON.parse(setting_string !== '' ? setting_string : '{}');
        return setting.language || default_language;
    }
    catch (e) {
        return default_language;
    }
}
function getServerUrl() {
    const local = localStorage.getItem('config.server_url');
    return `wss://${local || 'ws.binaryws.com'}/websockets/v3`;
}
const parseQueryString = (query: any) => {
    const vars = query.split('&');
    const query_string = {};
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        // If first entry with this name
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        if (typeof query_string[key] === 'undefined') {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        }
        // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        else if (typeof query_string[key] === 'string') {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const arr = [query_string[key], decodeURIComponent(value)];
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            query_string[key] = arr;
            // If third or later entry with this name
        }
        else {
            // @ts-expect-error ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            query_string[key].push(decodeURIComponent(value));
        }
    }
    return query_string;
};
const generateURL = (new_params: any) => {
    const { origin, pathname, search } = window.location;
    const cleanSearch = search.replace('?', '').trim();
    const params = {
        ...(cleanSearch !== '' ? parseQueryString(cleanSearch) : {}),
        ...new_params,
    };
    window.location.href = `${origin}${pathname}?${Object.keys(params)
        .map(key => `${key}=${params[key]}`)
        .join('&')}`;
};
const chartId = '1';
const appId = localStorage.getItem('config.app_id') || 12812;
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
const App = () => {
    const startingLanguageRef = React.useRef('en');
    const settingsRef = React.useRef();
    const openMarketRef = React.useRef();
    const [notifier] = React.useState(new ChartNotifier());
    const [layoutString] = React.useState(localStorage.getItem(`layout-${chartId}`));
    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'string | null' is not assignable... Remove this comment to see the full error message
    const [layout] = React.useState(JSON.parse(layoutString !== '' ? layoutString : '{}'));
    const initialSettings = React.useMemo(() => {
        let _settings = createObjectFromLocalStorage('smartchart-setting');
        const activeLanguage = new URLSearchParams(window.location.search).get('activeLanguage') === 'true';
        if (_settings) {
            _settings.language = language;
            startingLanguageRef.current = _settings.language;
        }
        else {
            _settings = { language };
        }
        _settings.activeLanguages = activeLanguage ? activeLanguagesList : null;
        if (_settings.historical) {
            _settings.isHighestLowestMarkerEnabled = false;
        }
        return _settings;
    }, []);
    const [settings, setSettings] = React.useState(initialSettings);
    settingsRef.current = settings;
    const memoizedValues = React.useMemo(() => {
        let chartType;
        let isChartTypeCandle;
        let granularity = 60;
        let endEpoch;
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        if (settingsRef.current.historical) {
            endEpoch = new Date(`${today}:00Z`).valueOf() / 1000;
            chartType = 'line';
            isChartTypeCandle = false;
            if (layout) {
                granularity =
                    // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
                    layout.timeUnit === 'second' ? 0 : parseInt(layout.interval * IntervalEnum[layout.timeUnit], 10);
                if (layout.chartType === 'candle' && layout.aggregationType !== 'ohlc') {
                    chartType = layout.aggregationType;
                }
                else {
                    chartType = layout.chartType;
                }
                if (['mountain', 'line', 'colored_line', 'spline', 'baseline'].indexOf(chartType) === -1) {
                    isChartTypeCandle = true;
                }
            }
        }
        return {
            chartType,
            granularity,
            endEpoch,
            isChartTypeCandle,
        };
    }, [layout]);
    const [chartType, setChartType] = React.useState(memoizedValues.chartType);
    const [granularity, setGranularity] = React.useState(memoizedValues.granularity);
    const [endEpoch, setEndEpoch] = React.useState(memoizedValues.endEpoch);
    const [isChartTypeCandle, setIsChartTypeCandle] = React.useState(memoizedValues.isChartTypeCandle);
    const [isConnectionOpened, setIsConnectionOpened] = React.useState(true);
    const [networkStatus, setNetworkStatus] = React.useState();
    const [symbol, setSymbol] = React.useState();
    const [relative, setRelative] = React.useState(false);
    const [draggable, setDraggable] = React.useState(true);
    const [highLow, setHighLow] = React.useState({});
    const [barrierType, setBarrierType] = React.useState('');
    const [zoom, setZoom] = React.useState();
    const [maxTick, setMaxTick] = React.useState();
    const [openMarket, setOpenMarket] = React.useState({});
    const [markers, setMarkers] = React.useState([]);
    const [crosshairState, setCrosshairState] = React.useState(1);
    const [leftOffset, setLeftOffset] = React.useState();
    const [scrollToEpoch, setScrollToEpoch] = React.useState();
    const [enableFooter, setEnableFooter] = React.useState(false);
    const [enableScroll, setEnableScroll] = React.useState(false);
    const [enableZoom, setEnableZoom] = React.useState(false);
    const [enableNavigationWidget, setEnableNavigationWidget] = React.useState(false);
    const [foregroundColor, setForegroundColor] = React.useState();
    const [hidePriceLines, setHidePriceLines] = React.useState(false);
    const [shadeColor, setShadeColor] = React.useState();
    const [color, setColor] = React.useState();
    const [refreshActiveSymbols, setRefreshActiveSymbols] = React.useState(false);
    const [activeLanguage, setActiveLanguage] = React.useState(new URLSearchParams(window.location.search).get('activeLanguage') === 'true');
    // @ts-expect-error ts-migrate(2322) FIXME: Type '{}' is not assignable to type 'undefined'.
    openMarketRef.current = openMarket;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'high' does not exist on type '{}'.
    const { high, low } = highLow;
    React.useEffect(() => {
        connectionManager.on(ConnectionManager.EVENT_CONNECTION_CLOSE, () => setIsConnectionOpened(false));
        connectionManager.on(ConnectionManager.EVENT_CONNECTION_REOPEN, () => setIsConnectionOpened(true));
        const networkMonitor = NetworkMonitor.getInstance();
        networkMonitor.init(requestAPI, handleNetworkStatus);
    }, []);
    const [urlParams] = React.useState(parseQueryString(window.location.search.replace('?', '')));
    const [marketsOrder] = React.useState((urlParams as any).marketsOrder || 'null');
    const getMarketsOrder = marketsOrder !== '' && marketsOrder !== 'null' ? () => marketsOrder.split(',') : undefined;
    const [feedCall] = React.useState({
        ...((urlParams as any).feedcall_tradingTimes === 'false' ? { tradingTimes: false } : {}),
        ...((urlParams as any).feedcall_activeSymbols === 'false' ? { activeSymbols: false } : {}),
    });
    const [initialData] = React.useState({
        ...((urlParams as any).initialdata_masterData === 'true' ? { masterData: masterData() } : {}),
        ...((urlParams as any).initialdata_tradingTimes === 'true' ? { tradingTimes: MockTradingTime } : {}),
        ...((urlParams as any).initialdata_activeSymbols === 'true' ? { activeSymbols: MockActiveSymbol } : {}),
    });
    const handleNetworkStatus = (status: any) => setNetworkStatus(status);
    const saveSettings = React.useCallback(newSettings => {
        const prevSetting = settingsRef.current;
        console.log('settings updated:', newSettings);
        localStorage.setItem('smartchart-setting', JSON.stringify(newSettings));
        // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
        if (!prevSetting.historical && newSettings.historical) {
            setChartType('mountain');
            setIsChartTypeCandle(false);
            setGranularity(0);
            setEndEpoch(new Date(`${today}:00Z`).valueOf() / 1000);
        }
        else if (!newSettings.historical) {
            handleDateChange('');
        }
        setSettings(newSettings);
        if (startingLanguageRef.current !== newSettings.language) {
            // Place language in URL:
            const { origin, search, pathname } = window.location;
            const url = new URLSearchParams(search);
            url.delete('l');
            url.set('l', newSettings.language);
            // @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'.
            url.set('activeLanguage', prevSetting.activeLanguages ? 'true' : 'false');
            window.location.href = `${origin}${pathname}?${url.toString()}`;
        }
    }, []);
    const handleDateChange = (value: any) => {
        setEndEpoch(value !== '' ? new Date(`${value}:00Z`).valueOf() / 1000 : undefined);
    };
    const renderTopWidgets = React.useCallback(() => {
        const symbolChange = (newSymbol: any) => {
            logEvent(LogCategories.ChartTitle, LogActions.MarketSelector, newSymbol);
            notifier.removeByCategory('activesymbol');
            setSymbol(newSymbol);
        };
        return (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<React.Fragment>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ChartTitle onChange={symbolChange} open_market={openMarketRef.current} open={!!openMarketRef.current.category} />
                {/* @ts-expect-error ts-migrate(2532) FIXME: Object is possibly 'undefined'. */}
                {!!settingsRef.current.historical && <ChartHistory onChange={handleDateChange} />}
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Notification notifier={notifier} />
</React.Fragment>
);
    }, [notifier]);
    const renderToolbarWidget = React.useCallback(() => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<ToolbarWidget>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ChartMode
portalNodeId='portal-node'
onChartType={(_chartType: any, _isChartTypeCandle: any) => {
            setChartType(_chartType);
            setIsChartTypeCandle(_isChartTypeCandle);
        }}
onGranularity={(timePeriod: any) => {
            setGranularity(timePeriod);
            const isCandle = isChartTypeCandle;
            if (isCandle && timePeriod === 0) {
                setChartType('mountain');
                setIsChartTypeCandle(false);
            }
            else if (!isCandle && timePeriod !== 0) {
                setChartType('candle');
                setIsChartTypeCandle(true);
            }
        }}
                />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <StudyLegend portalNodeId='portal-node' />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Views portalNodeId='portal-node' />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <DrawTools portalNodeId='portal-node' />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <Share portalNodeId='portal-node' />
</ToolbarWidget>
), [isChartTypeCandle]);
    const onMessage = (e: any) => notifier.notify(e);
    const onPriceLineDisableChange = (evt: any) => setHidePriceLines(evt.target.checked);
    const onShadeColorChange = (evt: any) => setShadeColor(evt.target.value);
    const onColorChange = (evt: any) => setColor(evt.target.value);
    const onFGColorChange = (evt: any) => setForegroundColor(evt.target.value);
    const onHighLowChange = (evt: any) => {
        setHighLow({ ...highLow, [evt.target.id]: +evt.target.value });
    };
    const onRelativeChange = (evt: any) => setRelative(evt.target.checked);
    const onDraggableChange = (evt: any) => setDraggable(evt.target.checked);
    const handleBarrierChange = (evt: any) => setHighLow(evt);
    const onBarrierTypeChange = (evt: any) => {
        const { value: _barrierType } = evt.target;
        if (_barrierType === '')
            {setHighLow({});}
        setBarrierType(_barrierType);
    };
    const onAddMarker = (evt: any) => {
        let _markers = [];
        switch (evt.target.value) {
            case 'LINE':
                for (let i = 0; i < 5; i++) {
                    _markers.push({
                        ts: moment()
                            .utc()
                            .second(0)
                            .subtract(i + 3, 'minutes')
                            .unix(),
                        className: 'chart-marker-line',
                        xPositioner: 'epoch',
                        yPositioner: 'top',
                    });
                }
                break;
            case 'CIRCLE':
                for (let i = 0; i < 15; i++) {
                    _markers.push({
                        ts: moment()
                            .utc()
                            .second(0)
                            .subtract(i + 3, 'minutes')
                            .unix(),
                        className: 'chart-marker-circle',
                        xPositioner: 'epoch',
                        yPositioner: 'value',
                    });
                }
                break;
            default:
                _markers = [];
        }
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '{ ts: number; className: string;... Remove this comment to see the full error message
        setMarkers(_markers);
    };
    const onWidget = () => setEnableNavigationWidget(!enableNavigationWidget);
    const onFooter = () => setEnableFooter(!enableFooter);
    const toggleStartEpoch = () => {
        if (scrollToEpoch) {
            setScrollToEpoch(undefined);
        }
        else {
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
            setScrollToEpoch(moment.utc().unix());
        }
    };
    const onLeftOffset = (evt: any) => {
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        setLeftOffset(+evt.target.value);
    };
    const onActiveLanguage = () => {
        setActiveLanguage(!activeLanguage);
        setSettings({
            // @ts-expect-error ts-migrate(2698) FIXME: Spread types may only be created from object types... Remove this comment to see the full error message
            ...settingsRef.current,
            activeLanguages: activeLanguage ? activeLanguagesList : null,
        });
    };
    const onLanguage = (evt: any) => {
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.location.href = `${baseUrl}?l=${evt.target.value}&activeLanguage=${settings.activeLanguages ? 'true' : 'false'}`;
    };
    const onCrosshair = (evt: any) => {
        const value = evt.target.value;
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number | null' is not assignable... Remove this comment to see the full error message
        setCrosshairState(value === 'null' ? null : parseInt(value, 10));
    };
    const onActiveSymbol = (evt: any) => {
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.location.href = `${baseUrl}?marketsOrder=${evt.target.value}`;
    };
    const onOpenMarket = (evt: any) => {
        const marketArray = evt.target.value.split(',');
        if (marketArray.length === 0)
            {return;}
        setOpenMarket({
            category: marketArray[0],
            subcategory: marketArray[1] || null,
            market: marketArray[2] || null,
        });
        setTimeout(() => {
            setOpenMarket({});
        }, 500);
    };
    const handleScroll = () => setEnableScroll(!enableScroll);
    const handleZoom = () => setEnableZoom(!enableZoom);
    const handleRefreshActiveSymbols = () => {
        setRefreshActiveSymbols(true);
        setTimeout(() => setRefreshActiveSymbols(false));
    };
    const onChartSize = (state: any) => {
        setZoom(state);
        setTimeout(() => {
            // @ts-expect-error ts-migrate(2345) FIXME: Argument of type '0' is not assignable to paramete... Remove this comment to see the full error message
            setZoom(0);
        }, 300);
    };
    const onMaxTick = (evt: any) => {
        const value = evt.target.value;
        // @ts-expect-error ts-migrate(2345) FIXME: Argument of type 'number | null' is not assignable... Remove this comment to see the full error message
        setMaxTick(value === 'null' ? null : parseInt(value, 10));
    };
    /**
     * Initial Data
     */
    const onInitalDataTradingTime = (evt: any) => generateURL({ initialdata_tradingTimes: evt.currentTarget.checked });
    const onInitalDataActiveSymbols = (evt: any) => generateURL({ initialdata_activeSymbols: evt.currentTarget.checked });
    const onInitalDataMasterData = (evt: any) => generateURL({ initialdata_masterData: evt.currentTarget.checked });
    const onFeedCallTradingTime = (evt: any) => generateURL({ feedcall_tradingTimes: evt.currentTarget.checked });
    const onFeedCallActiveSymbols = (evt: any) => generateURL({ feedcall_activeSymbols: evt.currentTarget.checked });
    const barriers = barrierType
        ? [
            {
                shade: barrierType,
                shadeColor,
                foregroundColor: foregroundColor || null,
                color: color || (settings.theme === 'light' ? '#39b19d' : '#555975'),
                onChange: handleBarrierChange,
                relative,
                draggable,
                lineStyle: 'solid',
                hidePriceLines,
                high,
                low,
            },
        ]
        : [];
    return (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<div className='test-container' style={{ diplay: 'block' }}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <div id='portal-node' className='portal-node' />
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <div className='chart-section'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <SmartChart id={chartId} symbol={symbol} isMobile={isMobile} onMessage={onMessage} enableRouting enableScroll={enableScroll} enableZoom={enableZoom} chartControlsWidgets={null} enabledNavigationWidget={enableNavigationWidget} enabledChartFooter={enableFooter} topWidgets={renderTopWidgets} settings={settings} initialData={initialData} feedCall={feedCall} requestAPI={requestAPI} requestSubscribe={requestSubscribe} requestForget={requestForget} toolbarWidget={renderToolbarWidget} endEpoch={endEpoch} chartType={chartType} granularity={granularity} onSettingsChange={saveSettings} isConnectionOpened={isConnectionOpened} barriers={barriers} scrollToEpoch={scrollToEpoch} scrollToEpochOffset={leftOffset} crosshairState={crosshairState} getMarketsOrder={getMarketsOrder} zoom={zoom} maxTick={maxTick} networkStatus={networkStatus} refreshActiveSymbols={refreshActiveSymbols}>
                    {endEpoch ? (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<Marker className='chart-marker-historical' x={endEpoch} xPositioner='epoch' yPositioner='top'>
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <span>
                                {moment(endEpoch * 1000)
                .utc()
                .format('DD MMMM YYYY - HH:mm')}
                            </span>
</Marker>
) : ('')}
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    {markers.map(x => (<Marker key={(x as any).ts} className={(x as any).className} x={(x as any).ts} xPositioner={(x as any).xPositioner} yPositioner={(x as any).yPositioner} />))}
                </SmartChart>
            </div>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <div className='action-section'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <strong>Toggle</strong>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={onWidget}>
                        Navigate Widget
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={onFooter}>
                        Footer
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={onActiveLanguage}>
                        Active Lang: {activeLanguage ? 'ON' : 'OFF'}
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={handleScroll}>
                        Enable/Disable Scroll
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={handleZoom}>
                        Enable/Disable Zoom
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={handleRefreshActiveSymbols}>
                        Refresh ActiveSymbol
                    </button>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={() => onChartSize(1)}>
                        Zoom in
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={() => onChartSize(-1)}>
                        Zoom out
                    </button>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onActiveSymbol}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value=''> -- Set Active Symbols -- </option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='null'>Default</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='synthetic_index,forex,indices,stocks,commodities'>
                            synthetic_index,forex,indices,stocks,commodities
                        </option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='synthetic_index,indices,stocks,commodities,forex'>
                            synthetic_index,indices,stocks,commodities,forex
                        </option>
                    </select>
                </div>

                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onOpenMarket}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value=''> -- Open Market -- </option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='indices,europe,OTC_FCHI'>indices - europe - OTC_FCHI</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='synthetic_index,continuous-indices,1HZ10V'>
                            Synthetic Index - Continuous Indices - 1HZ10V
                        </option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='forex,minor-pairs'>Forex - minor-pairs </option>
                    </select>
                </div>

                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    Crosshair State <br />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onCrosshair}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='null'>not set</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='0'>state 0</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='1'>state 1</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='2'>state 2</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    Max Tick <br />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onMaxTick}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='null'>not set</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='5'>5</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='10'>10</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='20'>20</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    Language <br />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onLanguage}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value=''>None</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='en'>English</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='pt'>Português</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='de'>Deutsch</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='fr'>French</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='pl'>Polish</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='ar'>Arabic(not supported)</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    Markers <br />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onAddMarker}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value=''>None</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='LINE'>Line</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='CIRCLE'>Circle</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    barrier type:&nbsp;
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onBarrierTypeChange} defaultValue={barrierType}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value=''>disable</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='NONE_SINGLE'>NONE_SINGLE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='NONE_DOUBLE'>NONE_DOUBLE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='ABOVE'>ABOVE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='BELOW'>BELOW</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='BETWEEN'>BETWEEN</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='OUTSIDE'>OUTSIDE</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    barrier shade bg color:&nbsp;
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onShadeColorChange}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='GREEN'>GREEN</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='RED'>RED</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='YELLOW'>YELLOW</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='ORANGERED'>ORANGERED</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='PURPLE'>PURPLE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='BLUE'>BLUE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='DEEPPINK'>DEEPPINK</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    barrier bg color:&nbsp;
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select onChange={onColorChange}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='GREEN'>GREEN</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='RED'>RED</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='YELLOW'>YELLOW</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='ORANGERED'>ORANGERED</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='PURPLE'>PURPLE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='BLUE'>BLUE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='DEEPPINK'>DEEPPINK</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    barrier foreground color:
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <br />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <select id='barrierFGColor' onChange={onFGColorChange}>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option>NONE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='#ffffff'>WHITE</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='#00ff00'>GREEN</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='#ff0000'>RED</option>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <option value='#000000'>BLACK</option>
                    </select>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <b>low:</b>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <input id='low' type='number' value={low === undefined ? '' : low} onChange={onHighLowChange} />
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <b>high:</b>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <input id='high' type='number' value={high === undefined ? '' : high} onChange={onHighLowChange} />
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    No PriceLine:
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <input type='checkbox' checked={hidePriceLines === undefined ? '' : hidePriceLines} onChange={onPriceLineDisableChange} />
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    Relative:
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <input type='checkbox' checked={relative === undefined ? '' : relative} onChange={onRelativeChange} />
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    Draggable:
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <input type='checkbox' checked={draggable === undefined ? '' : draggable} onChange={onDraggableChange} />
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='form-row'>
                    Toggle StartEpoch:
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <button type='button' onClick={toggleStartEpoch}>
                        Toggle
                    </button>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <br />
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    LeftOffset(bars): <input type='number' value={leftOffset || 0} onChange={onLeftOffset} />
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='card'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <h3>InitialData</h3>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <div className='card-body'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <div className='form-row'>
                            tradingTime:
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <input type='checkbox' checked={!!initialData.tradingTimes} onChange={onInitalDataTradingTime} />
                        </div>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <div className='form-row'>
                            activeSymbols:
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <input type='checkbox' checked={!!initialData.activeSymbols} onChange={onInitalDataActiveSymbols} />
                        </div>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <div className='form-row'>
                            masterData:
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <input type='checkbox' checked={!!initialData.masterData} onChange={onInitalDataMasterData} />
                        </div>
                    </div>
                </div>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <div className='card'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <h3>FeedCall</h3>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <div className='card-body'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <div className='form-row'>
                            tradingTime:
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <input type='checkbox' checked={feedCall.tradingTimes !== false} onChange={onFeedCallTradingTime} />
                        </div>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <div className='form-row'>
                            activeSymbols:
                            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                            <input type='checkbox' checked={feedCall.activeSymbols !== false} onChange={onFeedCallActiveSymbols} />
                        </div>
                    </div>
                </div>
            </div>
</div>
);
};
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
ReactDOM.render(<App />, document.getElementById('root'));
