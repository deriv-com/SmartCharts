// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { HelpCenterIcon, FullScreenIcon } from './Icons.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartSetting.jsx' was resolved to '/User... Remove this comment to see the full error message
import ChartSetting from './ChartSetting.jsx';
import '../../sass/components/_chart-footer.scss';

const ChartFooterNetwork = React.memo(({
    networkStatus,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <Tooltip
        className='sc-chart-footer__item sc-chart-footer__item--status'
        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
        content={`${t.translate('Network status')}: ${networkStatus ? t.translate(networkStatus.tooltip) : ''}`}
        enabled
    >
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className={`sc-chart__status sc-chart__status--${networkStatus ? networkStatus.class : 'offline'}`} />
    </Tooltip>
));

const ChartFooter = ({
    context,
    serverTime,
    networkStatus,
    openFullscreen,
}: any) =>
    context ? (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-chart-footer'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartFooterNetwork networkStatus={networkStatus} />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-chart-footer__item sc-chart-footer__item--time'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span>{serverTime}</span>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='ciq-menu ciq-enabled'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <a href='https://deriv.com/help-centre/' target='_blank' rel='noopener noreferrer'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='cq-menu-btn'>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <HelpCenterIcon />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </a>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ChartSetting />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='ciq-menu ciq-enabled' onClick={() => openFullscreen()}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='cq-menu-btn'>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    <FullScreenIcon />
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    ) : null;

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chart,
}: any) => ({
    context: chart.context,
    serverTime: chart.serverTime,
    networkStatus: chart.networkStatus,
    openFullscreen: chart.openFullscreen,
}))(ChartFooter);
