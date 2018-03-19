import React from 'react';
import RenderInsideChart from './RenderInsideChart.jsx';

const Barrier = ({
    barrierColor,
    isVisible,
    HighPriceLine,
    LowPriceLine,
    TopShade,
    BetweenShade,
    BottomShade,
}) => {
    return (
        <div
            className={`barrier ${barrierColor}`}
            style={{display: isVisible ? undefined : 'none'}}
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
