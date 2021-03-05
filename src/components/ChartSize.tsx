import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ZoomInIcon, ZoomOutIcon } from './Icons';
import '../../sass/components/_chart-size.scss';

const ChartSize = ({ zoomIn, zoomOut }: any) => (
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

export default connect(({ chartSize }: any) => ({
    zoomIn: chartSize.zoomIn,
    zoomOut: chartSize.zoomOut,
}))(ChartSize);
