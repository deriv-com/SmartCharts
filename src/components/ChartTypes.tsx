/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { ChartType } from 'src/types';
import { TListItem } from 'src/store/ListStore';
import Tooltip from './Tooltip';
import '../../sass/components/_chart-types.scss';
import List from './List';
import Menu from './Menu';

type TTypeIcon = {
    Icon: React.FC;
    className: string;
};

const TypeIcon: React.FC<TTypeIcon> = ({ Icon, ...props }) => <Icon {...props} />;

type TChartTypesProps = {
    enabled?: boolean;
    newDesign?: boolean;
    onChange?: any;
};

const ChartTypes: React.FC<TChartTypesProps> = ({ enabled, newDesign, onChange: onChangeFn }) => {
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
                    let className = 'sc-chart-type__item';
                    className += chart_type.active ? ' sc-chart-type__item--active' : '';
                    className += chart_type.disabled ? ' sc-chart-type__item--disabled' : '';

                    const onClick = () => (chart_type.disabled ? null : onItemClick(chart_type));
                    return (
                        <Tooltip
                            key={chart_type.id}
                            enabled={chart_type.disabled && !isMobile}
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
