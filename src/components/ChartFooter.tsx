import React from 'react';
import { TMainStore } from 'src/types';
import { useStores } from 'src/store';
import { observer } from 'mobx-react-lite';
import { HelpCenterIcon, FullScreenIcon } from './Icons';
import Tooltip from './Tooltip';
import ChartSetting from './ChartSetting';
import '../../sass/components/_chart-footer.scss';

type TChartFooterNetworkProps = {
    networkStatus: TMainStore['chart']['networkStatus'];
};

const ChartFooterNetwork = React.memo(({ networkStatus }: TChartFooterNetworkProps) => (
    <Tooltip
        className='sc-chart-footer__item sc-chart-footer__item--status'
        content={`${t.translate('Network status')}: ${networkStatus ? t.translate(networkStatus.tooltip) : ''}`}
        enabled
    >
        <div className={`sc-chart__status sc-chart__status--${networkStatus ? networkStatus.class : 'offline'}`} />
    </Tooltip>
));

const ChartFooter = () => {
    const { chart } = useStores();
    const { context, serverTime, networkStatus, openFullscreen } = chart;

    return context ? (
        <div className='sc-chart-footer'>
            <ChartFooterNetwork networkStatus={networkStatus} />
            <div className='sc-chart-footer__item sc-chart-footer__item--time'>
                <span>{serverTime}</span>
            </div>
            <div className='ciq-menu ciq-enabled'>
                <a href='https://deriv.com/help-centre/' target='_blank' rel='noopener noreferrer'>
                    <div className='cq-menu-btn'>
                        <HelpCenterIcon />
                    </div>
                </a>
            </div>
            <ChartSetting />
            <div className='ciq-menu ciq-enabled' onClick={() => openFullscreen()}>
                <div className='cq-menu-btn'>
                    <FullScreenIcon />
                </div>
            </div>
        </div>
    ) : null;
};

export default observer(ChartFooter);
