import React, {PureComponent} from 'react';
import contextAware from '../contextAware';

class ChartSize extends PureComponent {
    onContextReady (context) {
        this.stx = context.stx;
    }

    zoomIn = () => this.stx.zoomIn();
    zoomOut = () => this.stx.zoomOut();

    render () {
        return (
            <div className="cq-chart-size">
                <span className='cq-zoom-out' onClick={this.zoomOut} />
                <span className='cq-zoom-in' onClick={this.zoomIn} />
            </div>
        );
    }
};

export default contextAware(ChartSize);