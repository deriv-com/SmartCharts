import React, {PureComponent} from 'react';
import contextAware from '../contextAware';
import {
    ZoomInIcon,
    ZoomOutIcon,
} from './Icons.jsx';

class ChartSize extends PureComponent {
    onContextReady (context) {
        this.stx = context.stx;
    }

    zoomIn = () => this.stx.zoomIn();
    zoomOut = () => this.stx.zoomOut();

    render () {
        return (
            <div className="ciq-menu cq-chart-size">
                <ZoomOutIcon className='ic-icon-with-sub cq-zoom-out' tooltip-title={t.translate("Zoom out")} onClick={this.zoomOut} />
                <ZoomInIcon className='ic-icon-with-sub cq-zoom-in' tooltip-title={t.translate("Zoom in")} onClick={this.zoomIn} />
            </div>
        );
    }
}

export default contextAware(ChartSize);
