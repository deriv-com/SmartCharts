import React from 'react';
import { observer } from 'mobx-react-lite';
import classNames from 'classnames';
import PriceLineStore from 'src/store/PriceLineStore';
import PriceLineArrow from './PriceLineArrow';
import PriceLineTitle from './PriceLineTitle';
import HamburgerDragIcon from './HamburgerDragIcon';

type TPriceLineProps = {
    store: PriceLineStore;
    lineStyle?: React.CSSProperties['borderStyle'];
    hideOffscreenBarrier?: boolean;
    hideOffscreenLine?: boolean;
    hideBarrierLine?: boolean;
    foregroundColor: string;
    color?: string;
    opacityOnOverlap: number;
};

const PriceLine = ({
    lineStyle,
    color,
    foregroundColor,
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
        priceLineWidth,
        overlappedBarrierWidth,
        setDragLine,
        title,
        visible,
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

    const width = priceLineWidth + 16;

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
                            borderTopColor: color,
                            borderTopStyle: lineStyle as React.CSSProperties['borderTopStyle'],
                            width: `calc(100% - ${width}px + ${overlappedBarrierWidth}px)`,
                        }}
                    />
                )}
                <div className='draggable-area' />
                <div className='draggable-area-wrapper'>
                    <div
                        className={'drag-price'}
                        style={{
                            backgroundColor: color,
                            width: isOverlappingWithPriceLine ? overlappedBarrierWidth : width,
                            opacity,
                            right: isOverlappingWithPriceLine ? width - overlappedBarrierWidth : 0,
                        }}
                    >
                        <HamburgerDragIcon />
                        <div
                            className={classNames('price', { 'price--zero': isOverlappingWithPriceLine })}
                            style={{
                                color: isOverlappingWithPriceLine ? color : '',
                                right: isOverlappingWithPriceLine
                                    ? overlappedBarrierWidth + priceDisplay.length * 8 - (!draggable ? 16 : 0)
                                    : 0,
                            }}
                        >
                            {priceDisplay}
                        </div>
                        <div />
                        {offScreen && offScreenDirection && (
                            <PriceLineArrow offScreenDirection={offScreenDirection} color={color} />
                        )}
                    </div>
                    {isOverlappingWithPriceLine && (
                        <div>
                            <div
                                className='price-overlay'
                                style={{ backgroundColor: color, width: width - overlappedBarrierWidth }}
                            />
                        </div>
                    )}
                </div>
                {title && <PriceLineTitle color={color} title={title} yAxiswidth={overlappedBarrierWidth} opacity={opacity} />}
            </div>
        </div>
    );
};

export default observer(PriceLine);
