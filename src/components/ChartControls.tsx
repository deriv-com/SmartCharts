// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartTypes.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import ChartTypes from './ChartTypes.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './StudyLegend.jsx' was resolved to '/Users... Remove this comment to see the full error message
import StudyLegend from './StudyLegend.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Views.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import Views from './Views.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './CrosshairToggle.jsx' was resolved to '/U... Remove this comment to see the full error message
import CrosshairToggle from './CrosshairToggle.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Timeperiod.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import Timeperiod from './Timeperiod.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartSize.jsx' was resolved to '/Users/b... Remove this comment to see the full error message
import ChartSize from './ChartSize.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './DrawTools.jsx' was resolved to '/Users/b... Remove this comment to see the full error message
import DrawTools from './DrawTools.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Share.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import Share from './Share.jsx';
import '../../sass/components/_chart-controls.scss';

export const RenderDefaultControls = ({
    isMobile,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {isMobile ? '' : <CrosshairToggle />}
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <ChartTypes />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Timeperiod />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <StudyLegend />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <DrawTools />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Views />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <Share />
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        {isMobile ? '' : <ChartSize />}
    </>
);

const ChartControls = ({
    isMobile,
    hasOpenMenu,
    widgets,
    context,
}: any) => {
    const Controls = widgets || RenderDefaultControls;

    return (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className={classNames('cq-chart-controls', { active: hasOpenMenu })}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            {context ? <Controls isMobile={isMobile} /> : null}
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chart,
    chartType,
    studies,
    drawTools,
    view,
    share,
    timeperiod,
    chartSetting,
}: any) => ({
    isMobile: chart.isMobile,
    context: chart.context,
    hasOpenMenu:
        chartType.menu.open ||
        studies.menu.open ||
        drawTools.menu.open ||
        view.menu.open ||
        share.menu.open ||
        timeperiod.menu.open ||
        chartSetting.menu.open,
}))(ChartControls);
