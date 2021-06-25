/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { ChartType } from 'src/types';
import { SettingIcon } from './Icons';
import Tooltip from './Tooltip';
import '../../sass/components/_chart-types.scss';

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

    const { ChartTypeMenu, ChartTypeList, setTypeFromUI, showAggregateDialog, updateProps, types, type } = chartType;
    const { menuOpen, setOpen } = chartType.menu;
    const { isMobile } = chart;

    const onChange = onChangeFn || setTypeFromUI;

    if (type === undefined) return null;

    const onItemClick = (chartType: ChartType) => {
        if (type.id !== chartType.id) {
            onChange(chartType.id);
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

                    const onClick = () => (chartType.disabled ? null : onItemClick(chartType));
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
                    Icon={type.icon}
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate(type.text)}
                />
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className='body'>
                    <ChartTypeList height={260} onItemClick={onItemClick}>
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
                    </ChartTypeList>
                </div>
            </ChartTypeMenu.Body>
        </ChartTypeMenu>
    );
};

export default observer(ChartTypes);
