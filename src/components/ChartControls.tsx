import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartTypes' was resolved to '/Users/... Remove this comment to see the full error message
import ChartTypes from './ChartTypes';
// @ts-expect-error ts-migrate(6142) FIXME: Module './StudyLegend' was resolved to '/Users... Remove this comment to see the full error message
import StudyLegend from './StudyLegend';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Views' was resolved to '/Users/balak... Remove this comment to see the full error message
import Views from './Views';
// @ts-expect-error ts-migrate(6142) FIXME: Module './CrosshairToggle' was resolved to '/U... Remove this comment to see the full error message
import CrosshairToggle from './CrosshairToggle';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Timeperiod' was resolved to '/Users/... Remove this comment to see the full error message
import Timeperiod from './Timeperiod';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartSize' was resolved to '/Users/b... Remove this comment to see the full error message
import ChartSize from './ChartSize';
// @ts-expect-error ts-migrate(6142) FIXME: Module './DrawTools' was resolved to '/Users/b... Remove this comment to see the full error message
import DrawTools from './DrawTools';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Share' was resolved to '/Users/balak... Remove this comment to see the full error message
import Share from './Share';
import '../../sass/components/_chart-controls.scss';

export const RenderDefaultControls = ({ isMobile }: any) => (
    <>
        {isMobile ? '' : <CrosshairToggle />}
        <ChartTypes />
        <Timeperiod />
        <StudyLegend />
        <DrawTools />
        <Views />
        <Share />
        {isMobile ? '' : <ChartSize />}
    </>
);

const ChartControls = ({ isMobile, hasOpenMenu, widgets, context }: any) => {
    const Controls = widgets || RenderDefaultControls;

    return (
        <div className={classNames('cq-chart-controls', { active: hasOpenMenu })}>
            {context ? <Controls isMobile={isMobile} /> : null}
        </div>
    );
};

export default connect(({ chart, chartType, studies, drawTools, view, share, timeperiod, chartSetting }: any) => ({
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
