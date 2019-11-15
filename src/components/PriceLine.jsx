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
            title,
            yAxiswidth,
            offScreen,
            hideOffscreenLines,
        } = this.props;

        const showDragLine = hideOffscreenLines !== true || offScreen !== true;

        return (
            <div
                className={`chart-line horizontal ${draggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${className || ''}`}
                style={{ top: 0, color: foregroundColor, borderColor: color }}
                ref={setDragLine}
                hidden={!visible}
            >
                { showDragLine && <div className="drag-line" style={{ borderTopStyle: lineStyle }} /> }
                <div className="draggable-area" />
                <div className="drag-price" style={{ backgroundColor: color, width }}>
                    <div className="price">{priceDisplay}</div>
                </div>
                { title && (
                    <div className="label-wrapper" style={{ color, right: yAxiswidth }}>
                        <span className="label">{title}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default PriceLine;
