import React from 'react';
import classNames from 'classnames';

type TAnimatedPriceProps = {
    isIncrease: boolean;
    price: string;
    className: string;
};

const AnimatedPrice: React.FC<TAnimatedPriceProps> = ({ isIncrease, price, className }) => (
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
