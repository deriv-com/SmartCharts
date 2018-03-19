import React from 'react';
import RenderInsideChart from './RenderInsideChart.jsx';

const Barrier = ({
    visible,
    HighPriceLine,
    LowPriceLine,
}) => {
    return (
        <RenderInsideChart>
            <div
                className="barrier"
                style={{display: visible ? undefined : 'none'}}
            >
                <HighPriceLine />
                <LowPriceLine />
            </div>
        </RenderInsideChart>
    );
};

export default Barrier;
