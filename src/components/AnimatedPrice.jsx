import React from 'react';

const AnimatedPrice = ({
    isIncrease,
    price,
    className,
}) => {
    const classes = `cq-animated-price ${className || ''} ${isIncrease ? 'cq-up' : 'cq-down'}`;
    return (
        <>
            {!price && <span className="cq-comparison-loader stx-show" />}
            <div className={classes}>{price}</div>
        </>
    );
};

export default AnimatedPrice;
