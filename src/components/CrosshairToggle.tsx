// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
import { connect } from '../store/Connect';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Form.jsx' was resolved to '/Users/balakr... Remove this comment to see the full error message
import { Toggle } from './Form.jsx';

const CrosshairToggle = ({
    state,
    setCrosshairState,
    onChange,
    updateProps,
    isVisible = true,
}: any) => {
    const CrosshairIcon = [CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon][state];

    const onCrosshairToggle = () => {
        setCrosshairState((state + 1) % 3);
    };

    updateProps(onChange);

    if (!isVisible) return null;

    return (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <Toggle active={state !== 0} onChange={onCrosshairToggle}>
            {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
            <CrosshairIcon />
        </Toggle>
    );
};

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({
    crosshair,
}: any) => ({
    state: typeof crosshair.state !== 'number' ? 0 : crosshair.state,
    setCrosshairState: crosshair.setCrosshairState,
    updateProps: crosshair.updateProps,
}))(CrosshairToggle);
