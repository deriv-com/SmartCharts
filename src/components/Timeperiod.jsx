/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import { connect } from '../store/Connect';
import Tooltip from './Tooltip.jsx';
import { InlineLoader } from './Loader.jsx';
import '../../sass/components/timeperiod.scss';
import { Intervals } from '../Constant';

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
    isLoading,
    setPreparingInterval,
    preparingInterval,
}) => {
    const onGranularityClick = (granularity) => {
        onChange(granularity, chartId);
        setOpen(false);
    };
    const onIntervalClick = (chartTypeId, key, inval) => {
        if (key === 'tick' && chartTypeId !== 'mountain') { return; }
        setPreparingInterval(inval);
        onGranularityClick(inval);
    };
    const enableTooltip = key => ((chartType.id !== 'mountain' && !isMobile && key === 'tick'));
    const enableLoader = inval => (isLoading && inval === preparingInterval);
    const ItemClassName = (unit, time) => {
        let className = 'sc-interval__item';

        if (
            timeUnit === unit && (
                (unit === 'minute' || unit === 'tick') && time === interval
                || unit === 'hour' && time === (interval / 60)
                || unit === 'day' && time === 1
            )
        ) {
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
                    {
                        Intervals.map(category => (
                            category.items.map(item => (
                                <Tooltip
                                    key={item.interval}
                                    onClick={() => onIntervalClick(chartType.id, category.key, item.interval)}
                                    className={`${ItemClassName(category.key, item.num)} ${enableLoader(item.interval) ? 'pre-loading' : ''}`}
                                    enabled={enableTooltip(category.key)}
                                    content={t.translate('Available only for "Area" chart type.')}
                                >
                                    <InlineLoader
                                        enabled={enableLoader(item.interval)}
                                    >
                                        <span>{item.num} {item.num === 1 ? category.single : category.plural}</span>
                                    </InlineLoader>
                                </Tooltip>
                            ))
                        ))
                    }
                </div>
            </div>
        );
    }

    // TODO
    // should remove this after first integerated release with deriv.app
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

export default connect(({ timeperiod: s, state, chartType, loader }) => ({
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
    isLoading       : loader.isActive,
    preparingInterval       : s.preparingInterval,
    setPreparingInterval    : s.setPreparingInterval,
}))(Timeperiod);
