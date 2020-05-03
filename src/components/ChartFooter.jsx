import React from 'react';
import { connect } from '../store/Connect';
import { HelpCenterIcon, FullScreenIcon } from './Icons.jsx';
import Tooltip from './Tooltip.jsx';
import ChartSetting from './ChartSetting.jsx';
import '../../sass/components/chart-footer.scss';


const NetworkStatusItem = React.memo(({ networkStatus }) => (
    <Tooltip
        className="sc-chart-footer__item sc-chart-footer__item--status"
        content={`${t.translate('Network status')}: ${networkStatus ? (t.translate(networkStatus.tooltip)) : ''}`}
    >
        <div className={`sc-chart__status sc-chart__status--${networkStatus ? networkStatus.class : 'offline'}`} />
    </Tooltip>
));

const ChartFooter = ({ context, serverTime, networkStatus, openFullscreen }) => {
    if (!context) return null;

    return (
        <div className="sc-chart-footer">
            <NetworkStatusItem networkStatus={networkStatus} />
            <div className="sc-chart-footer__item sc-chart-footer__item--time">
                <span>{serverTime}</span>
            </div>
            <div className="ciq-menu ciq-enabled">
                <a href="https://deriv.com/help-centre/" target="_blank" rel="noopener noreferrer">
                    <div className="cq-menu-btn">
                        <HelpCenterIcon />
                    </div>
                </a>
            </div>
            <ChartSetting />
            <div
                className="ciq-menu ciq-enabled"
                onClick={() => openFullscreen()}
            >
                <div className="cq-menu-btn">
                    <FullScreenIcon />
                </div>
            </div>
        </div>
    );
};

export default connect(({ chart }) => ({
    context: chart.context,
    serverTime: chart.serverTime,
    networkStatus: chart.networkStatus,
    openFullscreen: chart.openFullscreen,
}))(ChartFooter);
