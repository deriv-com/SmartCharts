import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-widget.scss';

import { ZoomInIcon, ZoomOutIcon, HomeIcon, ScaleIcon } from './Icons.jsx';

const Widget = ({
    zoomIn,
    zoomOut,
    home,
    onScale,
}) => (
    <div
        className="cq-widget"
    >
        <div className="cq-widget__item" onClick={onScale}>
            <ScaleIcon />
        </div>
        <div className="cq-widget__item" onClick={home}>
            <HomeIcon />
        </div>
        <div className="cq-widget__item cq-widget__item--zoom">
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
}))(Widget);
