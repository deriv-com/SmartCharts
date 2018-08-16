import React, { Component } from 'react';
import { connect } from '../store/Connect';
import BarrierStore from '../store/BarrierStore';
import Shade from './Shade.jsx';

class Barrier extends Component {
    constructor(props) {
        super(props);
        this.updateProps = props.updateProps;
    }

    componentWillReceiveProps(nextProps) {
        this.updateProps(nextProps);
    }

    componentWillUnmount() {
        this.props.destructor();
    }

    render() {
        const {
            shadeColor = '#4caf50',
            color = '#000',
            HighPriceLine,
            LowPriceLine,
            aboveShade,
            belowShade,
            betweenShade,
            hidePriceLines,
            lineStyle,
            isInitialized,
        } = this.props;

        return (isInitialized && (
            <div
                className={`barrier ${hidePriceLines ? 'hide-pricelines' : ''}`}
                style={{ '--shade-color': shadeColor }}
            >
                <HighPriceLine lineStyle={lineStyle} color={color} />
                <LowPriceLine  lineStyle={lineStyle} color={color} />
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
        ));
    }
}

export default connect(
    store => ({
        HighPriceLine: store.HighPriceLine,
        LowPriceLine: store.LowPriceLine,
        aboveShade: store.aboveShade.clone(),
        belowShade: store.belowShade.clone(),
        betweenShade: store.betweenShade.clone(),
        shadeColor: store.shadeColor,
        color: store.color,
        hidePriceLines: store.hidePriceLines,
        lineStyle: store.lineStyle,
        isInitialized: store.isInitialized,
        updateProps: store.updateProps,
        destructor: store.destructor,
    }),
    BarrierStore,
)(Barrier);
