import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-navigation-widget.scss';

import { ZoominIcon, ZoomoutIcon, HomeIcon, ScaleIcon } from './Icons.jsx';

const NavigationWidget = ({
    zoomIn,
    zoomOut,
    home,
    onScale,
    isHomeEnabled,
}) => (
    <div
        className="ciq-navigation-widget"
    >
        <div
            className={`ciq-navigation-widget__item ${!isHomeEnabled ? 'ciq-navigation-widget__item--hidden' : ''}`}
            onClick={home}
        >
            <HomeIcon />
        </div>
        <div className="ciq-navigation-widget__item" onClick={onScale}>
            <ScaleIcon />
        </div>
        <div className="ciq-navigation-widget__item ciq-navigation-widget__item--zoom">
            <ZoominIcon onClick={zoomIn} />
            <ZoomoutIcon onClick={zoomOut} />
        </div>
    </div>
);

export default connect(({ chartSize, navigationWidget }) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    home: navigationWidget.onHome,
    onScale: navigationWidget.onScale,
    isHomeEnabled: navigationWidget.isHomeEnabled,
}))(NavigationWidget);
