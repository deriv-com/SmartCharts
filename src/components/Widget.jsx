import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-widget.scss';

import { ZoomInIcon, ZoomOutIcon, HomeIcon, ScaleIcon } from './Icons.jsx';

const Widget = ({
    zoomIn,
    zoomOut,
    home,
    onScale,
    enableHome,
}) => (
    <div
        className="ciq-widget"
    >
        {enableHome ? (
            <div className="ciq-widget__item" onClick={home}>
                <HomeIcon />
            </div>
        ) : ''}
        <div className="ciq-widget__item" onClick={onScale}>
            <ScaleIcon />
        </div>
        <div className="ciq-widget__item ciq-widget__item--zoom">
            <ZoomInIcon onClick={zoomIn} />
            <ZoomOutIcon onClick={zoomOut} />
        </div>
    </div>
);

export default connect(({ chartSize, widget }) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
    home: widget.onHome,
    onScale: widget.onScale,
    enableHome: widget.enableHome,
}))(Widget);
