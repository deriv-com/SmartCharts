import React from 'react';
import {connect} from '../store/Connect';
import BarrierStore from '../store/BarrierStore';
import PriceLine from './PriceLine.jsx';
import Shade from './Shade.jsx';

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

export default connect(
    BarrierStore,
    (store) => ({
        HighPriceLine: store._high_barrier.connect(PriceLine),
        LowPriceLine: store._low_barrier.connect(PriceLine),
        TopShade: store._aboveShade.connect(Shade),
        BetweenShade: store._betweenShade.connect(Shade),
        BottomShade: store._belowShade.connect(Shade),
        visible: store._visible,
        barrierColor: store.barrierColor
    }), 
    (store, {color, shade}) => {
        if(color) store.barrierColor = color;
        if(shade) store.shadeState = `SHADE_${shade}`.toUpperCase();
        // TODO: do the rest
    }
)(Barrier);
