import React from 'react';

const Barrier = ({
    barrierColor,
    visible,
    HighPriceLine,
    LowPriceLine,
    TopShade,
    BetweenShade,
    BottomShade,
}) => {
    return (
        <div
            className={`barrier ${barrierColor}`}
            style={{display: visible ? undefined : 'none'}}
        >
            <HighPriceLine />
            <LowPriceLine />
            <TopShade />
            <BetweenShade />
            <BottomShade />
        </div>
    );
};

export default Barrier;
