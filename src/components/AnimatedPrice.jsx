import PropTypes    from 'prop-types';
import React        from 'react';

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

AnimatedPrice.propTypes = {
    isIncrease: PropTypes.bool,
    price: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
};

AnimatedPrice.defaultProps = {
    price: '0',
};

export default AnimatedPrice;
