import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './CrosshairToggle' was resolved to '/U... Remove this comment to see the full error message
import CrosshairToggle from './CrosshairToggle';
import '../../sass/components/_navigation-widget.scss';

// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ZoominIcon, ZoomoutIcon, ScaleIcon } from './Icons';

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
        <div className='sc-navigation-widget' onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            <div
                className={classNames('sc-navigation-widget__item', 'sc-navigation-widget__item--scale', {
                    'sc-navigation-widget__item--hidden': !enableScale,
                    'sc-navigation-widget__item--disabled': isScaledOneOne,
                })}
                onClick={onScale}
            >
                <ScaleIcon />
            </div>
            <div className='sc-navigation-widget__item sc-navigation-widget__item--zoom'>
                <ZoominIcon onClick={zoomIn} />
                <CrosshairToggle onChange={onCrosshairChange} />
                <ZoomoutIcon onClick={zoomOut} />
            </div>
        </div>
    ) : null;

export default connect(({ chart, chartSize, navigationWidget }: any) => ({
    context: chart.context,
    isScaledOneOne: chart.isScaledOneOne,
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    onScale: navigationWidget.onScale,
    enableScale: navigationWidget.enableScale,
    onMouseEnter: navigationWidget.onMouseEnter,
    onMouseLeave: navigationWidget.onMouseLeave,
}))(NavigationWidget);
