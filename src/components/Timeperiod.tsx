/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect } from 'react';

import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Loader' was resolved to '/Users/bala... Remove this comment to see the full error message
import { InlineLoader } from './Loader';
// @ts-expect-error ts-migrate(6142) FIXME: Module '../Constant' was resolved to '/Users/balak... Remove this comment to see the full error message
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
}: any) => {
    const onGranularityClick = (granularity: any) => {
        onChange(granularity, chartId);
    };
    const onIntervalClick = (chartTypeId: any, key: any, inval: any) => {
        if (key === 'tick' && chartTypeId !== 'mountain') {
            return;
        }
        setPreparingInterval(inval);
        onGranularityClick(inval);
    };
    const enableTooltip = (key: any) => chartType.id !== 'mountain' && !isMobile && key === 'tick';
    const enableLoader = (inval: any) => isLoading && inval === preparingInterval;
    const ItemClassName = (unit: any, time: any) => {
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
                    {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                    {t.translate('Tick interval only available for "Area" Chart type.')}
                </div>
                <div className='sc-interval__content'>
                    {Intervals.map((category: any) =>
                        category.items.map((item: any) => (
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
                                        {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
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

export default connect(({ timeperiod: s, chart, chartType, loader }: any) => ({
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
