import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';

export const InlineLoader = ({ children, className, enabled = true, ...props }) => (
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

const Loader = ({ isActive, currentState }) => (
    <div className={classNames('sc-loader', { show: isActive })}>
        <div className='sc-loader-spin' />
        <div className='sc-loader-status'>{currentState}</div>
    </div>
);

export default connect(({ loader: l }) => ({
    isActive: l.isActive,
    currentState: l.currentState,
}))(Loader);
