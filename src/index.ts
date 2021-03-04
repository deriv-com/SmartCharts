/* eslint-disable no-new, react/jsx-indent, react/no-danger, react/jsx-indent-props */
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/Barrier.jsx' was resolved to ... Remove this comment to see the full error message
import Barrier from './components/Barrier.jsx';
import PendingPromise from './utils/PendingPromise';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/ChartTypes.jsx' was resolved ... Remove this comment to see the full error message
import ChartTypes from './components/ChartTypes.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/ChartMode.jsx' was resolved t... Remove this comment to see the full error message
import ChartMode from './components/ChartMode.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/StudyLegend.jsx' was resolved... Remove this comment to see the full error message
import StudyLegend from './components/StudyLegend.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/Views.jsx' was resolved to '/... Remove this comment to see the full error message
import Views from './components/Views.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/CrosshairToggle.jsx' was reso... Remove this comment to see the full error message
import CrosshairToggle from './components/CrosshairToggle.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/Timeperiod.jsx' was resolved ... Remove this comment to see the full error message
import Timeperiod from './components/Timeperiod.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/ChartSize.jsx' was resolved t... Remove this comment to see the full error message
import ChartSize from './components/ChartSize.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/DrawTools.jsx' was resolved t... Remove this comment to see the full error message
import DrawTools from './components/DrawTools.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/ChartSetting.jsx' was resolve... Remove this comment to see the full error message
import ChartSetting from './components/ChartSetting.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/Share.jsx' was resolved to '/... Remove this comment to see the full error message
import Share from './components/Share.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/SmartChart.jsx' was resolved ... Remove this comment to see the full error message
import SmartChart from './components/SmartChart.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/ChartTitle.jsx' was resolved ... Remove this comment to see the full error message
import ChartTitle from './components/ChartTitle.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/FastMarker.jsx' was resolved ... Remove this comment to see the full error message
import FastMarker from './components/FastMarker.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/RawMarker.jsx' was resolved t... Remove this comment to see the full error message
import RawMarker from './components/RawMarker.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './components/ToolbarWidget.jsx' was resolv... Remove this comment to see the full error message
import ToolbarWidget from './components/ToolbarWidget.jsx';
import { createObjectFromLocalStorage } from './utils';
import { logEvent, LogCategories, LogActions } from './utils/ga';

function setSmartChartsPublicPath(path: any) {
    // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name '__webpack_public_path__'.
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
