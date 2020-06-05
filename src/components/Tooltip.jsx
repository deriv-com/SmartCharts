import React from 'react';

const Tooltip = ({
    children,
    className = '',
    enabled = false,
    content,
    position = 'top', // top, right
    ...props
}) => (
    <div
        className={`sc-tooltip sc-tooltip--${position} ${enabled ? 'sc-tooltip--enable' : ''} ${className}`}
        {...props}
    >
        {children}
        <div className="sc-tooltip__inner">{content}</div>
    </div>
);

export default Tooltip;
