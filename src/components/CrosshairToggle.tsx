import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import { CrosshairOffIcon, CrosshairOnIcon, CrosshairTooltipIcon } from './Icons';
import { Toggle } from './Form';
import Tooltip from './Tooltip';

type TCrosshairToggleProps = {
    onChange?: () => void;
    isVisible?: boolean;
};

const CrosshairToggle = ({ onChange, isVisible = true }: TCrosshairToggleProps) => {
    const { crosshair, chart } = useStores();
    const { setCrosshairState, updateProps } = crosshair;
    const { isMobile } = chart;

    const state = typeof crosshair.state !== 'number' ? 0 : crosshair.state;

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

export default observer(CrosshairToggle);
