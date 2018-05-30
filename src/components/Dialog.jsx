/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-dialog.scss';

const chartControlHeight = 47;
const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
    isMobile,
    isFullscreen,
}) => {
    const inner_style = (isMobile && open) ? {
        // reduce chart control panel height except in full screen mode
        height: `${window.innerHeight - (isFullscreen ? 0 : chartControlHeight)}px`,
        width: `${window.innerWidth}px`,
    } : {};

    return (
        <div
            className={`${className || 'cq-dialog'} ${open ? ' open' : ''}`}
            onClick={onContainerClick}
            style={inner_style}
        >
            {children}
        </div>
    );
};

export default Dialog;
