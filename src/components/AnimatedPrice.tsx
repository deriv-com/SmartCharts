import React from 'react';
import classNames from 'classnames';
import AnimatedPriceStore from 'src/store/AnimatedPriceStore';
import ChartTitleStore from 'src/store/ChartTitleStore';

type TAnimatedPriceProps = {
    isIncrease: AnimatedPriceStore['isIncrease'];
    price: AnimatedPriceStore['price'];
    className: AnimatedPriceStore['className'];
    status: AnimatedPriceStore['status'];
    decimalPlaces: ChartTitleStore['decimalPlaces'];
};

const AnimatedPrice = ({ isIncrease, price, className, decimalPlaces }: TAnimatedPriceProps) => (
    <>
        {!price && <span className='cq-comparison-loader stx-show' />}
        <div
            className={classNames('cq-animated-price', className, {
                'cq-up': isIncrease,
                'cq-down': !isIncrease,
            })}
        >
            {price.toFixed(decimalPlaces)}
        </div>
    </>
);

export default AnimatedPrice;
