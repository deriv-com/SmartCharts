import React, {Component} from 'react';

class PriceLine extends Component {
    componentDidMount() {
        this.props.init();
    }

    render() {
        const {
            top,
            className,
            isDraggable,
            isDragging,
            priceDisplay,
            setDragLine,
            visible,
        } = this.props;

        return (
            <div
                className={`chart-line horizontal ${isDraggable ? 'draggable' : ''} ${isDragging ? 'dragging' : ''} ${className || ''}`}
                style={{top}}
                ref={setDragLine}
                hidden={visible ? undefined : 'true'}
            >
                <div
                    className="drag-line"
                />
                <div className="drag-price">
                    <div className="price">{priceDisplay}</div>
                </div>
            </div>
        )
    }
}

export default PriceLine;
