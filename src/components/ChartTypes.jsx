import React, { Component } from 'react';
import {connect} from '../store/Connect';
import Menu_ from './Menu.jsx';

const Menu = Menu_.connectBy(stroes => stroes.chartType.menu);

const ChartTypes = ({
    type,
    setType,
    types,
}) => (
    <Menu
        className="ciq-menu ciq-display collapse ciq-chart-types"
    >
        <Menu.Title>
            <div className="ciq-title">
                <span className={type.icon} />
                <span className="ciq-description">{type.name}</span>
            </div>
        </Menu.Title>
        <Menu.Body>
            {types.map((type, idx) => (
                <div
                    onClick={() => setType(type)}
                    className={`ciq-row ${type.disable ? 'disabled' : ''}`}
                    key={idx}
                >
                    <span className={type.icon} />
                    <span>{type.name}</span>
                </div>
            ))}
        </Menu.Body>
    </Menu>
);

const addIcon = t => Object.assign({}, t, { icon: `ciq-icon ciq-${t.id.replace('_', '-')}`});

export default connect(
    ({chartType}) => ({
        type: addIcon(chartType.type),
        setType: chartType.setType,
        types: chartType.types.map(addIcon),
        isOpened: chartType.open,
        setOpen: chartType.setOpen,
    })
)(ChartTypes);

