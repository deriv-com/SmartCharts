// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ZoomInIcon, ZoomOutIcon } from './Icons.jsx';
import '../../sass/components/_chart-size.scss';

const ChartSize = ({
    zoomIn,
    zoomOut,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className='ciq-menu sc-chart-size'>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='cq-menu-btn'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ZoomOutIcon
                className='ic-icon-with-sub cq-zoom-out'
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                tooltip-title={t.translate('Zoom out')}
                onClick={zoomOut}
            />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        <div className='cq-menu-btn'>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <ZoomInIcon
                className='ic-icon-with-sub cq-zoom-in'
                // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                tooltip-title={t.translate('Zoom in')}
                onClick={zoomIn}
            />
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chartSize,
}: any) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
}))(ChartSize);
