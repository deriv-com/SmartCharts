import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-navigation-widget.scss';

import { NavigationZoominIcon, NavigationZoomoutIcon, HomeIcon, NavigationScaleIcon } from './Icons.jsx';

const NavigationWidget = ({
    zoomIn,
    zoomOut,
    home,
    onScale,
    isHomeEnabled,
    onMouseEnter,
    onMouseLeave,
}) => (
    <div
        className="ciq-navigation-widget"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
    >
        <div
            className={`ciq-navigation-widget__item ${!isHomeEnabled ? 'ciq-navigation-widget__item--hidden' : ''}`}
            onClick={home}
        >
            <HomeIcon />
        </div>
        <div className="ciq-navigation-widget__item" onClick={zoomIn}>
            <NavigationZoominIcon />
        </div>
        <div className="ciq-navigation-widget__item" onClick={onScale}>
            <NavigationScaleIcon />
        </div>
        <div className="ciq-navigation-widget__item" onClick={zoomOut}>
            <NavigationZoomoutIcon />
        </div>
    </div>
);

export default connect(({ chartSize, navigationWidget }) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    home: navigationWidget.onHome,
    onScale: navigationWidget.onScale,
    isHomeEnabled: navigationWidget.isHomeEnabled,
    onMouseEnter: navigationWidget.onMouseEnter,
    onMouseLeave: navigationWidget.onMouseLeave,
}))(NavigationWidget);
