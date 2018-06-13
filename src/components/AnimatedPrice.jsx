import React from 'react';

const AnimatedPrice = ({
    isIncrease,
    price,
    className,
}) => {
    const classes = `cq-animated-price ${className || ''} ${isIncrease ? 'cq-up' : 'cq-down'}`;
    return (
        <React.Fragment>
            {!price && <span className="cq-comparison-loader stx-show" />}
            <div className={classes}>{price}</div>
        </React.Fragment>
    );
};

export default AnimatedPrice;
