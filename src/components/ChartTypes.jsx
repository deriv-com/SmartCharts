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
            <TypeList height={257}>
                {(type) => (
                    <React.Fragment>
                        <span className={type.icon} />
                        <span className='ciq-icon-text'>{type.text}</span>
                    </React.Fragment>
                )}
            </TypeList>
        </Menu.Body>
    </Menu>
);

export default connect(
    ({chartType}) => ({
        type: chartType.type,
        setType: chartType.setType,
        types: chartType.types,
        isOpened: chartType.open,
        setOpen: chartType.setOpen,
        assetInformation: chartType.assetInformation,
        setAssetInformation: chartType.setAssetInformation,
        Menu: chartType.menu.connect(Menu),
        TypeList: chartType.list.connect(List),
    })
)(ChartTypes);

