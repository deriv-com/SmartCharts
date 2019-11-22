import React                   from 'react';
import { ArrowGreenIcon,
    ArrowOrangeIcon }          from './Icons.jsx';
import { ARROW_OFFSET_HEIGHT,
    ARROW_COLORS,
    ARROW_DIRECTIONS }         from '../utils';

const PriceLineTitle = ({
    arrowDirection,
    offScreen,
    color,
    yAxiswidth,
    title,
}) => {
    const arrowOffsetHeight = arrowDirection === ARROW_DIRECTIONS.UP ? -ARROW_OFFSET_HEIGHT : +ARROW_OFFSET_HEIGHT;
    const transform = arrowDirection === ARROW_DIRECTIONS.DOWN && 'rotate(180deg)';

    return (
        <div className="title-wrapper" style={{ color, right: yAxiswidth }}>
            { offScreen && arrowDirection && (color === ARROW_COLORS.GREEN
                ? <ArrowGreenIcon className="arrow-icon" style={{ top: `${arrowOffsetHeight}px`, transform }} />
                : <ArrowOrangeIcon className="arrow-icon" style={{ top: `${arrowOffsetHeight}px`, transform }} />)
            }
            <span className="title">{title}</span>
        </div>
    );
};

export default PriceLineTitle;
