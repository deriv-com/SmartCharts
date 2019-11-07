import React, { Component } from 'react';

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
            titleTag,
            yAxiswidth,
            offScreen,
            hideOffscreenLines,
            barrierTitle,
            hidePriceLabel,
        } = this.props;

        const showDragLine = hideOffscreenLines !== true || offScreen !== true;

        return (
            <div
                className={`chart-line horizontal ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${className || ''}`}
                style={{ top: 0, color: foregroundColor, borderColor: color }}
                ref={setDragLine}
                hidden={!visible}
            >
                { showDragLine && <div className="drag-line" style={{ borderTopStyle: lineStyle, transform: hidePriceLabel && `translateX(-${yAxiswidth}px)` }} /> }
                <div className="draggable-area" />
                { !hidePriceLabel && (
                    <div className="drag-price" style={{ backgroundColor: color, width }}>
                        <div className="price">{priceDisplay}</div>
                    </div>
                )}
                { titleTag && barrierTitle && (
                    <div className="label-wrapper" style={{ borderColor: color, right: yAxiswidth }}>
                        {barrierTitle(titleTag)}
                    </div>
                ) }
            </div>
        );
    }
}

export default PriceLine;
