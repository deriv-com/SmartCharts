import React from 'react';

const Tooltip = React.memo(({
    children,
    className = '',
    enabled = true,
    content,
    position = 'top', // top, right
    ...props
}) => (
    <div
        className={`sc-tooltip sc-tooltip--${position} ${enabled ? 'sc-tooltip--enable' : ''} ${className}`}
        {...props}
    >
        {children}
        {enabled && (<div className="sc-tooltip__inner">{content}</div>)}
    </div>
));

export default Tooltip;
