import React from 'react';
import { action } from 'mobx';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';
import PriceLine from './PriceLine.jsx';
import Shade from './Shade.jsx';
import { isValidProp } from '../utils';

const Barrier = ({
    shadeColor,
    color = '#000',
    HighPriceLine,
    LowPriceLine,
    aboveShade,
    belowShade,
    betweenShade,
    hidePriceLines,
    lineStyle,
    isInitialized,
}) => (isInitialized
    && (
        <div
            className={`barrier ${shadeColor} ${hidePriceLines ? 'hide-pricelines' : ''}`}
        >
            <HighPriceLine lineStyle={lineStyle} color={color} />
            <LowPriceLine lineStyle={lineStyle} color={color} />
            <Shade
                className="top-shade"
                top={aboveShade.top}
                bottom={aboveShade.bottom}
                visible={aboveShade.visible}
            />
            <Shade
                className="between-shade"
                top={betweenShade.top}
                bottom={betweenShade.bottom}
                visible={betweenShade.visible}
            />
            <Shade
                className="bottom-shade"
                top={belowShade.top}
                bottom={belowShade.bottom}
                visible={belowShade.visible}
            />
        </div>
    )
);

export default connect(
    BarrierStore,
    store => ({
        HighPriceLine: store._high_barrier.connect(PriceLine),
        LowPriceLine: store._low_barrier.connect(PriceLine),
        aboveShade: store.aboveShade.clone(),
        belowShade: store.belowShade.clone(),
        betweenShade: store.betweenShade.clone(),
        shadeColor: store.shadeColor,
        color: store.color,
        hidePriceLines: store.hidePriceLines,
        lineStyle: store.lineStyle,
        isInitialized: store.isInitialized,
    }),
    (store, {
        color, shadeColor, shade, high, low, relative, draggable, onChange, hidePriceLines, lineStyle,
    }) => {
        store.initializePromise.then(action(() => {
            if (color) { store.color = color; }
            if (shadeColor) { store.shadeColor = shadeColor; }
            if (shade) { store.shadeState = `SHADE_${shade}`.toUpperCase(); }
            if (relative !== undefined) { store.relative = relative; }
            if (draggable !== undefined) { store.draggable = draggable; }
            if (isValidProp(high)) { store.high_barrier = high; }
            if (isValidProp(low)) { store.low_barrier = low; }
            if (onChange) { store.onBarrierChange = onChange; }
            store.lineStyle = lineStyle;
            store.hidePriceLines = !!hidePriceLines;
        }));
    },
)(Barrier);
