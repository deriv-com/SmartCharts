import {
    ChartMode,
    ChartTitle,
    createObjectFromLocalStorage,
    DrawTools,
    LogActions,
    LogCategories,
    logEvent,
    Marker,
    setSmartChartsPublicPath,
    Share,
    SmartChart,
    StudyLegend,
    ToolbarWidget,
    Views,
} from '@binary-com/smartcharts'; // eslint-disable-line import/no-unresolved
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { configure } from 'mobx';
import moment from 'moment';
import React, { ChangeEvent } from 'react';
import ReactDOM from 'react-dom';
import { TNotification } from 'src/store/Notifier';
import {
    TBarrierChangeParam,
    TGranularity,
    TInitialChartData,
    TNetworkConfig,
    TOpenMarket,
    TRefData,
    TSettings,
} from 'src/types';
import 'url-search-params-polyfill';
import './app.scss';
import ChartHistory from './ChartHistory';
import ChartNotifier from './ChartNotifier';
import { ConnectionManager, StreamManager } from './connection';
import NetworkMonitor from './connection/NetworkMonitor';
import { masterData, MockActiveSymbol, MockTradingTime } from './initialData';
import Notification from './Notification';
import './test.scss';

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
window.isProductionWebsite = trackJSDomains.some(val => window.location.host.endsWith(val));
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
        const setting_string = localStorage.getItem('smartchart-setting') || '',
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
const parseQueryString = (query: string) => {
    const vars = query.split('&');
    const query_string: Record<string, string | string[]> = {};
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        const key = decodeURIComponent(pair[0]);
        const value = decodeURIComponent(pair[1]);
        // If first entry with this name
        if (typeof query_string[key] === 'undefined') {
            query_string[key] = decodeURIComponent(value);
            // If second entry with this name
        } else if (typeof query_string[key] === 'string') {
            const arr: string[] = [query_string[key] as string, decodeURIComponent(value)];
            query_string[key] = arr;
            // If third or later entry with this name
        } else {
            (query_string[key] as string[]).push(decodeURIComponent(value));
        }
    }
    return query_string;
};
const generateURL = (new_params: {
    initialdata_tradingTimes?: boolean;
    initialdata_activeSymbols?: boolean;
    initialdata_masterData?: boolean;
    feedcall_tradingTimes?: boolean;
    feedcall_activeSymbols?: boolean;
}) => {
    const { origin, pathname, search } = window.location;
    const cleanSearch = search.replace('?', '').trim();
    const params = {
        ...(cleanSearch !== '' ? parseQueryString(cleanSearch) : {}),
        ...new_params,
    };
    window.location.href = `${origin}${pathname}?${Object.keys(params)
        .map(key => `${key}=${params[key as keyof typeof new_params]}`)
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
    const openMarketRef = React.useRef<TOpenMarket>({});
    const [notifier] = React.useState(new ChartNotifier());
    const [layoutString] = React.useState(localStorage.getItem(`layout-${chartId}`) || '');
    const [layout] = React.useState(JSON.parse(layoutString !== '' ? layoutString : '{}'));
    const initialSettings = React.useMemo(() => {
        let _settings: TSettings = createObjectFromLocalStorage('smartchart-setting');
        const activeLanguage = new URLSearchParams(window.location.search).get('activeLanguage') === 'true';
        if (_settings) {
            _settings.language = language;
            startingLanguageRef.current = _settings.language as string;
        } else {
            _settings = { language };
        }
        _settings.activeLanguages = activeLanguage ? activeLanguagesList : null;
        if (_settings.historical) {
            _settings.isHighestLowestMarkerEnabled = false;
        }
        return _settings;
    }, []);

    const [settings, setSettings] = React.useState(initialSettings);
    const settingsRef = React.useRef<TSettings>(settings);
    settingsRef.current = settings;

    const memoizedValues = React.useMemo(() => {
        let chartType;
        let isChartTypeCandle;
        let granularity = 60;
        let endEpoch;
        if (settingsRef.current.historical) {
            endEpoch = new Date(`${today}:00Z`).valueOf() / 1000;
            chartType = 'line';
            isChartTypeCandle = false;
            if (layout) {
                granularity =
                    layout.timeUnit === 'second'
                        ? 0
                        : parseInt(
                              (layout.interval * IntervalEnum[layout.timeUnit as keyof typeof IntervalEnum]).toString(),
                              10
                          );
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
        return {
            chartType,
            granularity,
            endEpoch,
            isChartTypeCandle,
        };
    }, [layout]);

    const [closed_market, setClosedMarket] = React.useState<string | null>(null);
    const [exclude_symbol, setExcludeSymbol] = React.useState<string | null>(null);
    const [chartType, setChartType] = React.useState(memoizedValues.chartType);
    const [granularity, setGranularity] = React.useState<TGranularity>(memoizedValues.granularity as TGranularity);
    const [endEpoch, setEndEpoch] = React.useState(memoizedValues.endEpoch);
    const [isChartTypeCandle, setIsChartTypeCandle] = React.useState(memoizedValues.isChartTypeCandle);
    const [isConnectionOpened, setIsConnectionOpened] = React.useState(true);
    const [networkStatus, setNetworkStatus] = React.useState<TNetworkConfig>();
    const [symbol, setSymbol] = React.useState<string>();
    const [relative, setRelative] = React.useState(false);
    const [draggable, setDraggable] = React.useState(true);
    const [highLow, setHighLow] = React.useState<{ high?: number; low?: number }>({});
    const [barrierType, setBarrierType] = React.useState('');
    const [zoom, setZoom] = React.useState<number>();
    const [maxTick, setMaxTick] = React.useState<number | null>();
    const [openMarket, setOpenMarket] = React.useState<TOpenMarket>({});
    const [markers, setMarkers] = React.useState<
        {
            ts: number;
            className: string;
            xPositioner: string;
            yPositioner: string;
        }[]
    >([]);
    const [crosshairState, setCrosshairState] = React.useState<number | null>(1);
    const [scrollToEpoch, setScrollToEpoch] = React.useState<number>();
    const [enableFooter, setEnableFooter] = React.useState(true);
    const [enableScroll, setEnableScroll] = React.useState(false);
    const [enableZoom, setEnableZoom] = React.useState(false);
    const [enableNavigationWidget, setEnableNavigationWidget] = React.useState(false);
    const [foregroundColor, setForegroundColor] = React.useState<string>();
    const [hidePriceLines, setHidePriceLines] = React.useState(false);
    const [shadeColor, setShadeColor] = React.useState<string>();
    const [color, setColor] = React.useState<string>();
    const [refreshActiveSymbols, setRefreshActiveSymbols] = React.useState(false);
    const [activeLanguage, setActiveLanguage] = React.useState(
        new URLSearchParams(window.location.search).get('activeLanguage') === 'true'
    );
    openMarketRef.current = openMarket;
    const { high, low } = highLow;
    React.useEffect(() => {
        connectionManager.on(ConnectionManager.EVENT_CONNECTION_CLOSE, () => setIsConnectionOpened(false));
        connectionManager.on(ConnectionManager.EVENT_CONNECTION_REOPEN, () => setIsConnectionOpened(true));
        const networkMonitor = NetworkMonitor.getInstance();
        networkMonitor.init(requestAPI, handleNetworkStatus);
    }, []);
    const [urlParams] = React.useState(parseQueryString(window.location.search.replace('?', '')));

    const [marketsOrder] = React.useState(urlParams.marketsOrder || 'null');
    const getMarketsOrder =
        marketsOrder !== '' && marketsOrder !== 'null' ? () => (marketsOrder as string).split(',') : undefined;
    const [feedCall] = React.useState({
        ...(urlParams.feedcall_tradingTimes === 'false' ? { tradingTimes: false } : {}),
        ...(urlParams.feedcall_activeSymbols === 'false' ? { activeSymbols: false } : {}),
    });
    const [initialData] = React.useState({
        ...(urlParams.initialdata_masterData === 'true' ? { masterData: masterData() } : {}),
        ...(urlParams.initialdata_tradingTimes === 'true' ? { tradingTimes: MockTradingTime } : {}),
        ...(urlParams.initialdata_activeSymbols === 'true' ? { activeSymbols: MockActiveSymbol } : {}),
    });
    const handleNetworkStatus = (status: TNetworkConfig) => setNetworkStatus(status);
    const saveSettings = React.useCallback(newSettings => {
        const prevSetting = settingsRef.current;
        console.log('settings updated:', newSettings);
        localStorage.setItem('smartchart-setting', JSON.stringify(newSettings));
        if (!prevSetting.historical && newSettings.historical) {
            setChartType('mountain');
            setIsChartTypeCandle(false);
            setGranularity(0);
            setEndEpoch(new Date(`${today}:00Z`).valueOf() / 1000);
        } else if (!newSettings.historical) {
            handleDateChange('');
        }
        setSettings(newSettings);
        if (startingLanguageRef.current !== newSettings.language) {
            // Place language in URL:
            const { origin, search, pathname } = window.location;
            const url = new URLSearchParams(search);
            url.delete('l');
            url.set('l', newSettings.language);
            url.set('activeLanguage', prevSetting.activeLanguages ? 'true' : 'false');
            window.location.href = `${origin}${pathname}?${url.toString()}`;
        }
    }, []);
    const handleDateChange = (value: string) => {
        setEndEpoch(value !== '' ? new Date(`${value}:00Z`).valueOf() / 1000 : undefined);
    };
    const renderTopWidgets = React.useCallback(() => {
        const symbolChange = (newSymbol: string) => {
            logEvent(LogCategories.ChartTitle, LogActions.MarketSelector, newSymbol);
            notifier.removeByCategory('activesymbol');
            setSymbol(newSymbol);
        };
        return (
            <React.Fragment>
                <ChartTitle
                    onChange={symbolChange}
                    open_market={openMarketRef.current}
                    open={!!openMarketRef.current.category}
                />
                {!!settingsRef.current.historical && <ChartHistory onChange={handleDateChange} />}
                <Notification notifier={notifier} />
            </React.Fragment>
        );
    }, [notifier]);
    const renderToolbarWidget = React.useCallback(
        () => (
            <ToolbarWidget>
                <ChartMode
                    portalNodeId='portal-node'
                    onChartType={(_chartType?: string) => {
                        setChartType(_chartType);
                    }}
                    onGranularity={(timePeriod: TGranularity) => {
                        setGranularity(timePeriod);
                        const isCandle = isChartTypeCandle;
                        if (isCandle && timePeriod === 0) {
                            setChartType('mountain');
                            setIsChartTypeCandle(false);
                        } else if (!isCandle && timePeriod !== 0) {
                            setChartType('candle');
                            setIsChartTypeCandle(true);
                        }
                    }}
                />
                <StudyLegend portalNodeId='portal-node' />
                <Views portalNodeId='portal-node' />
                <DrawTools portalNodeId='portal-node' />
                <Share portalNodeId='portal-node' />
            </ToolbarWidget>
        ),
        [isChartTypeCandle]
    );
    const onMessage = (e: TNotification) => notifier.notify(e);
    const onPriceLineDisableChange = (evt: ChangeEvent<HTMLInputElement>) => setHidePriceLines(evt.target.checked);
    const onShadeColorChange = (evt: ChangeEvent<HTMLSelectElement>) => setShadeColor(evt.target.value);
    const onColorChange = (evt: ChangeEvent<HTMLSelectElement>) => setColor(evt.target.value);
    const onFGColorChange = (evt: ChangeEvent<HTMLSelectElement>) => setForegroundColor(evt.target.value);
    const onHighLowChange = (evt: ChangeEvent<HTMLInputElement>) => {
        setHighLow({ ...highLow, [evt.target.id]: +evt.target.value });
    };
    const onRelativeChange = (evt: ChangeEvent<HTMLInputElement>) => setRelative(evt.target.checked);
    const onDraggableChange = (evt: ChangeEvent<HTMLInputElement>) => setDraggable(evt.target.checked);
    const handleBarrierChange = (param: TBarrierChangeParam) => setHighLow(param);
    const onBarrierTypeChange = (evt: ChangeEvent<HTMLSelectElement>) => {
        const { value: _barrierType } = evt.target;
        if (_barrierType === '') {
            setHighLow({});
        }
        setBarrierType(_barrierType);
    };
    const onAddMarker = (evt: ChangeEvent<HTMLSelectElement>) => {
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
        setMarkers(_markers);
    };
    const onWidget = () => setEnableNavigationWidget(!enableNavigationWidget);
    const onFooter = () => setEnableFooter(!enableFooter);
    const toggleStartEpoch = () => {
        if (scrollToEpoch) {
            setScrollToEpoch(undefined);
        } else {
            setScrollToEpoch(moment.utc().unix());
        }
    };
    const onActiveLanguage = () => {
        setActiveLanguage(!activeLanguage);
        setSettings({
            ...settingsRef.current,
            activeLanguages: activeLanguage ? activeLanguagesList : null,
        });
    };
    const onLanguage = (evt: ChangeEvent<HTMLSelectElement>) => {
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.location.href = `${baseUrl}?l=${evt.target.value}&activeLanguage=${
            settings.activeLanguages ? 'true' : 'false'
        }`;
    };
    const onCrosshair = (evt: ChangeEvent<HTMLSelectElement>) => {
        const value = evt.target.value;
        setCrosshairState(value === 'null' ? null : parseInt(value, 10));
    };
    const onActiveSymbol = (evt: ChangeEvent<HTMLSelectElement>) => {
        const baseUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
        window.location.href = `${baseUrl}?marketsOrder=${evt.target.value}`;
    };
    const onOpenMarket = (evt: ChangeEvent<HTMLSelectElement>) => {
        const marketArray = evt.target.value.split(',');
        if (marketArray.length === 0) {
            return;
        }
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
    const onChartSize = (state: number) => {
        setZoom(state);
        setTimeout(() => {
            setZoom(0);
        }, 300);
    };
    const onMaxTick = (evt: ChangeEvent<HTMLSelectElement>) => {
        const value = evt.target.value;
        setMaxTick(value === 'null' ? null : parseInt(value, 10));
    };
    /**
     * Initial Data
     */
    const onInitalDataTradingTime = (evt: ChangeEvent<HTMLInputElement>) =>
        generateURL({ initialdata_tradingTimes: evt.currentTarget.checked });
    const onInitalDataActiveSymbols = (evt: ChangeEvent<HTMLInputElement>) =>
        generateURL({ initialdata_activeSymbols: evt.currentTarget.checked });
    const onInitalDataMasterData = (evt: ChangeEvent<HTMLInputElement>) =>
        generateURL({ initialdata_masterData: evt.currentTarget.checked });
    const onFeedCallTradingTime = (evt: ChangeEvent<HTMLInputElement>) =>
        generateURL({ feedcall_tradingTimes: evt.currentTarget.checked });
    const onFeedCallActiveSymbols = (evt: ChangeEvent<HTMLInputElement>) =>
        generateURL({ feedcall_activeSymbols: evt.currentTarget.checked });

    const initial_data: TInitialChartData = React.useMemo(() => {
        const data: {
            masterData?: TInitialChartData['masterData'];
            tradingTimes?: TInitialChartData['tradingTimes'];
            activeSymbols?: TInitialChartData['activeSymbols'];
        } = {};

        if (urlParams.initialdata_masterData === 'true') {
            data.masterData = masterData();
        }

        if (urlParams.initialdata_tradingTimes === 'true') {
            data.tradingTimes = MockTradingTime.trading_times;
        }

        if (urlParams.initialdata_activeSymbols === 'true') {
            data.activeSymbols = MockActiveSymbol;
        }
        return { ...data };
    }, [urlParams]);

    const chart_data = React.useMemo(() => {
        const data: {
            masterData?: TInitialChartData['masterData'];
            tradingTimes?: TInitialChartData['tradingTimes'];
            activeSymbols?: TInitialChartData['activeSymbols'];
        } = {};

        if (urlParams.initialdata_masterData === 'true') {
            data.masterData = masterData();
        }

        if (urlParams.initialdata_tradingTimes === 'true') {
            data.tradingTimes = MockTradingTime.trading_times;
        }

        if (urlParams.initialdata_activeSymbols === 'true') {
            data.activeSymbols = MockActiveSymbol;
        }

        if (exclude_symbol) {
            const CLONED_MockActiveSymbol: typeof MockActiveSymbol = JSON.parse(JSON.stringify(MockActiveSymbol));
            const exclude_obj = exclude_symbol.split(',');
            if (exclude_obj && exclude_obj.length === 2) {
                data.activeSymbols = CLONED_MockActiveSymbol?.filter(
                    item => !(item.market === exclude_obj[0] && item.submarket === exclude_obj[1])
                );
            } else if (exclude_obj && exclude_obj.length === 1) {
                data.activeSymbols = CLONED_MockActiveSymbol?.filter(item => !(item.market === exclude_obj[0]));
            }
        }

        if (closed_market) {
            const cloned_trading_mock_data: typeof MockTradingTime.trading_times = JSON.parse(
                JSON.stringify(MockTradingTime.trading_times)
            );

            if (closed_market === 'default') {
                data.tradingTimes = cloned_trading_mock_data;
            } else {
                data.tradingTimes = {
                    markets: cloned_trading_mock_data.markets.map(_market => {
                        if (_market.name === closed_market) {
                            _market.submarkets = [...(_market.submarkets || [])].map(_submarkets => {
                                _submarkets.symbols = [...(_submarkets.symbols || [])].map(_symbol => {
                                    if (_symbol.events !== undefined) {
                                        _symbol.events.push({
                                            dates: 'today',
                                            descrip: 'Closes early (at 00:00)',
                                        });
                                    }
                                    return _symbol;
                                });
                                return _submarkets;
                            });
                        }
                        return _market;
                    }),
                };
            }
        }
        return { ...data };
    }, [urlParams, closed_market, exclude_symbol]);

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
        <div className='test-container'>
            <div id='portal-node' className='portal-node' />
            <div className='chart-section'>
                <SmartChart
                    id={chartId}
                    symbol={symbol}
                    isMobile={isMobile}
                    onMessage={onMessage}
                    enableRouting
                    enableScroll={enableScroll}
                    enableZoom={enableZoom}
                    chartControlsWidgets={null}
                    enabledNavigationWidget={enableNavigationWidget}
                    enabledChartFooter={enableFooter}
                    topWidgets={renderTopWidgets}
                    settings={settings}
                    initialData={initial_data}
                    chartData={chart_data}
                    feedCall={feedCall}
                    requestAPI={requestAPI}
                    requestSubscribe={requestSubscribe}
                    requestForget={requestForget}
                    toolbarWidget={renderToolbarWidget}
                    endEpoch={endEpoch}
                    chartType={chartType}
                    granularity={granularity}
                    onSettingsChange={saveSettings}
                    isConnectionOpened={isConnectionOpened}
                    barriers={barriers}
                    scrollToEpoch={scrollToEpoch}
                    crosshairState={crosshairState}
                    getMarketsOrder={getMarketsOrder}
                    zoom={zoom}
                    maxTick={maxTick}
                    networkStatus={networkStatus}
                    refreshActiveSymbols={refreshActiveSymbols}
                >
                    {endEpoch ? (
                        <Marker className='chart-marker-historical' x={endEpoch} xPositioner='epoch' yPositioner='top'>
                            <span>
                                {moment(endEpoch * 1000)
                                    .utc()
                                    .format('DD MMMM YYYY - HH:mm')}
                            </span>
                        </Marker>
                    ) : (
                        ''
                    )}
                    {markers.map(x => (
                        <ChartMarker {...x} />
                    ))}
                </SmartChart>
            </div>
            <div className='action-section'>
                <div className='form-row'>
                    <strong>Toggle</strong>
                </div>
                <div className='form-row'>
                    <button type='button' onClick={onWidget}>
                        Navigate Widget
                    </button>
                    <button type='button' onClick={onFooter}>
                        Footer
                    </button>
                    <button type='button' onClick={onActiveLanguage}>
                        Active Lang: {activeLanguage ? 'ON' : 'OFF'}
                    </button>
                    <button type='button' onClick={handleScroll}>
                        Enable/Disable Scroll
                    </button>
                    <button type='button' onClick={handleZoom}>
                        Enable/Disable Zoom
                    </button>
                    <button type='button' onClick={handleRefreshActiveSymbols}>
                        Refresh ActiveSymbol
                    </button>
                </div>
                <div className='form-row'>
                    <button type='button' onClick={() => onChartSize(1)}>
                        Zoom in
                    </button>
                    <button type='button' onClick={() => onChartSize(-1)}>
                        Zoom out
                    </button>
                </div>
                <div className='form-row'>
                    <select onChange={onActiveSymbol}>
                        <option value=''> -- Set Active Symbols -- </option>
                        <option value='null'>Default</option>
                        <option value='synthetic_index,basket_index,forex,indices,stocks,commodities'>
                            synthetic_index,basket_index,forex,indices,stocks,commodities
                        </option>
                        <option value='synthetic_index,indices,stocks,commodities,basket_index,forex'>
                            synthetic_index,indices,stocks,commodities,basket_index,forex
                        </option>
                    </select>
                </div>

                <div className='form-row'>
                    <strong>Closed market</strong>
                    <select onChange={el => setClosedMarket(el.target.value)}>
                        <option value='default'> Default </option>
                        <option value='Forex'> Forex </option>
                        <option value='Basket Indices'> Basket Indices </option>
                        <option value='Commodities'> Commodities </option>
                        <option value='Stock Indices'> Stock Indices </option>
                        <option value='Synthetic Indices'> Synthetic Indices </option>
                        <option value='Cryptocurrencies'> Cryptocurrencies </option>
                    </select>
                </div>
                <div className='form-row'>
                    <strong>Exclude a market</strong>
                    <select onChange={el => setExcludeSymbol(el.target.value)}>
                        <option value='default'> Default </option>
                        <option value='forex'> Forex </option>
                        <option value='basket_index'> Basket Indices </option>
                        <option value='commodities'> Commodities </option>
                        <option value='indices'> Stock Indices </option>
                        <option value='synthetic_index'> Synthetic Indices </option>
                        <option value='cryptocurrency'> Cryptocurrencies </option>
                    </select>
                </div>
                <div className='form-row'>
                    <select onChange={onOpenMarket}>
                        <option value=''> -- Open Market -- </option>
                        <option value='indices,europe,OTC_FCHI'>indices - europe - OTC_FCHI</option>
                        <option value='synthetic_index,continuous-indices,1HZ10V'>
                            Synthetic Index - Continuous Indices - 1HZ10V
                        </option>
                        <option value='forex,minor-pairs'>Forex - minor-pairs </option>
                    </select>
                </div>

                <div className='form-row'>
                    Crosshair State <br />
                    <select onChange={onCrosshair}>
                        <option value='null'>not set</option>
                        <option value='0'>state 0</option>
                        <option value='1'>state 1</option>
                        <option value='2'>state 2</option>
                    </select>
                </div>
                <div className='form-row'>
                    Max Tick <br />
                    <select onChange={onMaxTick}>
                        <option value='null'>not set</option>
                        <option value='5'>5</option>
                        <option value='10'>10</option>
                        <option value='20'>20</option>
                    </select>
                </div>
                <div className='form-row'>
                    Language <br />
                    <select onChange={onLanguage}>
                        <option value=''>None</option>
                        <option value='en'>English</option>
                        <option value='pt'>Português</option>
                        <option value='de'>Deutsch</option>
                        <option value='fr'>French</option>
                        <option value='pl'>Polish</option>
                        <option value='ar'>Arabic(not supported)</option>
                    </select>
                </div>
                <div className='form-row'>
                    Markers <br />
                    <select onChange={onAddMarker}>
                        <option value=''>None</option>
                        <option value='LINE'>Line</option>
                        <option value='CIRCLE'>Circle</option>
                    </select>
                </div>
                <div className='form-row'>
                    barrier type:&nbsp;
                    <select onChange={onBarrierTypeChange} defaultValue={barrierType}>
                        <option value=''>disable</option>
                        <option value='NONE_SINGLE'>NONE_SINGLE</option>
                        <option value='NONE_DOUBLE'>NONE_DOUBLE</option>
                        <option value='ABOVE'>ABOVE</option>
                        <option value='BELOW'>BELOW</option>
                        <option value='BETWEEN'>BETWEEN</option>
                        <option value='OUTSIDE'>OUTSIDE</option>
                    </select>
                </div>
                <div className='form-row'>
                    barrier shade bg color:&nbsp;
                    <select onChange={onShadeColorChange}>
                        <option value='GREEN'>GREEN</option>
                        <option value='RED'>RED</option>
                        <option value='YELLOW'>YELLOW</option>
                        <option value='ORANGERED'>ORANGERED</option>
                        <option value='PURPLE'>PURPLE</option>
                        <option value='BLUE'>BLUE</option>
                        <option value='DEEPPINK'>DEEPPINK</option>
                    </select>
                </div>
                <div className='form-row'>
                    barrier bg color:&nbsp;
                    <select onChange={onColorChange}>
                        <option value='GREEN'>GREEN</option>
                        <option value='RED'>RED</option>
                        <option value='YELLOW'>YELLOW</option>
                        <option value='ORANGERED'>ORANGERED</option>
                        <option value='PURPLE'>PURPLE</option>
                        <option value='BLUE'>BLUE</option>
                        <option value='DEEPPINK'>DEEPPINK</option>
                    </select>
                </div>
                <div className='form-row'>
                    barrier foreground color:
                    <br />
                    <select id='barrierFGColor' onChange={onFGColorChange}>
                        <option>NONE</option>
                        <option value='#ffffff'>WHITE</option>
                        <option value='#00ff00'>GREEN</option>
                        <option value='#ff0000'>RED</option>
                        <option value='#000000'>BLACK</option>
                    </select>
                </div>
                <div className='form-row'>
                    <b>low:</b>
                    <input id='low' type='number' value={low === undefined ? '' : low} onChange={onHighLowChange} />
                </div>
                <div className='form-row'>
                    <b>high:</b>
                    <input id='high' type='number' value={high === undefined ? '' : high} onChange={onHighLowChange} />
                </div>
                <div className='form-row'>
                    No PriceLine:
                    <input
                        type='checkbox'
                        checked={hidePriceLines === undefined ? false : hidePriceLines}
                        onChange={onPriceLineDisableChange}
                    />
                </div>
                <div className='form-row'>
                    Relative:
                    <input
                        type='checkbox'
                        checked={relative === undefined ? false : relative}
                        onChange={onRelativeChange}
                    />
                </div>
                <div className='form-row'>
                    Draggable:
                    <input
                        type='checkbox'
                        checked={draggable === undefined ? false : draggable}
                        onChange={onDraggableChange}
                    />
                </div>
                <div className='form-row'>
                    Toggle StartEpoch:
                    <button type='button' onClick={toggleStartEpoch}>
                        Toggle
                    </button>
                    <br />
                </div>
                <div className='card'>
                    <h3>InitialData</h3>
                    <div className='card-body'>
                        <div className='form-row'>
                            tradingTime:
                            <input
                                type='checkbox'
                                checked={!!initialData.tradingTimes}
                                onChange={onInitalDataTradingTime}
                            />
                        </div>
                        <div className='form-row'>
                            activeSymbols:
                            <input
                                type='checkbox'
                                checked={!!initialData.activeSymbols}
                                onChange={onInitalDataActiveSymbols}
                            />
                        </div>
                        <div className='form-row'>
                            masterData:
                            <input
                                type='checkbox'
                                checked={!!initialData.masterData}
                                onChange={onInitalDataMasterData}
                            />
                        </div>
                    </div>
                </div>
                <div className='card'>
                    <h3>FeedCall</h3>
                    <div className='card-body'>
                        <div className='form-row'>
                            tradingTime:
                            <input
                                type='checkbox'
                                checked={feedCall.tradingTimes !== false}
                                onChange={onFeedCallTradingTime}
                            />
                        </div>
                        <div className='form-row'>
                            activeSymbols:
                            <input
                                type='checkbox'
                                checked={feedCall.activeSymbols !== false}
                                onChange={onFeedCallActiveSymbols}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ChartMarker = (props: { ts: number; className: string; xPositioner: string; yPositioner: string }) => {
    const { ts, className, xPositioner, yPositioner } = props;

    const onMarkerRef = (ref: TRefData | null) => {
        if (ref) {
            ref.setPosition({
                epoch: ts,
            });
        }
    };
    return (
        <Marker
            key={ts}
            className={className}
            x={ts}
            xPositioner={xPositioner}
            yPositioner={yPositioner}
            markerRef={onMarkerRef}
        />
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
