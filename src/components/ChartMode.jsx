/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import ChartTypes from './ChartTypes.jsx';
import Timeperiod from './Timeperiod.jsx';
import '../../sass/components/_chart-mode.scss';

const UnitMap = {
    tick: 'T',
    minute: 'M',
    hour: 'H',
    day: 'D',
};

const ChartMode = ({
    ChartTypeMenu,
    menuOpen,
    setOpen,
    onChartType,
    onGranularity,
    Type,
    interval,
    timeUnit,
}) => {
    const handleChartType = (chartType) => {
        onChartType(chartType);
        setOpen(false);
    };
    const handleGranularity = (granularity) => {
        onGranularity(granularity);
        setOpen(false);
    };

    return (
        <ChartTypeMenu
            className="ciq-display ciq-chart-mode"
            title={t.translate('Chart types')}
            newStyle
        >
            <ChartTypeMenu.Title>
                <div className={`ciq-chart-mode__menu ${menuOpen ? 'active' : ''}`}>
                    <span className="ciq-chart-mode__menu__timeperiod">
                        {interval === 'day' ? 1 : interval} {UnitMap[timeUnit]}
                    </span>
                    <Type.icon tooltip-title={t.translate(Type.text)} />
                </div>
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className="ciq-chart-mode__section">
                    <div className="ciq-chart-mode__section__item">
                        <ChartTypes newDesign onChange={handleChartType} />
                    </div>
                    <div className="ciq-chart-mode__section__item">
                        <Timeperiod newDesign onChange={handleGranularity} />
                    </div>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default connect(({ chartMode, chartType, timeperiod }) => ({
    ChartTypeMenu   : chartMode.ChartTypeMenu,
    menuOpen        : chartMode.menu.open,
    setOpen         : chartMode.menu.setOpen,
    Type            : chartType.type,
    timeUnit        : timeperiod.timeUnit,
    interval        : timeperiod.interval,
}))(ChartMode);
