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
        } = this.props;

        return (
            <div
                className={`chart-line horizontal ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${className || ''}`}
                style={{ top, zIndex }}
                ref={setDragLine}
                hidden={visible ? undefined : 'true'}
                uncentered={uncentered ? 'true' : undefined}
                off-screen={offScreen ? 'true' : undefined}
            >
                <div
                    className="drag-line"
                />
                <div className="drag-price">
                    <div className="price">{priceDisplay}</div>
                </div>
            </div>
        );
    }
}

export default PriceLine;
