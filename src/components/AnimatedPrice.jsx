import React from 'react';

const AnimatedPrice = ({
    showStable,
    isIncrease,
    price,
    className,
}) => {
    const classes = `cq-animated-price ${className || ''} ${
        showStable ? 'cq-stable ' : (isIncrease ? 'cq-up' : 'cq-down') // eslint-disable-line no-nested-ternary
    }`;
    return (
        <React.Fragment>
            {!price && <span className="cq-comparison-loader stx-show" />}
            <div className={classes}>{price}</div>
        </React.Fragment>
    );
};

export default AnimatedPrice;
