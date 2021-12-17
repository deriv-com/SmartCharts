import Barrier from './components/Barrier';
import PendingPromise from './utils/PendingPromise';
import ChartTypes from './components/ChartTypes';
import ChartMode from './components/ChartMode';
import StudyLegend from './components/StudyLegend';
import Views from './components/Views';
import CrosshairToggle from './components/CrosshairToggle';
import Timeperiod from './components/Timeperiod';
import ChartSize from './components/ChartSize';
import DrawTools from './components/DrawTools';
import ChartSetting from './components/ChartSetting';
import Share from './components/Share';
import SmartChart from './components/SmartChart';
import ChartTitle from './components/ChartTitle';
import FastMarker from './components/FastMarker';
import RawMarker from './components/RawMarker';
import ToolbarWidget from './components/ToolbarWidget';
import { createObjectFromLocalStorage } from './utils';
import { logEvent, LogCategories, LogActions } from './utils/ga';

function setSmartChartsPublicPath(path: string) {
    __webpack_public_path__ = path; // eslint-disable-line
}

const Marker = FastMarker;

export {
    Barrier,
    ChartSetting,
    ChartSize,
    ChartTitle,
    ChartTypes,
    ChartMode,
    createObjectFromLocalStorage,
    CrosshairToggle,
    DrawTools,
    Marker,
    PendingPromise,
    setSmartChartsPublicPath,
    Share,
    SmartChart,
    StudyLegend,
    Timeperiod,
    Views,
    ToolbarWidget,
    logEvent,
    LogCategories,
    LogActions,
};

export default {
    Barrier,
    ChartSetting,
    ChartSize,
    ChartTitle,
    ChartTypes,
    ChartMode,
    createObjectFromLocalStorage,
    CrosshairToggle,
    DrawTools,
    FastMarker,
    Marker: FastMarker,
    PendingPromise,
    RawMarker,
    setSmartChartsPublicPath,
    Share,
    SmartChart,
    StudyLegend,
    Timeperiod,
    Views,
    ToolbarWidget,
    logEvent,
    LogCategories,
    LogActions,
};
