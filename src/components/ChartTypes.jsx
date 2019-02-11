/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import { SettingIcon } from './Icons.jsx';
import '../../sass/components/_chart-types.scss';

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
}) => {
    if (Type === undefined) return (null);

    const onItemClick = (idx, chartType) => {
        if (Type.id !== chartType.id) {
            onChange(chartType.id, chartType.candleOnly, chartId);
        }
        setOpen(false);
    };

    return (
        <ChartTypeMenu
            className="ciq-display ciq-chart-types"
            enabled={enabled}
            title={t.translate('Chart types')}
        >
            <ChartTypeMenu.Title>
                <Type.icon
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translate(Type.text)}
                />
            </ChartTypeMenu.Title>
            <ChartTypeMenu.Body>
                <div className="body">
                    <ChartTypeList
                        height={260}
                        onItemClick={onItemClick}
                    >
                        {T => (
                            <>
                                <span className="left">
                                    <T.icon  className={`margin ${T.active ? 'active' : ''}`} />
                                    <span className="ciq-icon-text">{T.text}</span>
                                </span>
                                {T.settingsOnClick
                            && (
                                <span
                                    className="ciq-aggregate-setting"
                                    onClick={() => showAggregateDialog(T.id)}
                                >
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

export default connect(({ chartType, state }) => ({
    chartId            : state.chartId,
    ChartTypeMenu      : chartType.ChartTypeMenu,
    ChartTypeList      : chartType.ChartTypeList,
    menuOpen           : chartType.menu.open,
    onChange           : chartType.setTypeFromUI,
    setOpen            : chartType.menu.setOpen,
    showAggregateDialog: chartType.showAggregateDialog,
    Type               : chartType.type,
}))(ChartTypes);
