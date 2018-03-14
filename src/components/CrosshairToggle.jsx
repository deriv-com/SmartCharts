import React, { Component } from 'react';
import {connect} from '../store/Connect';
import {CrosshairIcon} from './Icons.jsx';

const CrosshairToggle = ({
    toggleCrosshair,
    crosshair,
}) => (
    <div
        className="icon-toggles ciq-toggles cq-menu-btn"
    >
        <CrosshairIcon
            onClick={toggleCrosshair}
            className={crosshair ? 'active' : ''}
            tooltip-title='Crosshair' />
    </div>
);

export default connect(
    ({crosshair}) => ({
        toggleCrosshair: () => crosshair.setCrosshair(!crosshair.crosshair),
        crosshair: crosshair.crosshair,
    })
)(CrosshairToggle);
