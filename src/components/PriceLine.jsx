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
            visible,
            zIndex,
            uncentered,
            offScreen,
            lineStyle,
            color,
        } = this.props;

        return (
            <div
                className={`chart-line horizontal ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${className || ''}`}
                style={{ top, zIndex, color: draggable ? color : '#FFF', borderColor: color }}
                ref={setDragLine}
                hidden={visible ? undefined : 'true'}
                uncentered={uncentered ? 'true' : undefined}
                off-screen={offScreen ? 'true' : undefined}
            >
                <div className="drag-line" style={{ borderTopStyle: lineStyle }} />
                <div className="draggable-area" />
                <div className="drag-price" style={{ backgroundColor: draggable ? '#FFF' : color }}>
                    <div className="price">{priceDisplay}</div>
                </div>
            </div>
        );
    }
}

export default PriceLine;
