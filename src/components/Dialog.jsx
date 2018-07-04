/* eslint-disable jsx-a11y/no-static-element-interactions */
import React  from 'react';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
}) => (
    <div
        className={`${className || 'cq-dialog'} ${open ? ' open' : ''}`}
        onClick={onContainerClick}
    >
        {children}
    </div>
);

export default Dialog;
