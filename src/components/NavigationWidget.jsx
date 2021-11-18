import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import CrosshairToggle from './CrosshairToggle.jsx';
import '../../sass/components/_navigation-widget.scss';

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
    historical,
}) =>
    context ? (
        <div
            className={classNames('sc-navigation-widget', {
                'sc-navigation-widget__item--indent': historical,
            })}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
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

export default connect(({ chart, chartSize, navigationWidget, chartSetting: s }) => ({
    context: chart.context,
    isScaledOneOne: chart.isScaledOneOne,
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    onScale: navigationWidget.onScale,
    enableScale: navigationWidget.enableScale,
    onMouseEnter: navigationWidget.onMouseEnter,
    onMouseLeave: navigationWidget.onMouseLeave,
    historical: s.historical,
}))(NavigationWidget);
