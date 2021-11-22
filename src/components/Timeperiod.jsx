/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import Tooltip from './Tooltip.jsx';
import { InlineLoader } from './Loader.jsx';
import { Intervals } from '../Constant';
import '../../sass/components/_timeperiod.scss';

const enableLoader = (isLoading, inval, preparingInterval) => isLoading && inval === preparingInterval;
const enableTooltip = (isMobile, key, chartType_id) => !isMobile && chartType_id !== 'mountain' && key === 'tick';

const TimeperiodItem = React.memo(
    ({ item, category, isLoading, isMobile, chartTypeId, interval, timeUnit, preparingInterval, onClick }) => {
        const is_tick = React.useMemo(() => category.key === 'tick', [category]);
        const is_loading = React.useMemo(() => enableLoader(isLoading, item.interval, preparingInterval), [
            isLoading,
            item,
            preparingInterval,
        ]);
        const enable_tooltip = React.useMemo(() => enableTooltip(isMobile, category.key, chartTypeId), [
            isMobile,
            category.key,
            chartTypeId,
        ]);
        const is_disabled = React.useMemo(() => is_tick && chartTypeId !== 'mountain', [is_tick, chartTypeId]);
        const is_active = React.useMemo(
            () =>
                timeUnit === category.key &&
                (((category.key === 'minute' || is_tick) && item.num === interval) ||
                    (category.key === 'hour' && item.num === interval / 60) ||
                    (category.key === 'day' && item.num === 1)),
            [is_tick, category, item, interval, timeUnit]
        );

        const handleClick = React.useCallback(() => onClick(chartTypeId, category.key, item.interval), [
            chartTypeId,
            category,
            item,
            onClick,
        ]);

        return (
            <Tooltip
                key={item.interval}
                onClick={handleClick}
                className={classNames('sc-interval__item', {
                    'sc-interval__item--active': is_active,
                    'sc-interval__item--disabled': is_disabled,
                    'pre-loading': is_loading,
                })}
                enabled={enable_tooltip}
                content={t.translate('Available only for "Area" chart type.')}
            >
                <InlineLoader enabled={is_loading}>
                    <span>
                        {item.num} {t.translate(item.num === 1 ? category.single : category.plural)}
                    </span>
                </InlineLoader>
            </Tooltip>
        );
    }
);

const Timeperiod = ({
    chartId,
    interval,
    timeUnit,
    isMobile,
    onChange,
    updateProps,
    chartTypeId,
    isLoading,
    preparingInterval,
    changeGranularity,
    updatePortalNode,
    portalNodeId,
}) => {
    const onIntervalClick = (chart_type_id, key, inval) => {
        if (key === 'tick' && chart_type_id !== 'mountain') {
            return;
        }
        changeGranularity(inval, chartId);
    };
    React.useEffect(() => updateProps(onChange));
    updatePortalNode(portalNodeId);

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
                        <TimeperiodItem
                            key={item.interval}
                            item={item}
                            category={category}
                            isLoading={isLoading}
                            isMobile={isMobile}
                            chartTypeId={chartTypeId}
                            interval={interval}
                            timeUnit={timeUnit}
                            preparingInterval={preparingInterval}
                            onClick={onIntervalClick}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default connect(({ timeperiod: s, chart, chartType, loader }) => ({
    chartId: chart.chartId,
    timeUnit: s.timeUnit,
    interval: s.interval,
    isMobile: s.mainStore.chart.isMobile,
    onChange: s.setGranularity,
    updateProps: s.updateProps,
    chartTypeId: chartType.type.id,
    isLoading: loader.isActive,
    preparingInterval: s.preparingInterval,
    changeGranularity: s.changeGranularity,
    updatePortalNode: s.updatePortalNode,
}))(Timeperiod);
