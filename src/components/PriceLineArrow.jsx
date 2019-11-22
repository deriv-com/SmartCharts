import React                   from 'react';
import { ArrowGreenIcon,
    ArrowOrangeIcon }          from './Icons.jsx';
import { ARROW_HEIGHT,
    ARROW_COLORS,
    ARROW_DIRECTIONS }         from '../utils';

const PriceLineArrow = ({
    arrowDirection,
    color,
}) => {
    const OFFSET = 3;
    const top = arrowDirection === ARROW_DIRECTIONS.UP ? -ARROW_HEIGHT - OFFSET : +ARROW_HEIGHT - OFFSET;
    const transform = arrowDirection === ARROW_DIRECTIONS.DOWN && 'rotate(180deg)';

    return (color === ARROW_COLORS.GREEN
        ? <ArrowGreenIcon className="arrow-icon" style={{ top: `${top}px`, transform }} />
        : <ArrowOrangeIcon className="arrow-icon" style={{ top: `${top}px`, transform }} />
    );
};

export default PriceLineArrow;
