import React from 'react';
import { connect } from '../store/Connect';

export const InlineLoader = ({
    children,
    className,
    enabled = true,
    ...props
}) => (
    <div
        className={`sc-inline-loader ${enabled ? 'sc-inline-loader--enable' : ''} ${className}`}
        {...props}
    >
        {children}
        {enabled && (
            <div className="sc-inline-loader__inner">
                <span className="sc-inline-loader__inner__bullet" />
                <span className="sc-inline-loader__inner__bullet" />
                <span className="sc-inline-loader__inner__bullet" />
                <span className="sc-inline-loader__inner__bullet" />
            </div>
        )}
    </div>
);

const Loader = ({
    isActive,
    currentState,
}) => (
    <div className={`sc-loader ${isActive ? 'show' : ''}`}>
        <div className="sc-loader-spin" />
        <div className="sc-loader-status">
            {currentState}
        </div>
    </div>
);

export default connect(({ loader: l }) => ({
    isActive: l.isActive,
    currentState: l.currentState,
}))(Loader);
