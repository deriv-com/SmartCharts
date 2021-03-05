import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { HelpCenterIcon, FullScreenIcon } from './Icons';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip';
// @ts-expect-error ts-migrate(6142) FIXME: Module './ChartSetting' was resolved to '/User... Remove this comment to see the full error message
import ChartSetting from './ChartSetting';
import '../../sass/components/_chart-footer.scss';

const ChartFooterNetwork = React.memo(({ networkStatus }: any) => (
    <Tooltip
        className='sc-chart-footer__item sc-chart-footer__item--status'
        content={`${t.translate('Network status')}: ${networkStatus ? t.translate(networkStatus.tooltip) : ''}`}
        enabled
    >
        <div className={`sc-chart__status sc-chart__status--${networkStatus ? networkStatus.class : 'offline'}`} />
    </Tooltip>
));

const ChartFooter = ({ context, serverTime, networkStatus, openFullscreen }: any) =>
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

export default connect(({ chart }: any) => ({
    context: chart.context,
    serverTime: chart.serverTime,
    networkStatus: chart.networkStatus,
    openFullscreen: chart.openFullscreen,
}))(ChartFooter);
