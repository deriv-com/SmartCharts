import React from 'react';
import { connect } from '../store/Connect';
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons.jsx';
import { Toggle } from './Form.jsx';

const CrosshairToggle = ({
    state,
    setCrosshairState,
    onChange,
    updateProps,
    isVisible = true,
}) => {
    const CrosshairIcon = [CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon][state];

    const onCrosshairToggle = () => {
        setCrosshairState((state + 1) % 3);
    };

    updateProps(onChange);

    if (!isVisible) return null;

    return (
        <div className="ciq-menu cq-crosshair-toggle">
            <div className="cq-menu-btn">
                <Toggle
                    active={state !== 0}
                    onChange={onCrosshairToggle}
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
    state: (typeof crosshair.state !== 'number') ? 0 : crosshair.state,
    setCrosshairState: crosshair.setCrosshairState,
    updateProps: crosshair.updateProps,
}))(CrosshairToggle);
