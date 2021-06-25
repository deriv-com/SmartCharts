import React from 'react';
import classNames from 'classnames';

type TTooltipProps = {
    className?: string;
    enabled?: boolean;
    content: React.ReactNode;
    position?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
};

const Tooltip: React.FC<TTooltipProps> = ({
    children,
    className = '',
    enabled = false,
    content,

    // top, right
    position = 'top',

    ...props
}) => (
    <div
        className={classNames('sc-tooltip', className, {
            [`sc-tooltip--${position}`]: !!position,
            'sc-tooltip--enable': enabled,
        })}
        {...props}
    >
        {children}
        <div className='sc-tooltip__inner'>{content}</div>
    </div>
);

export default Tooltip;
