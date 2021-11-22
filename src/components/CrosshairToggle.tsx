import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons';
import { Toggle } from './Form';

type TCrosshairToggleProps = {
    onChange?: () => void;
    isVisible?: boolean;
};

const CrosshairToggle: React.FC<TCrosshairToggleProps> = ({ onChange, isVisible = true }) => {
    const { crosshair } = useStores();
    const { setCrosshairState, updateProps } = crosshair;

    const state = typeof crosshair.state !== 'number' ? 0 : crosshair.state;

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

export default observer(CrosshairToggle);
