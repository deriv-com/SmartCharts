import PropTypes            from 'prop-types';
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
            foregroundColor,
        } = this.props;

        return (
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
                <div className="drag-price" style={{ backgroundColor: color }}>
                    <div className="price">{priceDisplay}</div>
                </div>
            </div>
        );
    }
}

PriceLine.propTypes = {
    top             : PropTypes.number,
    className       : PropTypes.string,
    draggable       : PropTypes.bool,
    isDragging      : PropTypes.bool,
    priceDisplay    : PropTypes.number,
    setDragLine     : PropTypes.any,
    visible         : PropTypes.bool,
    zIndex          : PropTypes.number,
    uncentered      : PropTypes.bool,
    offScreen       : PropTypes.bool,
    lineStyle       : PropTypes.string,
    color           : PropTypes.string,
    foregroundColor : PropTypes.string,
};

PriceLine.defaultProps = {
    top             : 0,
    className       : '',
    draggable       : false,
    isDragging      : false,
    priceDisplay    : 0,
    setDragLine     : null,
    visible         : false,
    zIndex          : 0,
    uncentered      : false,
    offScreen       : false,
    lineStyle       : '',
    color           : '',
    foregroundColor : '',
};

export default PriceLine;
