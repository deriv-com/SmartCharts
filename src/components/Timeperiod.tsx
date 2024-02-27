/* eslint-disable jsx-a11y/no-static-element-interactions */
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useStores } from 'src/store';
import { TGranularity } from 'src/types';
import '../../sass/components/_timeperiod.scss';
import { Intervals } from '../Constant';
import { InlineLoader } from './Loader';
import Tooltip from './Tooltip';

type TTimeperiodItemProps = {
    category: (typeof Intervals)[0];
    item: {
        interval: TGranularity;
        num: number;
    };
    onClick: (chart_type_id: string, key: string, interval: TGranularity) => void;
    isLoading: boolean;
};

const enableLoader = (isLoading: boolean, interval: TGranularity, granularity: TGranularity) =>
    isLoading && interval === granularity;
const enableTooltip = (isMobile: boolean, key: string, chartType_id: string) =>
    !isMobile && chartType_id !== 'line' && key === 'tick';

const TimeperiodItemComponent = ({ item, category, onClick, isLoading }: TTimeperiodItemProps) => {
    const { timeperiod, chartType, chart, state } = useStores();
    const chartTypeId = chartType.type.id;
    const { allowTickChartTypeOnly } = state;
    const { mainStore } = timeperiod;
    const { granularity } = chart;
    const isMobile = mainStore.chart.isMobile as boolean;
    // const { isActive: isLoading } = loader;

    const is_tick = React.useMemo(() => category.key === 'tick', [category]);
    const is_loading = React.useMemo(
        () => enableLoader(isLoading, item.interval, granularity),
        [isLoading, item, granularity]
    );
    const enable_tooltip = React.useMemo(
        () => enableTooltip(isMobile, category.key, chartTypeId),
        [isMobile, category.key, chartTypeId]
    );
    const is_disabled = React.useMemo(
        () => (is_tick && chartTypeId !== 'line') || (!is_tick && allowTickChartTypeOnly),
        [is_tick, chartTypeId, allowTickChartTypeOnly]
    );

    const is_active = item.interval === granularity;

    const handleClick = React.useCallback(
        () => onClick(chartTypeId, category.key, item.interval),
        [chartTypeId, category, item, onClick]
    );

    return (
        <Tooltip
            key={item.interval}
            onClick={handleClick}
            className={classNames('sc-interval__item', {
                'sc-interval__item--active': is_active,
                'sc-interval__item--disabled': is_disabled || isLoading,
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
};

const TimeperiodItem = observer(TimeperiodItemComponent);

type TTimeperiodProps = { portalNodeId?: string; onChange?: (granularity?: TGranularity) => void; newDesign?: boolean };

const Timeperiod = ({ portalNodeId, onChange }: TTimeperiodProps) => {
    const { timeperiod, loader } = useStores();

    const { changeGranularity, setGranularity, updateProps, updatePortalNode } = timeperiod;
    const { isActive: isLoading } = loader;

    const onChangeGranularity = onChange || setGranularity;

    const onIntervalClick = (chart_type_id: string, key: string, interval: TGranularity) => {
        if (isLoading) return;

        if (key === 'tick' && chart_type_id !== 'line') {
            return;
        }
        changeGranularity(interval);
    };

    React.useEffect(() => updateProps(onChangeGranularity));
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
                            onClick={onIntervalClick}
                            isLoading={isLoading}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default observer(Timeperiod);
