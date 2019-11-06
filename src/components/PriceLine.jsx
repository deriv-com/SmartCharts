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
            currency,
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
                { showDragLine && <div className="drag-line" style={{ borderTopStyle: lineStyle, transform: titleTag && `translateX(-${yAxiswidth}px)` }} /> }
                <div className="draggable-area" />
                { !titleTag && (
                    <div className="drag-price" style={{ backgroundColor: color, width }}>
                        <div className="price">{priceDisplay}</div>
                    </div>
                )}
                { titleTag && (
                    <div className="label-wrapper" style={{ borderColor: color, right: yAxiswidth }}>
                        <span className="label">{titleTag.label}</span>
                        <span>{titleTag.amount < 0 ? '-' : '+'}</span>
                        <span className={`symbols symbols--${currency.toLowerCase()}`}>{titleTag.amount.replace(/^-/, '')}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default PriceLine;
