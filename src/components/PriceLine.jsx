import React, { Component } from 'react';

class PriceLine extends Component {
    componentDidMount() {
        this.props.init();
    }

    render() {
        const {
            top,
            className,
            draggable,
            isDragging,
            priceDisplay,
            setDragLine,
            setDragLabel,
            labelTop,
            visible,
            zIndex,
            uncentered,
            offScreen,
            lineStyle,
            color,
            foregroundColor,
        } = this.props;

        return (
            <>
                <div
                    className={`drag-price ${!visible ? 'hidden' : ''} ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''}`}
                    style={{ top: labelTop, backgroundColor: color, color: foregroundColor }}
                    ref={setDragLabel}
                >
                    <div className="price">{priceDisplay}</div>
                </div>
                <div
                    className={`chart-line horizontal ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${className || ''}`}
                    style={{ top, zIndex, color: foregroundColor, borderColor: color }}
                    ref={setDragLine}
                    hidden={!visible}
                    uncentered={uncentered ? 'true' : undefined}
                    off-screen={offScreen ? 'true' : undefined}
                >
                    <div className="drag-line" style={{ borderTopStyle: lineStyle }} />
                    <div className="draggable-area" />
                </div>
            </>
        );
    }
}

export default PriceLine;
