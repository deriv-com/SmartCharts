import React, { Component } from 'react';
import {connect} from '../store/Connect';
import Menu from './Menu.jsx';

const ChartTypes = ({
    type,
    setType,
    types,
    isOpened,
    setOpen,
}) => (
    <Menu
        className="ciq-menu ciq-display collapse ciq-chart-types"
        isOpened={isOpened}
        setOpen={setOpen}
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
                    className="ciq-row"
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

