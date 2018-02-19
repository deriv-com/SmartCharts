import React, { Component } from 'react';
import {connect} from '../store/Connect';
import '../../sass/components/_toggles.scss';

const ChartTypes = ({
    toggleCrosshair,
    toggleHeadsUp,
    toggleDraw,

    crosshairClass,
    headsUpClass,
    drawClass,
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

        <div
            onClick={toggleDraw}
            className={`ciq-draw toggle-icon ${drawClass}`}>
            <span className='tooltip' tooltip-title='Draw'></span>
        </div>
    </div>
);

export default connect(
    ({toggles}) => ({
        toggleCrosshair: () => toggles.setCrosshair(!toggles.crosshair),
        toggleHeadsUp: () => toggles.setHeadsUp(!toggles.headsUp),
        toggleDraw: () => toggles.setDraw(!toggles.draw),

        crosshairClass : toggles.crosshair ? 'active' : '',
        headsUpClass   : toggles.headsUp ? 'active' : '',
        drawClass   : toggles.draw ? 'active' : '',
    })
)(ChartTypes);

