/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { ChartType, TIcon } from 'src/types';
import { TListItem } from 'src/store/ListStore';
import Tooltip from './Tooltip';
import '../../sass/components/_chart-types.scss';
import List from './List';
import Menu from './Menu';

type TTypeIcon = {
    Icon: TIcon;
    className: string;
};

const TypeIcon = ({ Icon, ...props }: TTypeIcon) => <Icon {...props} />;

type TChartTypesProps = {
    enabled?: boolean;
    enabled_chart_types?: string[];
    newDesign?: boolean;
    onChange?: (chartType?: string) => void;
};

const ChartTypes = ({ enabled, enabled_chart_types, newDesign, onChange: onChangeFn }: TChartTypesProps) => {
    const { chartType, chart } = useStores();

    const { listStore, setTypeFromUI, updateProps, types, type, menuStore } = chartType;
    const { open: menuOpen, setOpen } = chartType.menuStore;
    const { isMobile } = chart;

    const onChange = onChangeFn || setTypeFromUI;

    if (type === undefined) return null;

    const onItemClick = (chart_type: ChartType) => {
        if (type.id !== chart_type.id) {
            onChange(chart_type.id);
        }
        setOpen(false);
    };

    updateProps(onChange);

    if (newDesign) {
        return (
            <div className='sc-chart-type'>
                {types.map(chart_type => {
                    const Icon = chart_type.icon;
                    const is_chart_type_disabled =
                        chart_type.disabled || !enabled_chart_types?.includes(chart_type.text);
                    let className = 'sc-chart-type__item';
                    className += chart_type.active ? ' sc-chart-type__item--active' : '';
                    className += is_chart_type_disabled ? ' sc-chart-type__item--disabled' : '';

                    const onClick = () => (is_chart_type_disabled ? null : onItemClick(chart_type));
                    return (
                        <Tooltip
                            key={chart_type.id}
                            enabled={is_chart_type_disabled && !isMobile}
                            className={className}
                            content={t.translate('Available only for non-tick time intervals.')}
                            onClick={onClick}
                        >
                            <Icon />
                            <span className='text'>{t.translate(chart_type.text)}</span>
                        </Tooltip>
                    );
                })}
            </div>
        );
    }

    return (
        <Menu
            store={menuStore}
            className='ciq-display ciq-chart-types'
            enabled={enabled}
            title={t.translate('Chart types')}
        >
            <Menu.Title>
                <TypeIcon
                    Icon={type.icon}
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate(type.text)}
                />
            </Menu.Title>
            <Menu.Body>
                <div className='body'>
                    <List height={260} store={listStore}>
                        {(T: TListItem) => (
                            <>
                                <span className='left'>
                                    <TypeIcon Icon={type.icon} className={`margin ${T.active ? 'active' : ''}`} />
                                    <span className='ciq-icon-text'>{T.text}</span>
                                </span>
                            </>
                        )}
                    </List>
                </div>
            </Menu.Body>
        </Menu>
    );
};

export default observer(ChartTypes);
