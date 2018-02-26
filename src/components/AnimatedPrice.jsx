import React from 'react';
import { connect } from '../store/Connect';

const AnimatedPrice = ({
    showStable,
    isIncrease,
    price,
    className
}) => {
    return (
        <div className={`cq-animated-price ${className || ''} ${showStable ? 'cq-stable ' : (isIncrease ? 'cq-up' : 'cq-down')}`}>{price}</div>
    );
};

export default AnimatedPrice;
