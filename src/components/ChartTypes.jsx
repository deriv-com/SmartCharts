/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import { SettingIcon } from './Icons.jsx';
import Tooltip from './Tooltip.jsx';
import '../../sass/components/_chart-types.scss';

const TypeIcon = ({ Icon, props }) => <Icon {...props} />;

const ChartTypes = ({
    chartId,
    ChartTypeList,
    ChartTypeMenu,
    enabled,
    menuOpen,
    onChange,
    setOpen,
    showAggregateDialog,
    Type,
    updateProps,
    newDesign,
    types,
    isMobile,
}) => {
    if (Type === undefined) return null;

    const onItemClick = (idx, chartType) => {
        if (Type.id !== chartType.id) {
            onChange(chartType.id, chartType.candleOnly, chartId);
        }
        setOpen(false);
    };

    updateProps(onChange);

    if (newDesign) {
        return (
            <div className='sc-chart-type'>
                {types.map(chartType => {
                    const Icon = chartType.icon;
                    let className = 'sc-chart-type__item';
                    className += chartType.active ? ' sc-chart-type__item--active' : '';
                    className += chartType.disabled ? ' sc-chart-type__item--disabled' : '';

                    const onClick = () => (chartType.disabled ? null : onItemClick(0, chartType));
                    return (
                        <Tooltip
                            key={chartType.id}
                            enabled={chartType.disabled && !isMobile}
                            className={className}
                            content={t.translate('Available only for non-tick time intervals.')}
                            onClick={onClick}
                        >
                            <Icon />
                            <span className='text'>{t.translate(chartType.text)}</span>
                        </Tooltip>
                    );
                })}
            </div>
        );
    }

    return (
        <ChartTypeMenu className='ciq-display ciq-chart-types' enabled={enabled} title={t.translate('Chart types')}>
            <ChartTypeMenu.Title>
                <TypeIcon
                    Icon={Type.icon}
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate(Type.text)}
                />
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className='body'>
                    <ChartTypeList height={260} onItemClick={onItemClick}>
                        {T => (
                            <>
                                <span className='left'>
                                    <TypeIcon Icon={Type.icon} className={`margin ${T.active ? 'active' : ''}`} />
                                    <span className='ciq-icon-text'>{T.text}</span>
                                </span>
                                {T.settingsOnClick && (
                                    <span className='ciq-aggregate-setting' onClick={() => showAggregateDialog(T.id)}>
                                        <SettingIcon />
                                    </span>
                                )}
                            </>
                        )}
                    </ChartTypeList>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default connect(({ chartType, chart }) => ({
    chartId: chart.chartId,
    ChartTypeMenu: chartType.ChartTypeMenu,
    ChartTypeList: chartType.ChartTypeList,
    menuOpen: chartType.menu.open,
    onChange: chartType.setTypeFromUI,
    setOpen: chartType.menu.setOpen,
    showAggregateDialog: chartType.showAggregateDialog,
    Type: chartType.type,
    updateProps: chartType.updateProps,
    types: chartType.types,
    isMobile: chart.isMobile,
}))(ChartTypes);
