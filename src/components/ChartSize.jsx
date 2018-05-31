import React, { PureComponent } from 'react';
import contextAware from '../contextAware';
import {
    ZoomInIcon,
    ZoomOutIcon,
} from './Icons.jsx';
import '../../sass/components/_chart-size.scss';

class ChartSize extends PureComponent {
    onContextReady(context) {
        this.stx = context.stx;
    }

    zoomIn = () => this.stx.zoomIn();
    zoomOut = () => this.stx.zoomOut();

    render() {
        return (
            <div className="ciq-menu cq-chart-size">
                <div className="cq-menu-btn">
                    <ZoomOutIcon className="ic-icon-with-sub cq-zoom-out" tooltip-title={t.translate('Zoom out')} onClick={this.zoomOut} />
                </div>
                <div className="cq-menu-btn">
                    <ZoomInIcon className="ic-icon-with-sub cq-zoom-in" tooltip-title={t.translate('Zoom in')} onClick={this.zoomIn} />
                </div>
            </div>
        );
    }
}

export default contextAware(ChartSize);
