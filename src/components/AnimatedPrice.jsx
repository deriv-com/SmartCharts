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

AnimatedPrice.connectBy = selector => {
    const Connected = connect(
        (stores) => {
            const s = selector(stores);
            return {
                price: s.price,
                showStable: s.showStable,
                isIncrease: s.isIncrease,
                className: s.className
            };
        }
    )(AnimatedPrice);
    return Connected;
}

export default AnimatedPrice;
