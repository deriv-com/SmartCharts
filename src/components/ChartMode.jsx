/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import ChartTypes from './ChartTypes.jsx';
import Timeperiod from './Timeperiod.jsx';
import {
    TypeAreaGrayscaleIcon,
    TypeCandleGrayscaleIcon,
    TypeHollowGrayscaleIcon,
    TypeOhlcGrayscaleIcon,
} from './Icons.jsx';
import '../../sass/components/chart-mode.scss';

const UnitMap = {
    tick: 'T',
    minute: 'M',
    hour: 'H',
    day: 'D',
};

const TimeMap = {
    tick: 1,
    minute: 1,
    hour: 60,
};

const TypeMap = {
    mountain: TypeAreaGrayscaleIcon,
    candle: TypeCandleGrayscaleIcon,
    colored_bar: TypeOhlcGrayscaleIcon,
    hollow_candle: TypeHollowGrayscaleIcon,
};

const ChartMode = ({
    ChartTypeMenu,
    menuOpen,
    onChartType,
    onGranularity,
    Type,
    interval,
    timeUnit,
    portalNodeId,
}) => {
    const TypeIcon = TypeMap[Type.id];
    return (
        <ChartTypeMenu
            className="ciq-display sc-chart-mode"
            title={t.translate('Chart types')}
            tooltip={t.translate('Chart types')}
            newStyle
            isFullscreen
            portalNodeId={portalNodeId}
        >
            <ChartTypeMenu.Title>
                <div className={`sc-chart-mode__menu ${menuOpen ? 'sc-chart-mode__menu--active' : ''}`}>
                    <span className="sc-chart-mode__menu__timeperiod">
                        {interval === 'day' ? 1 : (interval / TimeMap[timeUnit])} {UnitMap[timeUnit]}
                    </span>
                    <TypeIcon tooltip-title={t.translate(Type.text)} />
                </div>
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className="sc-chart-mode__section">
                    <div className="sc-chart-mode__section__item">
                        <ChartTypes onChange={onChartType} />
                    </div>
                    <div className="sc-chart-mode__section__item">
                        <Timeperiod onChange={onGranularity} />
                    </div>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default connect(({ chartMode, chartType, timeperiod }) => ({
    ChartTypeMenu   : chartMode.ChartTypeMenu,
    menuOpen        : chartMode.menu.open,
    Type            : chartType.type,
    timeUnit        : timeperiod.timeUnit,
    interval        : timeperiod.interval,
}))(ChartMode);
