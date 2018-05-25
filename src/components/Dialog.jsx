import React, { Component } from 'react';
import {connect} from '../store/Connect';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
    isMobile,
    isFullscreen
}) => {
    const inner_style = ( isMobile && open ) ? {
        height: (window.innerHeight - (isFullscreen ? 0 : 47) )+'px',
        width: window.innerWidth+'px'
    } : {};

    return (
        <div
            className={(className || 'cq-dialog') + (open ? ' open' : '')}
            onClick={onContainerClick}
            style={inner_style}
            >
            {children}
        </div>
    );
};

export default Dialog;
