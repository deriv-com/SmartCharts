import React, { Component } from 'react';
import {connect} from '../store/Connect';

const ChartTypes = ({
    toggleCrosshair,
    toggleHeadsUp,

    crosshairClass,
    headsUpClass,
}) => (
    <div className="icon-toggles ciq-toggles">
        <div onClick={toggleCrosshair}
            className={`ciq-CH toggle-icon ${crosshairClass}`}
        >
            <span className='tooltip' tooltip-title='Crosshair'></span>
        </div>

        <div onClick={toggleHeadsUp}
            className={`ciq-HU toggle-icon ${headsUpClass}`}
        >
            <span className='tooltip' tooltip-title='Info'></span>
        </div>
    </div>
);

export default connect(
    ({toggles}) => ({
        toggleCrosshair: () => toggles.setCrosshair(!toggles.crosshair),
        toggleHeadsUp: () => toggles.setHeadsUp(!toggles.headsUp),

        crosshairClass : toggles.crosshair ? 'active' : '',
        headsUpClass   : toggles.headsUp ? 'active' : '',
    })
)(ChartTypes);

