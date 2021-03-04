import React from 'react';
import classNames from 'classnames';

const AnimatedPrice = ({ isIncrease, price, className }) => (
    <>
        {!price && <span className='cq-comparison-loader stx-show' />}
        <div
            className={classNames('cq-animated-price', className, {
                'cq-up': isIncrease,
                'cq-down': !isIncrease,
            })}
        >
            {price}
        </div>
    </>
);

export default AnimatedPrice;
