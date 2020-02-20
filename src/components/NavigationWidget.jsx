import React from 'react';
import { connect } from '../store/Connect';
import CrosshairToggle from './CrosshairToggle.jsx';
import '../../sass/components/_ciq-navigation-widget.scss';

import { ZoominIcon, ZoomoutIcon, ScaleIcon } from './Icons.jsx';

const NavigationWidget = ({
    zoomIn,
    zoomOut,
    onScale,
    enableScale,
    onMouseEnter,
    onMouseLeave,
}) => (
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
            <CrosshairToggle />
            <ZoomoutIcon onClick={zoomOut} />
        </div>
    </div>
);

export default connect(({ chartSize, navigationWidget }) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    onScale: navigationWidget.onScale,
    enableScale: navigationWidget.enableScale,
    onMouseEnter: navigationWidget.onMouseEnter,
    onMouseLeave: navigationWidget.onMouseLeave,
}))(NavigationWidget);
