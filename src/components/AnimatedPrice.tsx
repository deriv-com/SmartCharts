import React from 'react';
import classNames from 'classnames';
import AnimatedPriceStore from 'src/store/AnimatedPriceStore';

type TAnimatedPriceProps = {
    isIncrease: AnimatedPriceStore['isIncrease'];
    price: AnimatedPriceStore['price'];
    className: AnimatedPriceStore['className'];
    status: AnimatedPriceStore['status'];
};

const AnimatedPrice = ({ isIncrease, price, className }: TAnimatedPriceProps) => (
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
