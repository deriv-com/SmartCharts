import React from 'react';
import BottomWidgetsContainerStore from './BottomWidgetsContainerStore';
import TimeperiodStore from './TimeperiodStore';
import ChartStore from './ChartStore';
import ChartTypeStore from './ChartTypeStore';
import ChartModeStore from './ChartModeStore';
import StudyLegendStore from './StudyLegendStore';
import DrawToolsStore from './DrawToolsStore';
import ChartTitleStore from './ChartTitleStore';
import ViewStore from './ViewStore';
import CrosshairStore from './CrosshairStore';
import ShareStore from './ShareStore';
import ChartSettingStore from './ChartSettingStore';
import LoaderStore from './LoaderStore';
import FavoriteStore from './FavoriteStore';
import ChartSizeStore from './ChartSizeStore';
import RoutingStore from './RoutingStore';
import CurrentSpotStore from './CurrentSpotStore';
import ChartState from './ChartState';
import Notifier from './Notifier';
import LastDigitStatsStore from './LastDigitStatsStore';
import NavigationWidgetStore from './NavigationWidgetStore';
import HighestLowestStore from './HighestLowestStore';
import PaginationLoaderStore from './PaginationLoaderStore';
import ToolbarWidgetStore from './ToolbarWidgetStore';
import ScrollStore from './ScrollStore';
import { TMainStore } from '../types';

export default class MainStore implements TMainStore {
    notifier = new Notifier();
    favorites = FavoriteStore.getInstance();
    chart = new ChartStore(this);
    state = new ChartState(this);
    chartType = new ChartTypeStore(this);
    chartMode = new ChartModeStore(this);
    studies = new StudyLegendStore(this);
    drawTools = new DrawToolsStore(this);
    chartTitle = new ChartTitleStore(this);
    timeperiod = new TimeperiodStore(this);
    view = new ViewStore(this);
    crosshair = new CrosshairStore(this);
    share = new ShareStore(this);
    chartSetting = new ChartSettingStore(this);
    loader = new LoaderStore();
    chartSize = new ChartSizeStore(this);
    routing = new RoutingStore(this);
    currentSpot = new CurrentSpotStore(this);
    lastDigitStats = new LastDigitStatsStore(this);
    bottomWidgetsContainer = new BottomWidgetsContainerStore(this);
    navigationWidget = new NavigationWidgetStore(this);
    highestLowest = new HighestLowestStore(this);
    paginationLoader = new PaginationLoaderStore(this);
    toolbarWidget = new ToolbarWidgetStore(this);
    scroll = new ScrollStore();
}

let stores_context: React.Context<TMainStore>;

export const initContext = (): void => {
    const root_store = new MainStore();
    stores_context = React.createContext<TMainStore>(root_store);
};

export const getContext = () => stores_context;

export const useStores = (): TMainStore => React.useContext(stores_context);
