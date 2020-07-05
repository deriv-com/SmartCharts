import React from 'react';
import { connect } from '../store/Connect';
import CrosshairToggle from './CrosshairToggle.jsx';
import { ZoominIcon, ZoomoutIcon, ScaleIcon } from './Icons.jsx';

import '../../sass/components/navigation-widget.scss';

const NavigationWidget = ({
    context,
    zoomIn,
    zoomOut,
    onScale,
    enableScale,
    onMouseEnter,
    onMouseLeave,
    onCrosshairChange,
}) => {
    if (!context) return '';

    return (
        <div
            className="sc-navigation-widget"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className={`sc-navigation-widget__item sc-navigation-widget__item--scale ${!enableScale ? 'sc-navigation-widget__item--hidden' : ''}`}
                onClick={onScale}
            >
                <ScaleIcon />
            </div>
            <div
                className="sc-navigation-widget__item sc-navigation-widget__item--zoom"
            >
                <ZoominIcon onClick={zoomIn} />
                <CrosshairToggle onChange={onCrosshairChange} />
                <ZoomoutIcon onClick={zoomOut} />
            </div>
        </div>
    );
};

export default connect(({ chart, chartSize, navigationWidget }) => ({
    context: chart.context,
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    onScale: navigationWidget.onScale,
    enableScale: navigationWidget.enableScale,
    onMouseEnter: navigationWidget.onMouseEnter,
    onMouseLeave: navigationWidget.onMouseLeave,
}))(NavigationWidget);
