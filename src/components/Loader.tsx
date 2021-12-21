import React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';

type TInlineLoaderProps = {
    className?: string;
    enabled?: boolean;
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler<HTMLDivElement>;
};

export const InlineLoader = ({ children, className, enabled = true, ...props }: TInlineLoaderProps) => (
    <div className={classNames('sc-inline-loader', className, { 'sc-inline-loader--enable': enabled })} {...props}>
        {children}
        {enabled && (
            <div className='sc-inline-loader__inner'>
                <span className='sc-inline-loader__inner__bullet' />
                <span className='sc-inline-loader__inner__bullet' />
                <span className='sc-inline-loader__inner__bullet' />
                <span className='sc-inline-loader__inner__bullet' />
            </div>
        )}
    </div>
);

const Loader = () => {
    const { loader } = useStores();
    const { isActive, currentState } = loader;
    return (
        <div className={classNames('sc-loader', { show: isActive })}>
            <div className='sc-loader-spin' />
            <div className='sc-loader-status'>{currentState}</div>
        </div>
    );
};

export default observer(Loader);
