/* eslint-disable jsx-a11y/no-static-element-interactions */
import React  from 'react';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
    isMobile,
    isFullscreen,
    chartContainerHeight,
    chartHeight,
}) => {
    const inner_style = (isMobile && open) ? {
        // reduce chart control panel height except in full screen mode
        height: `${isFullscreen ? chartHeight : chartContainerHeight}px`,
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
