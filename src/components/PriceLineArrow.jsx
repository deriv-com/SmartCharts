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
    const top = arrowDirection === ARROW_DIRECTIONS.UP && `${-ARROW_HEIGHT}px`;
    const transform = arrowDirection === ARROW_DIRECTIONS.DOWN && 'rotate(180deg)';

    return (color === ARROW_COLORS.GREEN
        ? <ArrowGreenIcon className="arrow-icon" style={{ top, transform }} />
        : <ArrowOrangeIcon className="arrow-icon" style={{ top, transform }} />
    );
};

export default PriceLineArrow;
