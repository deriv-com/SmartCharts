/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_timeperiod.scss';

const Timeperiod = ({
    chartId,
    onChange,
    interval,
    timeUnit,
    interval_display,
    timeUnit_display,
    TimePeriodMenu,
    setOpen,
    isMobile,
    enabled,
}) => {
    const onGranularityClick = (granularity) => {
        onChange(granularity, chartId);
        setOpen(false);
    };
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
                <div className="cq-interval">
                    <div className="timeUnit">
                        <span className={timeUnit === 'tick' ? 'selected' : ''}>{t.translate('Tick')}</span>
                        <span className={timeUnit === 'minute' ? 'selected' : ''}>{t.translate('Minute')}</span>
                        <span className={timeUnit === 'hour' ? 'selected' : ''}>{t.translate('Hour')}</span>
                        <span className={timeUnit === 'day' ? 'selected' : ''}>{t.translate('Day')}</span>
                    </div>
                    <div className="interval">
                        <div className="row">
                            <span
                                onClick={() => onGranularityClick(0)}
                                className={timeUnit === 'tick' && interval === 1 ? 'selected' : ''}
                            >1
                            </span>
                        </div>
                        <div className="row">
                            <span
                                onClick={() => onGranularityClick(60)}
                                className={timeUnit === 'minute' && interval === 1 ? 'selected' : ''}
                            >1
                            </span>
                            <span
                                onClick={() => onGranularityClick(120)}
                                className={interval === 2 ? 'selected' : ''}
                            >2
                            </span>
                            <span
                                onClick={() => onGranularityClick(180)}
                                className={interval === 3 ? 'selected' : ''}
                            >3
                            </span>
                            <span
                                onClick={() => onGranularityClick(300)}
                                className={interval === 5 ? 'selected' : ''}
                            >5
                            </span>
                            <span
                                onClick={() => onGranularityClick(600)}
                                className={interval === 10 ? 'selected' : ''}
                            >10
                            </span>
                            <span
                                onClick={() => onGranularityClick(900)}
                                className={interval === 15 ? 'selected' : ''}
                            >15
                            </span>
                            <span
                                onClick={() => onGranularityClick(1800)}
                                className={interval === 30 ? 'selected' : ''}
                            >30
                            </span>
                        </div>
                        <div className="row">
                            <span
                                onClick={() => onGranularityClick(3600)}
                                className={interval === 60 ? 'selected' : ''}
                            >1
                            </span>
                            <span
                                onClick={() => onGranularityClick(7200)}
                                className={interval === 120 ? 'selected' : ''}
                            >2
                            </span>
                            <span
                                onClick={() => onGranularityClick(14400)}
                                className={interval === 240 ? 'selected' : ''}
                            >4
                            </span>
                            <span
                                onClick={() => onGranularityClick(28800)}
                                className={interval === 480 ? 'selected' : ''}
                            >8
                            </span>
                        </div>
                        <div className="row">
                            <span
                                onClick={() => onGranularityClick(86400)}
                                className={timeUnit === 'day' ? 'selected' : ''}
                            >1
                            </span>
                        </div>
                    </div>
                </div>
            </TimePeriodMenu.Body>
        </TimePeriodMenu>
    );
};

export default connect(({ timeperiod: s }) => ({
    chartId: s.chartId,
    onChange: s.setGranularity,
    timeUnit: s.timeUnit,
    interval: s.interval,
    interval_display: s.interval_display,
    timeUnit_display: s.timeUnit_display,
    TimePeriodMenu: s.TimePeriodMenu,
    setOpen: s.menu.setOpen,
    isMobile: s.mainStore.chart.isMobile,
}))(Timeperiod);
