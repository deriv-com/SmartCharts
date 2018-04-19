import React, {PureComponent} from 'react';
import contextAware from '../contextAware';
import {
    MinusIcon as ZoomOut,
    AddIcon as ZoomIn,
} from './Icons.jsx';

class ChartSize extends PureComponent {
    onContextReady (context) {
        this.stx = context.stx;
    }

    zoomIn = () => this.stx.zoomIn();
    zoomOut = () => this.stx.zoomOut();

    render () {
        return (
            <div className="cq-chart-size">
                <ZoomOut className='cq-zoom-out' tooltip-title={t.translate("Zoom out")} onClick={this.zoomOut} />
                <ZoomIn className='cq-zoom-in' tooltip-title={t.translate("Zoom in")} onClick={this.zoomIn} />
            </div>
        );
    }
}

export default contextAware(ChartSize);
