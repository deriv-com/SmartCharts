import React from 'react';
import { connect } from '../store/Connect';
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons.jsx';
import { Toggle } from './Form.jsx';
import Tooltip from './Tooltip.jsx';

const CrosshairToggle = ({ state, setCrosshairState, onChange, updateProps, isVisible = true, isMobile }) => {
    const CrosshairIcon = [CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon][state];
    const labels = [
        t.translate("Don't show price info on chart"),
        t.translate('Show price info on x & y axes'),
        t.translate('Show price info on chart'),
    ];

    const onCrosshairToggle = () => {
        setCrosshairState((state + 1) % 3);
    };

    updateProps(onChange);

    if (!isVisible) return null;

    return (
        <Tooltip content={labels[state]} enabled={!isMobile} position='right'>
            <Toggle active={state !== 0} onChange={onCrosshairToggle}>
                <CrosshairIcon />
            </Toggle>
        </Tooltip>
    );
};

export default connect(({ chart, crosshair }) => ({
    state: typeof crosshair.state !== 'number' ? 0 : crosshair.state,
    setCrosshairState: crosshair.setCrosshairState,
    updateProps: crosshair.updateProps,
    isMobile: chart.isMobile,
}))(CrosshairToggle);
