/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import Tooltip from './Tooltip.jsx';
import { InlineLoader } from './Loader.jsx';
import { Intervals } from '../Constant';
import '../../sass/components/_timeperiod.scss';

const Timeperiod = ({
    chartId,
    interval,
    timeUnit,
    isMobile,
    onChange,
    updateProps,
    newDesign,
    chartType,
    isLoading,
    setPreparingInterval,
    preparingInterval,
}) => {
    const onGranularityClick = granularity => {
        onChange(granularity, chartId);
    };
    const onIntervalClick = (chartTypeId, key, inval) => {
        if (key === 'tick' && chartTypeId !== 'mountain') {
            return;
        }
        setPreparingInterval(inval);
        onGranularityClick(inval);
    };
    const enableTooltip = key => chartType.id !== 'mountain' && !isMobile && key === 'tick';
    const enableLoader = inval => isLoading && inval === preparingInterval;
    const ItemClassName = (unit, time) => {
        let className = 'sc-interval__item';

        if (
            timeUnit === unit &&
            (((unit === 'minute' || unit === 'tick') && time === interval) ||
                (unit === 'hour' && time === interval / 60) ||
                (unit === 'day' && time === 1))
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
            <div className='sc-interval'>
                <div className='sc-interval__head'>
                    <strong>{t.translate('Time interval')}</strong>
                </div>
                <div className='sc-interval__info'>
                    {t.translate('Tick interval only available for "Area" Chart type.')}
                </div>
                <div className='sc-interval__content'>
                    {Intervals.map(category =>
                        category.items.map(item => (
                            <Tooltip
                                key={item.interval}
                                onClick={() => onIntervalClick(chartType.id, category.key, item.interval)}
                                className={classNames(ItemClassName(category.key, item.num), {
                                    'pre-loading': enableLoader(item.interval),
                                })}
                                enabled={enableTooltip(category.key)}
                                content={t.translate('Available only for "Area" chart type.')}
                            >
                                <InlineLoader enabled={enableLoader(item.interval)}>
                                    <span>
                                        {item.num} {t.translate(item.num === 1 ? category.single : category.plural)}
                                    </span>
                                </InlineLoader>
                            </Tooltip>
                        ))
                    )}
                </div>
            </div>
        );
    }
};

export default connect(({ timeperiod: s, chart, chartType, loader }) => ({
    chartId: chart.chartId,
    timeUnit: s.timeUnit,
    interval: s.interval,
    isMobile: s.mainStore.chart.isMobile,
    onChange: s.setGranularity,
    updateProps: s.updateProps,
    chartType: chartType.type,
    isLoading: loader.isActive,
    preparingInterval: s.preparingInterval,
    setPreparingInterval: s.setPreparingInterval,
}))(Timeperiod);
