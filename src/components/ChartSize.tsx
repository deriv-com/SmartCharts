import React from 'react';
import { observer } from 'mobx-react-lite';
import { ZoomInIcon, ZoomOutIcon } from './Icons';
import '../../sass/components/_chart-size.scss';
import { useStores } from 'src/store';

const ChartSize: React.FC = () => {
    const { chartSize } = useStores();
    const { zoomIn, zoomOut } = chartSize;

    return (
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
};

export default observer(ChartSize);
