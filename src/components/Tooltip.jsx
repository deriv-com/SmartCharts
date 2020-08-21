import React from 'react';
import classNames from 'classnames';

const Tooltip = ({
    children,
    className = '',
    enabled = false,
    content,
    position = 'top', // top, right
    ...props
}) => (
    <div
        className={classNames(
            'sc-tooltip',
            `sc-tooltip--${position}`,
            className,
            {
                'sc-tooltip--enable': enabled,
            },
        )}
        {...props}
    >
        {children}
        <div className="sc-tooltip__inner">{content}</div>
    </div>
);

export default Tooltip;
