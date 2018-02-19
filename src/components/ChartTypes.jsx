import React, { Component } from 'react';
import {connect} from '../store/Connect';

const ChartTypes = ({
    type,
    setType,
    types
}) => (
    <cq-menu class="ciq-menu ciq-display collapse ciq-chart-types">
        <div className="ciq-title">
            <span className={type.icon} />
            <span className="ciq-description">{type.name}</span>
        </div>
        <cq-menu-dropdown>
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
        </cq-menu-dropdown>
    </cq-menu>
);

const addIcon = t => Object.assign({}, t, { icon: `ciq-icon ciq-${t.id.replace('_', '-')}`});
export default connect(
    ({chartType}) => ({
        type: addIcon(chartType.type),
        setType: chartType.setType,
        types: chartType.types.map(addIcon)
    })
)(ChartTypes);

