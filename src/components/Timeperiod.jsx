/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { connect } from '../store/Connect';
import Tooltip from './Tooltip.jsx';
import '../../sass/components/_timeperiod.scss';

const Timeperiod = ({
    chartId,
    enabled,
    interval,
    timeUnit,
    interval_display,
    isMobile,
    onChange,
    setOpen,
    TimePeriodMenu,
    timeUnit_display,
    updateProps,
    newDesign,
    chartType,
}) => {
    const onGranularityClick = (granularity) => {
        onChange(granularity, chartId);
        setOpen(false);
    };
    const ItemClassName = (unit, time) => {
        let className = 'sc-interval__item';

        if (timeUnit === unit && time === interval) {
            className += ' sc-interval__item--active';
        } else if (unit === 'tick' && chartType.id !== 'mountain') {
            className += ' sc-interval__item--disabled';
        }

        return className;
    };

    useEffect(() => updateProps(onChange));

    if (newDesign) {
        return (
            <div className="sc-interval">
                <div className="sc-interval__head">
                    <strong>{t.translate('Time interval')}</strong>
                </div>
                <div className="sc-interval__info">{t.translate('Tick interval only available for "Area" Chart type.')}</div>
                <div className="sc-interval__content">
                    <Tooltip
                        onClick={() => ((chartType.id === 'mountain') ? onGranularityClick(0) : null)}
                        className={ItemClassName('tick', 1)}
                        enabled={(chartType.id !== 'mountain' && !isMobile)}
                        content={t.translate('Available only for "Area" chart type.')}
                    >
                        <span>1 {t.translate('tick')}</span>
                    </Tooltip>
                    <div
                        onClick={() => onGranularityClick(120)}
                        className={ItemClassName('minute', 2)}
                    >
                        <span>2 {t.translate('minutes')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(180)}
                        className={ItemClassName('minute', 3)}
                    >
                        <span>3 {t.translate('minutes')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(300)}
                        className={ItemClassName('minute', 5)}
                    >
                        <span>5 {t.translate('minutes')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(600)}
                        className={ItemClassName('minute', 10)}
                    >
                        <span>10 {t.translate('minutes')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(900)}
                        className={ItemClassName('minute', 15)}
                    >
                        <span>15 {t.translate('minutes')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(1800)}
                        className={ItemClassName('minute', 30)}
                    >
                        <span>30 {t.translate('minutes')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(3600)}
                        className={ItemClassName('hour', 60)}
                    >
                        <span>1 {t.translate('hours')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(7200)}
                        className={ItemClassName('hour', 120)}
                    >
                        <span>2 {t.translate('hours')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(14400)}
                        className={ItemClassName('hour', 240)}
                    >
                        <span>4 {t.translate('hours')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(28800)}
                        className={ItemClassName('hour', 480)}
                    >
                        <span>8 {t.translate('hours')}</span>
                    </div>
                    <div
                        onClick={() => onGranularityClick(86400)}
                        className={ItemClassName('day', 'day')}
                    >
                        <span>1 {t.translate('Day')}</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <TimePeriodMenu
            className="ciq-period"
            enabled={enabled}
            title={isMobile ? t.translate('Interval') : ''}
        >
            <TimePeriodMenu.Title>
                <div className="bt-priod">
                    <span className="ic-priod">
                        <span className="interval_display">{interval_display}</span>
                        <span className="unit_display">{timeUnit_display}</span>
                    </span>
                    <br />
                    <span className="ic-subtitle">{t.translate('Interval')}</span>
                </div>
            </TimePeriodMenu.Title>
            <TimePeriodMenu.Body>
                <div className="sc-interval">
                    <div className="sc-interval__head">
                        <strong>{t.translate('Time interval')}</strong>
                    </div>
                    <div className="sc-interval__content">
                        <div
                            onClick={() => onGranularityClick(0)}
                            className={`sc-interval__item ${timeUnit === 'tick' && interval === 1 ? 'sc-interval__item--active' : ''}`}
                        >1 {t.translate('Tick')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(120)}
                            className={`sc-interval__item ${interval === 2 ? 'sc-interval__item--active' : ''}`}
                        >2 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(180)}
                            className={`sc-interval__item ${interval === 3 ? 'sc-interval__item--active' : ''}`}
                        >3 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(300)}
                            className={`sc-interval__item ${interval === 5 ? 'sc-interval__item--active' : ''}`}
                        >5 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(600)}
                            className={`sc-interval__item ${interval === 10 ? 'sc-interval__item--active' : ''}`}
                        >10 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(900)}
                            className={`sc-interval__item ${interval === 15 ? 'sc-interval__item--active' : ''}`}
                        >15 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(1800)}
                            className={`sc-interval__item ${interval === 30 ? 'sc-interval__item--active' : ''}`}
                        >30 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(3600)}
                            className={`sc-interval__item ${interval === 60 ? 'sc-interval__item--active' : ''}`}
                        >1 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(7200)}
                            className={`sc-interval__item ${interval === 120 ? 'sc-interval__item--active' : ''}`}
                        >2 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(14400)}
                            className={`sc-interval__item ${interval === 240 ? 'sc-interval__item--active' : ''}`}
                        >4 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(28800)}
                            className={`sc-interval__item ${interval === 480 ? 'sc-interval__item--active' : ''}`}
                        >8 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(86400)}
                            className={`sc-interval__item ${timeUnit === 'day' ? 'sc-interval__item--active' : ''}`}
                        >1 {t.translate('Day')}
                        </div>
                    </div>
                </div>
            </TimePeriodMenu.Body>
        </TimePeriodMenu>
    );
};

export default connect(({ timeperiod: s, state, chartType }) => ({
    chartId         : state.chartId,
    timeUnit        : s.timeUnit,
    interval        : s.interval,
    interval_display: s.interval_display,
    isMobile        : s.mainStore.chart.isMobile,
    onChange        : s.setGranularity,
    setOpen         : s.menu.setOpen,
    TimePeriodMenu  : s.TimePeriodMenu,
    timeUnit_display: s.timeUnit_display,
    updateProps     : s.updateProps,
    chartType       : chartType.type,
}))(Timeperiod);
