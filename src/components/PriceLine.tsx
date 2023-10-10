import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import PriceLineStore from 'src/store/PriceLineStore';
import PriceLineArrow from './PriceLineArrow';
import PriceLineTitle from './PriceLineTitle';

type TPriceLineProps = {
    store: PriceLineStore;
    lineStyle?: string;
    hideOffscreenBarrier?: boolean;
    hideOffscreenLine?: boolean;
    hideBarrierLine?: boolean;
    foregroundColor: string;
    color?: string;
    opacityOnOverlap: number;
    width: number;
};

const PriceLine = ({
    lineStyle,
    color,
    foregroundColor,
    width,
    hideOffscreenBarrier,
    opacityOnOverlap,
    hideOffscreenLine,
    hideBarrierLine,
    store,
}: TPriceLineProps) => {
    const {
        className,
        draggable,
        init,
        isDragging,
        isOverlapping,
        isOverlappingWithPriceLine,
        offScreen,
        offScreenDirection,
        priceDisplay,
        setDragLine,
        title,
        visible,
        yAxiswidth,
    } = store;

    const showBarrier = React.useMemo(() => !(hideOffscreenBarrier && offScreen), [hideOffscreenBarrier, offScreen]);
    const showBarrierDragLine = React.useMemo(
        () => !hideBarrierLine && (!hideOffscreenLine || !offScreen) && !isOverlapping,
        [hideBarrierLine, hideOffscreenLine, offScreen, isOverlapping]
    );
    const opacity = React.useMemo(() => (isOverlapping ? opacityOnOverlap : ''), [isOverlapping, opacityOnOverlap]);

    const isBarrierZero = isOverlappingWithPriceLine;

    React.useEffect(() => {
        init();
    }, [init]);

    if (!showBarrier) return null;

    return (
        <div
            className={classNames('barrier-area', { 'barrier-area--zero': isBarrierZero })}
            style={{ top: 0 }}
            ref={setDragLine}
            hidden={!visible}
        >
            <div
                className={classNames('chart-line', 'horizontal', className || '', {
                    draggable,
                    dragging: isDragging,
                })}
                style={{
                    color: foregroundColor,
                }}
            >
                {showBarrierDragLine && (
                    <div className={classNames('drag-line', { 'drag-line--zero': isBarrierZero })} style={{ borderTop: `${lineStyle} ${color} 1px` }} />
                )}
                <div className='draggable-area' />
                <div>
                    <div className={classNames('drag-price', { 'drag-price--zero': isBarrierZero })} style={{ backgroundColor: color, width, opacity }}>
                        <div className='price'>{priceDisplay}</div>
                        {offScreen && offScreenDirection && (
                            <PriceLineArrow offScreenDirection={offScreenDirection} color={color} />
                        )}
                    </div>
                    <div className='drag-price-frame' style={{ width: width - 1 }}></div>
                </div>
                {title && <PriceLineTitle color={color} title={title} yAxiswidth={yAxiswidth} opacity={opacity} />}
            </div>
        </div>
    );
};

export default observer(PriceLine);
