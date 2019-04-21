import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-widget.scss';

import { ZoomInIcon, ZoomOutIcon, HomeIcon, ScaleFullIcon } from './Icons.jsx';

const Widget = ({
    zoomIn,
    zoomOut,
    home,
}) => (
    <div
        className="cq-widget"
    >
        <div className="cq-widget__item">
            <ScaleFullIcon />
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
}))(Widget);
