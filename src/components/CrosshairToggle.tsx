import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Form' was resolved to '/Users/balakr... Remove this comment to see the full error message
import { Toggle } from './Form';

const CrosshairToggle = ({ state, setCrosshairState, onChange, updateProps, isVisible = true }: any) => {
    const CrosshairIcon = [CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon][state];

    const onCrosshairToggle = () => {
        setCrosshairState((state + 1) % 3);
    };

    updateProps(onChange);

    if (!isVisible) return null;

    return (
        <Toggle active={state !== 0} onChange={onCrosshairToggle}>
            <CrosshairIcon />
        </Toggle>
    );
};

export default connect(({ crosshair }: any) => ({
    state: typeof crosshair.state !== 'number' ? 0 : crosshair.state,
    setCrosshairState: crosshair.setCrosshairState,
    updateProps: crosshair.updateProps,
}))(CrosshairToggle);
