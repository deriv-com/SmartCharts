import React from 'react';
import { connect } from '../store/Connect';

const Loader = ({
    isActive,
}) => (
    <div className={`cq-loader ${isActive ? 'show' : ''}`} />
);

export default connect(({ loader: l }) => ({
    isActive: l.isActive,
}))(Loader);
