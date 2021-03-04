// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './CrosshairToggle.jsx' was resolved to '/U... Remove this comment to see the full error message
import CrosshairToggle from './CrosshairToggle.jsx';
import '../../sass/components/_navigation-widget.scss';

// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ZoominIcon, ZoomoutIcon, ScaleIcon } from './Icons.jsx';

const NavigationWidget = ({
    context,
    zoomIn,
    zoomOut,
    onScale,
    enableScale,
    onMouseEnter,
    onMouseLeave,
    isScaledOneOne,
    onCrosshairChange,
}: any) =>
    context ? (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <div className='sc-navigation-widget' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div
                className={classNames('sc-navigation-widget__item', 'sc-navigation-widget__item--scale', {
                    'sc-navigation-widget__item--hidden': !enableScale,
                    'sc-navigation-widget__item--disabled': isScaledOneOne,
                })}
                onClick={onScale}
            >
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ScaleIcon />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='sc-navigation-widget__item sc-navigation-widget__item--zoom'>
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ZoominIcon onClick={zoomIn} />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <CrosshairToggle onChange={onCrosshairChange} />
                {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                <ZoomoutIcon onClick={zoomOut} />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
        </div>
    ) : null;

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    chart,
    chartSize,
    navigationWidget,
}: any) => ({
    context: chart.context,
    isScaledOneOne: chart.isScaledOneOne,
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    onScale: navigationWidget.onScale,
    enableScale: navigationWidget.enableScale,
    onMouseEnter: navigationWidget.onMouseEnter,
    onMouseLeave: navigationWidget.onMouseLeave,
}))(NavigationWidget);
