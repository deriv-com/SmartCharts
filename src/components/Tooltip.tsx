import React from 'react';
import classNames from 'classnames';

type TTooltipProps = {
    className?: string;
    enabled?: boolean;
    content: React.ReactNode;
    position?: string;
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    children?: React.ReactNode;
};

const Tooltip = ({
    children,
    className = '',
    enabled = false,
    content,

    // top, right
    position = 'top',

    ...props
}: TTooltipProps) => (
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
