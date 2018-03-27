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
    aboveShade,
    belowShade,
    betweenShade,
}) => {
    return (
        <div
            className={`barrier ${barrierColor}`}
        >
            <HighPriceLine />
            <LowPriceLine />
            <Shade
                className='top-shade'
                top={aboveShade.top}
                bottom={aboveShade.bottom}
                visible={aboveShade.visible}
            />
            <Shade
                className='between-shade'
                top={betweenShade.top}
                bottom={betweenShade.bottom}
                visible={betweenShade.visible}
            />
            <Shade
                className='bottom-shade'
                top={belowShade.top}
                bottom={belowShade.bottom}
                visible={belowShade.visible}
            />
        </div>
    );
};

export default connect(
    BarrierStore,
    (store) => ({
        HighPriceLine: store._high_barrier.connect(PriceLine),
        LowPriceLine: store._low_barrier.connect(PriceLine),
        aboveShade: store.aboveShade.clone(),
        belowShade: store.belowShade.clone(),
        betweenShade: store.betweenShade.clone(),
        barrierColor: store.barrierColor
    }), 
    (store, {color, shade, high, low, relative, draggable, onBarrierChange,}) => {
        if(color) store.barrierColor = color;
        if(shade) store.shadeState = `SHADE_${shade}`.toUpperCase();
        if(high) store.high_barrier = high;
        if(low) store.low_barrier = low;
        if(relative) store.relative = relative;
        if(draggable) store.draggable = draggable;
        if(onBarrierChange) store.onBarrierChange = onBarrierChange;
    }
)(Barrier);
