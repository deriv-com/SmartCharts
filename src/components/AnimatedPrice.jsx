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
    className: PropTypes.string,
};

AnimatedPrice.defaultProps = {
    isIncrease: false,
    price: '0',
    className: '',
};

export default AnimatedPrice;
