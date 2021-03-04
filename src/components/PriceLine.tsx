// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
// @ts-expect-error ts-migrate(6142) FIXME: Module './PriceLineArrow.jsx' was resolved to '/Us... Remove this comment to see the full error message
import PriceLineArrow from './PriceLineArrow.jsx';
// @ts-expect-error ts-migrate(6142) FIXME: Module './PriceLineTitle.jsx' was resolved to '/Us... Remove this comment to see the full error message
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
            // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
            <div className='barrier-area' style={{ top: 0 }} ref={setDragLine} hidden={!visible}>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
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
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    {showBarrierDragLine && <div className='drag-line' style={{ borderTopStyle: lineStyle }} />}
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='draggable-area' />
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    <div className='drag-price' style={{ backgroundColor: color, width, opacity }}>
                        {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                        <div className='price'>{priceDisplay}</div>
                        {offScreen && offScreenDirection && (
                            // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <PriceLineArrow offScreenDirection={offScreenDirection} color={color} />
                        )}
                    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                    </div>
                    {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
                    {title && <PriceLineTitle color={color} title={title} yAxiswidth={yAxiswidth} opacity={opacity} />}
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                </div>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        )
    );
};

export default PriceLine;
