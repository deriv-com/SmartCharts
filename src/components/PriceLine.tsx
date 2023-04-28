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
        offScreen,
        offScreenDirection,
        price,
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

    const isBarrierZero = parseFloat(price) === 0.00;

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
                    backgroundImage:
                        lineStyle && lineStyle !== 'solid' ? '' : `linear-gradient(to left, ${color} 90%, ${color}00`,
                }}
            >
                {showBarrierDragLine && (
                    <div className='drag-line' style={{ borderTop: `${lineStyle} ${color} 1px` }} />
                )}
                <div className='draggable-area' />
                {!isBarrierZero && (
                    <div className='drag-price' style={{ backgroundColor: color, width, opacity }}>
                        <div className='price'>{priceDisplay}</div>
                        {offScreen && offScreenDirection && (
                            <PriceLineArrow offScreenDirection={offScreenDirection} color={color} />
                        )}
                    </div>
                )}
                {title && <PriceLineTitle color={color} title={title} yAxiswidth={yAxiswidth} opacity={opacity} />}
            </div>
        </div>
    );
};

export default observer(PriceLine);
