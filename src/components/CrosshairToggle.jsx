import React, { Component } from 'react';
import {connect} from '../store/Connect';
import {CrosshairIcon} from './Icons.jsx';
import {Toggle} from './Form.jsx';

const CrosshairToggle = ({
    toggleCrosshair,
    crosshair,
}) => (
    <div className="ciq-menu">
        <div className="cq-menu-btn">
            <Toggle
                active={crosshair}
                onChange={toggleCrosshair}
            >
                <CrosshairIcon
                    className='ic-icon-with-sub'
                    tooltip-title={t.translate('Crosshair')} />
            </Toggle>
        </div>
    </div>
);

export default connect(
    ({crosshair}) => ({
        toggleCrosshair: (active) => crosshair.setCrosshair(active),
        crosshair: crosshair.crosshair,
    })
)(CrosshairToggle);
