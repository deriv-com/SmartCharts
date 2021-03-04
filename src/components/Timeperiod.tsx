/* eslint-disable jsx-a11y/no-static-element-interactions */
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React, { useEffect } from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Tooltip.jsx' was resolved to '/Users/bal... Remove this comment to see the full error message
import Tooltip from './Tooltip.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Loader.jsx' was resolved to '/Users/bala... Remove this comment to see the full error message
import { InlineLoader } from './Loader.jsx';
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
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='sc-interval'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-interval__head'>
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <strong>{t.translate('Time interval')}</strong>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-interval__info'>
                    {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                    {t.translate('Tick interval only available for "Area" Chart type.')}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='sc-interval__content'>
                    {Intervals.map((category: any) => category.items.map((item: any) => (
// @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
<Tooltip
                        key={item.interval}
                        onClick={() => onIntervalClick(chartType.id, category.key, item.interval)}
                        className={classNames(ItemClassName(category.key, item.num), {
                            'pre-loading': enableLoader(item.interval),
                        })}
                        enabled={enableTooltip(category.key)}
                        // @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'.
                        content={t.translate('Available only for "Area" chart type.')}
>
                        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                        <InlineLoader enabled={enableLoader(item.interval)}>
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            <span>
                                {/* @ts-expect-error ts-migrate(2304) FIXME: Cannot find name 't'. */}
                                {item.num} {t.translate(item.num === 1 ? category.single : category.plural)}
                            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                            </span>
                        </InlineLoader>
</Tooltip>
))
                    )}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        );
    }
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    timeperiod: s,
    chart,
    chartType,
    loader,
}: any) => ({
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
