import React, { Component } from 'react';
import {connect} from '../store/Connect';
import {CrosshairIcon} from './Icons.jsx';

const ChartTypes = ({
    toggleCrosshair,
    crosshairClass,
}) => (
    <div
        className="icon-toggles ciq-toggles cq-menu-btn"
    >
        <CrosshairIcon
            onClick={toggleCrosshair}
            className={`${crosshairClass}`}
            tooltip-title='Crosshair' />
    </div>
);

export default connect(
    ({toggles}) => ({
        toggleCrosshair: () => toggles.setCrosshair(!toggles.crosshair),
        crosshairClass : toggles.crosshair ? 'active' : '',
    })
)(ChartTypes);
