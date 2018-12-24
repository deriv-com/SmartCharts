import React from 'react';
import { connect } from '../store/Connect';

const Loader = ({
    isActive,
    currentState,
}) => (
    <div className={`cq-loader ${isActive ? 'show' : ''}`}>
        <div className="cq-loader-spin" />
        <div className="cq-loader-status">
            {currentState}
        </div>
    </div>
);

export default connect(({ loader: l }) => ({
    isActive: l.isActive,
    currentState: l.currentState,
}))(Loader);
