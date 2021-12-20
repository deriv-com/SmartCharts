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
        priceDisplay,
        visible,
        setDragLine,
        className,
        draggable,
        isDragging,
        init,
        title,
        yAxiswidth,
        offScreen,
        offScreenDirection,
        isOverlapping,
    } = store;

    const showBarrier = React.useMemo(() => !(hideOffscreenBarrier && offScreen), [hideOffscreenBarrier, offScreen]);
    const showBarrierDragLine = React.useMemo(
        () => !hideBarrierLine && (!hideOffscreenLine || !offScreen) && !isOverlapping,
        [hideBarrierLine, hideOffscreenLine, offScreen, isOverlapping]
    );
    const opacity = React.useMemo(() => (isOverlapping ? opacityOnOverlap : ''), [isOverlapping, opacityOnOverlap]);

    React.useEffect(() => {
        init();
    }, [init]);

    if (!showBarrier) return null;

    return (
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
                {showBarrierDragLine && (
                    <div className='drag-line' style={{ borderTopStyle: lineStyle as 'solid' | 'dotted' }} />
                )}
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
    );
};

export default observer(PriceLine);
