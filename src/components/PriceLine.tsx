import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import PriceLineStore from 'src/store/PriceLineStore';
import PriceLineArrow from './PriceLineArrow';
import PriceLineTitle from './PriceLineTitle';

type TPriceLineProps = {
    store: PriceLineStore;
    lineStyle?: React.CSSProperties['borderStyle'];
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

    React.useEffect(() => {
        init();
    }, [init]);

    if (!showBarrier) return null;

    return (
        <div
            className={classNames('barrier-area', { 'barrier-area--zero': isOverlappingWithPriceLine })}
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
                    <div
                        className={classNames('drag-line', { 'drag-line--zero': isOverlappingWithPriceLine })}
                        style={{
                            borderTopStyle: lineStyle as React.CSSProperties['borderTopStyle'],
                            width: `calc(100% - ${yAxiswidth}px + ${width}px)`,
                        }}
                    />
                )}
                <div className='draggable-area' />
                <div className='draggable-area-wrapper'>
                    <div
                        className={classNames('drag-price')}
                        style={{ width: isOverlappingWithPriceLine ? width : yAxiswidth, opacity, right: isOverlappingWithPriceLine ? yAxiswidth - width : 0 }}
                    >
                        <div className='drag-icon'>
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div className={classNames('price', { 'price--zero': isOverlappingWithPriceLine })} style={{ right: isOverlappingWithPriceLine ? width + (priceDisplay.length * 8) - (!draggable ? 16 : 0) : 0}}>{priceDisplay}</div>
                        <div />
                        {offScreen && offScreenDirection && (
                            <PriceLineArrow offScreenDirection={offScreenDirection} color={color} />
                        )}
                    </div>
                    {isOverlappingWithPriceLine && (
                        <div>
                            <div className='price-overlay' style={{ width: yAxiswidth - width }} />
                        </div>
                    )}
                </div>
                {title && <PriceLineTitle color={color} title={title} yAxiswidth={yAxiswidth} opacity={opacity} />}
            </div>
        </div>
    );
};

export default observer(PriceLine);
