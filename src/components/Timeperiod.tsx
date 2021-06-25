/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';

import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import Tooltip from './Tooltip';
import { InlineLoader } from './Loader';
import { Intervals } from '../Constant';
import '../../sass/components/_timeperiod.scss';

type TTimeperiodProps = {
    newDesign?: boolean;
    onChange?: (granularity: number) => void;
};

const Timeperiod: React.FC<TTimeperiodProps> = ({ onChange: onChangeFn, newDesign }) => {
    const { timeperiod, chartType, loader } = useStores();

    const { timeUnit, interval, updateProps, preparingInterval, setPreparingInterval, mainStore } = timeperiod;
    const isMobile = mainStore.chart.isMobile;
    const { type } = chartType;
    const { isActive: isLoading } = loader;
    const onChange = onChangeFn || timeperiod.onGranularityChange;

    const onGranularityClick = (granularity: number) => {
        onChange?.(granularity);
    };
    const onIntervalClick = (chartTypeId: string, key: string, inval: number) => {
        if (key === 'tick' && chartTypeId !== 'mountain') {
            return;
        }
        setPreparingInterval(inval);
        onGranularityClick(inval);
    };
    const enableTooltip = (key: string) => type.id !== 'mountain' && !isMobile && key === 'tick';
    const enableLoader = (inval: number) => isLoading && inval === preparingInterval;
    const ItemClassName = (unit: string, time: number) => {
        let className = 'sc-interval__item';

        if (
            timeUnit === unit &&
            (((unit === 'minute' || unit === 'tick') && time === interval) ||
                (unit === 'hour' && time === (interval as number) / 60) ||
                (unit === 'day' && time === 1))
        ) {
            className += ' sc-interval__item--active';
        } else if (unit === 'tick' && type.id !== 'mountain') {
            className += ' sc-interval__item--disabled';
        }

        return className;
    };

    React.useEffect(() => updateProps(onChange));

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
                                onClick={() => onIntervalClick(type.id, category.key, item.interval)}
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

    return null;
};

export default observer(Timeperiod);
