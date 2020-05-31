/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import Tooltip from './Tooltip.jsx';
import '../../sass/components/chart-types.scss';

const ChartTypes = ({
    chartId,
    onChange,
    setOpen,
    Type,
    updateProps,
    types,
    isMobile,
}) => {
    if (Type === undefined) return (null);

    const onItemClick = (idx, chartType) => {
        if (Type.id !== chartType.id) {
            onChange(chartType.id, chartType.candleOnly, chartId);
        }
        setOpen(false);
    };

    updateProps(onChange);

    return (
        <div className="sc-chart-type">
            {types.map((chartType) => {
                const Icon = chartType.icon;
                let className = 'sc-chart-type__item';
                className += chartType.active ? ' sc-chart-type__item--active' : '';
                className += chartType.disabled ? ' sc-chart-type__item--disabled' : '';

                const onClick = () => (chartType.disabled ? null : onItemClick(0, chartType));
                return (
                    <Tooltip
                        key={chartType.id}
                        enabled={(chartType.disabled && !isMobile)}
                        className={className}
                        content={t.translate('Available only for non-tick time intervals.')}
                        onClick={onClick}
                    >
                        <Icon />
                        <span className="text">{t.translate(chartType.text)}</span>
                    </Tooltip>
                );
            })}
        </div>
    );
};

export default connect(({ chartType, state, chart }) => ({
    chartId            : state.chartId,
    onChange           : chartType.setTypeFromUI,
    setOpen            : chartType.menu.setOpen,
    Type               : chartType.type,
    updateProps        : chartType.updateProps,
    types              : chartType.types,
    isMobile           : chart.isMobile,
}))(ChartTypes);
