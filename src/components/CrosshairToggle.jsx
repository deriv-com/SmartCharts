import React, { Component } from 'react';
import {connect} from '../store/Connect';
import {CrosshairIcon, CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon} from './Icons.jsx';
import {Toggle} from './Form.jsx';

const CrosshairToggle = ({
    toggleState,
    crosshair,
    state
}) => (
    <div className="ciq-menu">
        <div className="cq-menu-btn">
            <Toggle
                active={state != 0}
                onChange={toggleState}
                >
                {state == 0 ? <CrosshairOffIcon className='ic-icon-with-sub'
                    tooltip-title={t.translate('Crosshair')} /> 
                    : ( state == 1 
                        ? <CrosshairOnIcon className='ic-icon-with-sub'
                            tooltip-title={t.translate('Crosshair')} /> 
                        : <CrosshairTooltipIcon className='ic-icon-with-sub'
                            tooltip-title={t.translate('Crosshair')} />
                      )
                }
            </Toggle>
        </div>
    </div>
);

export default connect(
    ({crosshair}) => ({
        toggleState: () => crosshair.toggleState(),
        state: crosshair.state
    })
)(CrosshairToggle);
