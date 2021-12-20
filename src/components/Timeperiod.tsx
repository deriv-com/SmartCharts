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
    category: typeof Intervals[0];
    item: {
        interval: number;
        num: number;
    };
    onClick: (chart_type_id: string, key: string, inval: number) => void;
};

const enableLoader = (isLoading: boolean, inval: number, preparingInterval: number | null) =>
    isLoading && inval === preparingInterval;
const enableTooltip = (isMobile: boolean, key: string, chartType_id: string) =>
    !isMobile && chartType_id !== 'mountain' && key === 'tick';

const TimeperiodItemComponent = ({ item, category, onClick }: TTimeperiodItemProps) => {
    const { timeperiod, chartType, loader } = useStores();
    const chartTypeId = chartType.type.id;
    const { timeUnit, interval, preparingInterval, mainStore } = timeperiod;
    const isMobile = mainStore.chart.isMobile as boolean;
    const { isActive: isLoading } = loader;

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
                (category.key === 'hour' && typeof interval === 'number' && item.num === interval / 60) ||
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
};

const TimeperiodItem = observer(TimeperiodItemComponent);

type TTimeperiodProps = { portalNodeId?: string; onChange?: (granularity?: TGranularity) => void; newDesign?: boolean };

const Timeperiod = ({ portalNodeId, onChange }: TTimeperiodProps) => {
    const { timeperiod } = useStores();

    const { setGranularity, updateProps, changeGranularity, updatePortalNode } = timeperiod;

    const onChangeGranularity = onChange || setGranularity;

    const onIntervalClick = (chart_type_id: string, key: string, inval: number) => {
        if (key === 'tick' && chart_type_id !== 'mountain') {
            return;
        }
        changeGranularity(inval as TGranularity);
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
                        <TimeperiodItem key={item.interval} item={item} category={category} onClick={onIntervalClick} />
                    ))
                )}
            </div>
        </div>
    );
};

export default observer(Timeperiod);
