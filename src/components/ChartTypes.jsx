/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react';
import { connect } from '../store/Connect';
import { SettingIcon } from './Icons.jsx';
import TranslationText from './TranslationText.jsx';
import '../../sass/components/_chart-types.scss';

const ChartTypes = ({
    Type,
    ChartTypeMenu,
    menuOpen,
    setOpen,
    onChange,
    ChartTypeList,
    showAggregateDialog,
    enabled,
}) => {
    if (Type === undefined) return (null);

    const onItemClick = (idx, chartType) => {
        if (Type.id !== chartType.id) {
            onChange(chartType.id);
        }
        setOpen(false);
    };

    return (
        <ChartTypeMenu
            className="ciq-display ciq-chart-types"
            enabled={enabled}
            title={t.translatable('Chart types')}
        >
            <ChartTypeMenu.Title>
                <Type.icon
                    className={`ic-icon-with-sub ${menuOpen ? 'active' : ''}`}
                    tooltip-title={t.translatable(Type.text)}
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
                                    <TranslationText className="ciq-icon-text" value={T.text} />
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

export default connect(({ chartType }) => ({
    Type: chartType.type,
    setOpen: chartType.menu.setOpen,
    onChange: chartType.setTypeFromUI,
    showAggregateDialog: chartType.showAggregateDialog,
    menuOpen: chartType.menu.open,
    ChartTypeMenu: chartType.ChartTypeMenu,
    ChartTypeList: chartType.ChartTypeList,
}))(ChartTypes);
