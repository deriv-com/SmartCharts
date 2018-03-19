import React from 'react';

const AnimatedPrice = ({
    showStable,
    isIncrease,
    price,
    className,
}) => {
    const classes = `cq-animated-price ${className || ''} ${
        showStable ? 'cq-stable ' : (isIncrease ? 'cq-up' : 'cq-down')
    }`;
    return (<div className={classes}>{price}</div>);
};

export default AnimatedPrice;
