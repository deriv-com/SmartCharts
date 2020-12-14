import React, { useEffect, useMemo } from 'react';
import classNames from 'classnames';
import PriceLineArrow from './PriceLineArrow.jsx';
import PriceLineTitle from './PriceLineTitle.jsx';

const PriceLine = ({
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
    init,
}) => {
    const showBarrier = useMemo(() => !(hideOffscreenBarrier && offScreen), [hideOffscreenBarrier, offScreen]);
    const showBarrierDragLine = useMemo(
        () => !hideBarrierLine && (!hideOffscreenLine || !offScreen) && !isOverlapping,
        [hideBarrierLine, hideOffscreenLine, offScreen, isOverlapping]
    );
    const opacity = useMemo(() => isOverlapping && opacityOnOverlap, [isOverlapping, opacityOnOverlap]);

    useEffect(() => {
        init();
    }, []);

    return (
        showBarrier && (
            <div className='barrier-area' style={{ top: 0 }} ref={setDragLine} hidden={!visible}>
                <div
                    className={classNames('chart-line', 'horizontal', className || '', {
                        draggable,
                        dragging: isDragging,
                    })}
                    style={{
                        color: foregroundColor,
                        backgroundImage: `linear-gradient(to left, ${color} 90%, ${color}00`,
                    }}
                >
                    {showBarrierDragLine && <div className='drag-line' style={{ borderTopStyle: lineStyle }} />}
                    <div className='draggable-area' />
                    <div className='drag-price' style={{ backgroundColor: color, width, opacity }}>
                        <div className='price'>{priceDisplay}</div>
                        {offScreen && offScreenDirection && (
                            <PriceLineArrow offScreenDirection={offScreenDirection} color={color} />
                        )}
                    </div>
                    {title && <PriceLineTitle color={color} title={title} yAxiswidth={yAxiswidth} opacity={opacity} />}
                </div>
            </div>
        )
    );
};

export default PriceLine;
