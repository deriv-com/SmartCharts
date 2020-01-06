/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { connect } from '../store/Connect';
import { CircleInfoIcon } from './Icons.jsx';
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
}) => {
    const onGranularityClick = (granularity) => {
        onChange(granularity, chartId);
        setOpen(false);
    };

    useEffect(() => updateProps(onChange));

    if (newDesign) {
        return (
            <div className="cq-interval">
                <div className="cq-interval__head">
                    <strong>{t.translate('Time interval')}</strong> <CircleInfoIcon />
                </div>
                <div className="cq-interval__content">
                    <div
                        onClick={() => onGranularityClick(0)}
                        className={`cq-interval__item ${timeUnit === 'tick' && interval === 1 ? 'cq-interval__item--active' : ''}`}
                    >1 {t.translate('Tick')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(120)}
                        className={`cq-interval__item ${interval === 2 ? 'cq-interval__item--active' : ''}`}
                    >2 {t.translate('Minute')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(180)}
                        className={`cq-interval__item ${interval === 3 ? 'cq-interval__item--active' : ''}`}
                    >3 {t.translate('Minute')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(300)}
                        className={`cq-interval__item ${interval === 5 ? 'cq-interval__item--active' : ''}`}
                    >5 {t.translate('Minute')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(600)}
                        className={`cq-interval__item ${interval === 10 ? 'cq-interval__item--active' : ''}`}
                    >10 {t.translate('Minute')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(900)}
                        className={`cq-interval__item ${interval === 15 ? 'cq-interval__item--active' : ''}`}
                    >15 {t.translate('Minute')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(1800)}
                        className={`cq-interval__item ${interval === 30 ? 'cq-interval__item--active' : ''}`}
                    >30 {t.translate('Minute')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(3600)}
                        className={`cq-interval__item ${interval === 60 ? 'cq-interval__item--active' : ''}`}
                    >1 {t.translate('Hour')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(7200)}
                        className={`cq-interval__item ${interval === 120 ? 'cq-interval__item--active' : ''}`}
                    >2 {t.translate('Hour')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(14400)}
                        className={`cq-interval__item ${interval === 240 ? 'cq-interval__item--active' : ''}`}
                    >4 {t.translate('Hour')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(28800)}
                        className={`cq-interval__item ${interval === 480 ? 'cq-interval__item--active' : ''}`}
                    >8 {t.translate('Hour')}
                    </div>
                    <div
                        onClick={() => onGranularityClick(86400)}
                        className={`cq-interval__item ${timeUnit === 'day' ? 'cq-interval__item--active' : ''}`}
                    >1 {t.translate('Day')}
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
                <div className="cq-interval">
                    <div className="cq-interval__head">
                        <strong>{t.translate('Time interval')}</strong> <CircleInfoIcon />
                    </div>
                    <div className="cq-interval__content">
                        <div
                            onClick={() => onGranularityClick(0)}
                            className={`cq-interval__item ${timeUnit === 'tick' && interval === 1 ? 'cq-interval__item--active' : ''}`}
                        >1 {t.translate('Tick')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(120)}
                            className={`cq-interval__item ${interval === 2 ? 'cq-interval__item--active' : ''}`}
                        >2 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(180)}
                            className={`cq-interval__item ${interval === 3 ? 'cq-interval__item--active' : ''}`}
                        >3 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(300)}
                            className={`cq-interval__item ${interval === 5 ? 'cq-interval__item--active' : ''}`}
                        >5 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(600)}
                            className={`cq-interval__item ${interval === 10 ? 'cq-interval__item--active' : ''}`}
                        >10 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(900)}
                            className={`cq-interval__item ${interval === 15 ? 'cq-interval__item--active' : ''}`}
                        >15 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(1800)}
                            className={`cq-interval__item ${interval === 30 ? 'cq-interval__item--active' : ''}`}
                        >30 {t.translate('Minute')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(3600)}
                            className={`cq-interval__item ${interval === 60 ? 'cq-interval__item--active' : ''}`}
                        >1 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(7200)}
                            className={`cq-interval__item ${interval === 120 ? 'cq-interval__item--active' : ''}`}
                        >2 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(14400)}
                            className={`cq-interval__item ${interval === 240 ? 'cq-interval__item--active' : ''}`}
                        >4 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(28800)}
                            className={`cq-interval__item ${interval === 480 ? 'cq-interval__item--active' : ''}`}
                        >8 {t.translate('Hour')}
                        </div>
                        <div
                            onClick={() => onGranularityClick(86400)}
                            className={`cq-interval__item ${timeUnit === 'day' ? 'cq-interval__item--active' : ''}`}
                        >1 {t.translate('Day')}
                        </div>
                    </div>
                </div>
            </TimePeriodMenu.Body>
        </TimePeriodMenu>
    );
};

export default connect(({ timeperiod: s, state }) => ({
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
}))(Timeperiod);
