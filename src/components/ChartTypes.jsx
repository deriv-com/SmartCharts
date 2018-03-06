import React, { Component } from 'react';
import {connect} from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import {Switch} from './Form.jsx';

const ChartTypes = ({
    type,
    setType,
    types,
    Menu,
    TypeList,
    assetInformation,
    setAssetInformation,
}) => (
    <Menu
        className="ciq-menu ciq-display collapse ciq-chart-types"
    >
        <Menu.Title>
            <div className="ciq-title">
                <span className={type.icon} />
                <span className="ciq-description">{type.text}</span>
            </div>
        </Menu.Title>
        <Menu.Body>
            <div className='ciq-toggle-asset-information'>
                <div>Toggle Asset Information </div>
                <Switch
                    value={assetInformation}
                    onChange={setAssetInformation}
                />
            </div>
            <TypeList height={260}>
                {t => (
                    <React.Fragment>
                        <span className={t.icon} />
                        <span className='ciq-icon-text'>{t.text}</span>
                    </React.Fragment>
                )}
            </TypeList>
        </Menu.Body>
    </Menu>
);

export default connect(
    ({chartType, assetInformation: ai}) => ({
        type: chartType.type,
        setType: chartType.setType,
        types: chartType.types,
        isOpened: chartType.open,
        setOpen: chartType.setOpen,
        assetInformation: ai.visible,
        setAssetInformation: ai.setVisible,
        Menu: chartType.menu.connect(Menu),
        TypeList: chartType.list.connect(List),
    })
)(ChartTypes);

