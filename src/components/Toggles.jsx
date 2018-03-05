import React, { Component } from 'react';
import {connect} from '../store/Connect';

const ChartTypes = ({
    toggleCrosshair,
    crosshairClass,
}) => (
    <div className="icon-toggles ciq-toggles">
        <div onClick={toggleCrosshair}
            className={`ciq-CH toggle-icon ${crosshairClass}`}
        >
            <span className='tooltip' tooltip-title='Crosshair'></span>
        </div>
    </div>
);

export default connect(
    ({toggles}) => ({
        toggleCrosshair: () => toggles.setCrosshair(!toggles.crosshair),
        crosshairClass : toggles.crosshair ? 'active' : '',
    })
)(ChartTypes);

