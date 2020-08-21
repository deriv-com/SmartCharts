import React, { Component } from 'react';
import classNames           from 'classnames';
import PriceLineArrow       from './PriceLineArrow.jsx';
import PriceLineTitle       from './PriceLineTitle.jsx';

class PriceLine extends Component {
    componentDidMount() {
        this.props.init();
    }

    render() {
        const {
            className,
            draggable,
            isDragging,
            priceDisplay,
            setDragLine,
            visible,
            lineStyle,
            color,
            foregroundColor,
            width,
            title,
            yAxiswidth,
            offScreen,
            hideBarrierLine,
            hideOffscreenBarrier,
            hideOffscreenLine,
            offScreenDirection,
            opacityOnOverlap,
            isOverlapping,
        } = this.props;

        const showBarrier = !(hideOffscreenBarrier && offScreen);
        const showBarrierDragLine = !hideBarrierLine && (!hideOffscreenLine || !offScreen) && !isOverlapping;
        const opacity = isOverlapping && opacityOnOverlap;

        return (
            showBarrier && (
                <div
                    className="barrier-area"
                    style={{ top: 0 }}
                    ref={setDragLine}
                    hidden={!visible}
                >
                    <div
                        className={classNames('chart-line', 'horizontal', className || '', {
                            draggable,
                            dragging: isDragging,
                        })}
                        style={{ color: foregroundColor, backgroundImage: `linear-gradient(to left, ${color} 90%, ${color}00` }}
                    >
                        { showBarrierDragLine && <div className="drag-line" style={{ borderTopStyle: lineStyle }} /> }
                        <div className="draggable-area" />
                        <div className="drag-price" style={{ backgroundColor: color, width, opacity }}>
                            <div className="price">{priceDisplay}</div>
                            { offScreen && offScreenDirection && <PriceLineArrow offScreenDirection={offScreenDirection} color={color} /> }
                        </div>
                        { title && <PriceLineTitle color={color} title={title} yAxiswidth={yAxiswidth} opacity={opacity} /> }
                    </div>
                </div>
            )
        );
    }
}

export default PriceLine;
