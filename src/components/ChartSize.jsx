import React from 'react';
import { connect } from '../store/Connect';
import { ZoomInIcon, ZoomOutIcon } from './Icons.jsx';
import '../../sass/components/_chart-size.scss';

const ChartSize = ({ zoomIn, zoomOut }) => (
    <div className='ciq-menu sc-chart-size'>
        <div className='cq-menu-btn'>
            <ZoomOutIcon
                className='ic-icon-with-sub cq-zoom-out'
                tooltip-title={t.translate('Zoom out')}
                onClick={zoomOut}
            />
        </div>
        <div className='cq-menu-btn'>
            <ZoomInIcon
                className='ic-icon-with-sub cq-zoom-in'
                tooltip-title={t.translate('Zoom in')}
                onClick={zoomIn}
            />
        </div>
    </div>
);

export default connect(({ chartSize }) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
}))(ChartSize);
