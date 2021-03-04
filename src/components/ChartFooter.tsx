import React from 'react';
import { connect } from '../store/Connect';
import { HelpCenterIcon, FullScreenIcon } from './Icons.jsx';
import Tooltip from './Tooltip.jsx';
import ChartSetting from './ChartSetting.jsx';
import '../../sass/components/_chart-footer.scss';

const ChartFooterNetwork = React.memo(({ networkStatus }) => (
    <Tooltip
        className='sc-chart-footer__item sc-chart-footer__item--status'
        content={`${t.translate('Network status')}: ${networkStatus ? t.translate(networkStatus.tooltip) : ''}`}
        enabled
    >
        <div className={`sc-chart__status sc-chart__status--${networkStatus ? networkStatus.class : 'offline'}`} />
    </Tooltip>
));

const ChartFooter = ({ context, serverTime, networkStatus, openFullscreen }) =>
    context ? (
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

export default connect(({ chart }) => ({
    context: chart.context,
    serverTime: chart.serverTime,
    networkStatus: chart.networkStatus,
    openFullscreen: chart.openFullscreen,
}))(ChartFooter);
