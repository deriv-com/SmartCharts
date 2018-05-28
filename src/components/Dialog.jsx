import React, { Component } from 'react';
import {connect} from '../store/Connect';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    height,
    onContainerClick,
    className,
    isMobile,
    isFullscreen,
    chartContainerHeight,
    chartHeight,
}) => {
    const inner_style = ( isMobile && open ) ? {
        // reduce chart control panel height except in full screen mode
        height: `${isFullscreen ? chartHeight : chartContainerHeight}px`,
        width: window.innerWidth+'px'
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
