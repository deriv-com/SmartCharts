import React from 'react';
import { connect } from '../store/Connect';
import CrosshairToggle from './CrosshairToggle.jsx';
import '../../sass/components/_ciq-navigation-widget.scss';

import { ZoominIcon, ZoomoutIcon, ScaleIcon } from './Icons.jsx';

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
            className="ciq-navigation-widget"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div
                className={`ciq-navigation-widget__item ciq-navigation-widget__item--scale ${!enableScale ? 'ciq-navigation-widget__item--hidden' : ''}`}
                onClick={onScale}
            >
                <ScaleIcon />
            </div>
            <div
                className="ciq-navigation-widget__item ciq-navigation-widget__item--zoom"
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
