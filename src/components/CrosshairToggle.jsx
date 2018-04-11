import React, { Component } from 'react';
import {connect} from '../store/Connect';
import {CrosshairIcon} from './Icons.jsx';
import {Toggle} from './Form.jsx';

const CrosshairToggle = ({
    toggleCrosshair,
    crosshair,
}) => (
    <Toggle
        active={crosshair}
        onChange={toggleCrosshair}
    >
        <CrosshairIcon
            tooltip-title={t.translate('Crosshair')} />
    </Toggle>
);

export default connect(
    ({crosshair}) => ({
        toggleCrosshair: (active) => crosshair.setCrosshair(active),
        crosshair: crosshair.crosshair,
    })
)(CrosshairToggle);
