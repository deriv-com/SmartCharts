import React from 'react';
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './PriceLineArrow' was resolved to '/Us... Remove this comment to see the full error message
import PriceLineArrow from './PriceLineArrow';
// @ts-expect-error ts-migrate(6142) FIXME: Module './PriceLineTitle' was resolved to '/Us... Remove this comment to see the full error message
import PriceLineTitle from './PriceLineTitle';

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
}: any) => {
    const showBarrier = React.useMemo(() => !(hideOffscreenBarrier && offScreen), [hideOffscreenBarrier, offScreen]);
    const showBarrierDragLine = React.useMemo(
        () => !hideBarrierLine && (!hideOffscreenLine || !offScreen) && !isOverlapping,
        [hideBarrierLine, hideOffscreenLine, offScreen, isOverlapping]
    );
    const opacity = React.useMemo(() => isOverlapping && opacityOnOverlap, [isOverlapping, opacityOnOverlap]);

    React.useEffect(() => {
        init();
    }, [init]);

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
