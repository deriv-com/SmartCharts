import React from 'react';
import { connect } from '../store/Connect';
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons.jsx';
import { Toggle } from './Form.jsx';

const CrosshairToggle = ({
    toggleState,
    state,
}) => {
    const CrosshairIcon = [CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon][state];
    return (
        <div className={`ciq-menu ${(state !== 0) ? 'stxMenuActive' : ''}`}>
            <div className="cq-menu-btn">
                <Toggle
                    active={state !== 0}
                    onChange={toggleState}
                >
                    <CrosshairIcon
                        className="ic-icon-with-sub"
                        tooltip-title={t.translate('Crosshair')}
                    />
                </Toggle>
            </div>
        </div>
    );
};

export default connect(({ crosshair }) => ({
    toggleState: () => crosshair.toggleState(),
    state: (typeof crosshair.state !== 'number') ? 0 : crosshair.state,
}))(CrosshairToggle);
