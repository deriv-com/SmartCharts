/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { ChartType } from 'src/types';
import { SettingIcon } from './Icons';
import Tooltip from './Tooltip';
import '../../sass/components/_chart-types.scss';
import List from './List';

type TTypeIcon = {
    Icon: (props: any) => JSX.Element;
    className: string;
};

const TypeIcon: React.FC<TTypeIcon> = ({ Icon, ...props }) => <Icon {...props} />;

type TChartTypesProps = {
    enabled?: boolean;
    newDesign?: any;
    onChange?: any;
};

const ChartTypes: React.FC<TChartTypesProps> = ({ enabled, newDesign, onChange: onChangeFn }) => {
    const { chartType, chart } = useStores();

    const { ChartTypeMenu, listStore, setTypeFromUI, showAggregateDialog, updateProps, types, type } = chartType;
    const { menuOpen, setOpen } = chartType.menu;
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
        <ChartTypeMenu className='ciq-display ciq-chart-types' enabled={enabled} title={t.translate('Chart types')}>
            <ChartTypeMenu.Title>
                <TypeIcon
                    Icon={type.icon}
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate(type.text)}
                />
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className='body'>
                    <List height={260} store={listStore}>
                        {(T: any) => (
                            <>
                                <span className='left'>
                                    <TypeIcon Icon={type.icon} className={`margin ${T.active ? 'active' : ''}`} />
                                    <span className='ciq-icon-text'>{T.text}</span>
                                </span>
                                {T.settingsOnClick && (
                                    <span className='ciq-aggregate-setting' onClick={() => showAggregateDialog(T.id)}>
                                        <SettingIcon />
                                    </span>
                                )}
                            </>
                        )}
                    </List>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default observer(ChartTypes);
