/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
import Barrier from './components/Barrier.jsx';
import PendingPromise from './utils/PendingPromise';
import ChartTypes from './components/ChartTypes.jsx';
import ChartMode from './components/ChartMode.jsx';
import StudyLegend from './components/StudyLegend.jsx';
import Views from './components/Views.jsx';
import CrosshairToggle from './components/CrosshairToggle.jsx';
import Timeperiod from './components/Timeperiod.jsx';
import ChartSize from './components/ChartSize.jsx';
import DrawTools from './components/DrawTools.jsx';
import ChartSetting from './components/ChartSetting.jsx';
import Share from './components/Share.jsx';
import SmartChart from './components/SmartChart.jsx';
import ChartTitle from './components/ChartTitle.jsx';
import FastMarker from './components/FastMarker.jsx';
import RawMarker from './components/RawMarker.jsx';
import ToolbarWidget from './components/ToolbarWidget.jsx';
import { createObjectFromLocalStorage } from './utils';
import { logEvent, LogCategories, LogActions } from './utils/ga';

function setSmartChartsPublicPath(path) {
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
