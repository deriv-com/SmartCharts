import React, { Component } from 'react';
import {connect} from '../store/Connect';
import Menu from './Menu.jsx';
import List from './List.jsx';
import {Switch} from './Form.jsx';

const ChartTypes = ({
    Type,
    setType,
    types,
    Menu,
    menuOpen,
    TypeList,
    assetInformation,
    setAssetInformation,
}) => (
    <Menu
        className="ciq-menu ciq-display collapse ciq-chart-types"
    >
        <Menu.Title>
            <div className="ciq-title">
                <Type.icon
                    className={`tooltip ${menuOpen ? 'active' : ''}`}
                    tooltip-title="Chart types" />
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
            <TypeList height={257}>
                {T => (
                    <React.Fragment>
                        <T.icon  className={`margin ${T.active ? 'active' : ''}`} />
                        <span className='ciq-icon-text'>{T.text}</span>
                    </React.Fragment>
                )}
            </TypeList>
        </Menu.Body>
    </Menu>
);

export default connect(
    ({chartType, assetInformation: ai}) => ({
        Type: chartType.type,
        setType: chartType.setType,
        types: chartType.types,
        isOpened: chartType.open,
        setOpen: chartType.setOpen,
        assetInformation: ai.visible,
        setAssetInformation: ai.setVisible,
        menuOpen: chartType.menu.open,
        Menu: chartType.menu.connect(Menu),
        TypeList: chartType.list.connect(List),
    })
)(ChartTypes);
