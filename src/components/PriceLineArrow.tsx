import React from 'react'; // @ts-expect-error ts-migrate(6142) FIXME: Module './Icons' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ArrowGreenIcon, ArrowOrangeIcon } from './Icons';
import { ARROW_HEIGHT, ARROW_COLORS, DIRECTIONS } from '../utils';

const PriceLineArrow = ({ offScreenDirection, color }: any) => {
    const top = offScreenDirection === DIRECTIONS.UP && `${-ARROW_HEIGHT}px`;
    const transform = offScreenDirection === DIRECTIONS.DOWN && 'rotate(180deg)';

    return color === ARROW_COLORS.GREEN ? (
        <ArrowGreenIcon className='arrow-icon' style={{ top, transform }} />
    ) : (
        <ArrowOrangeIcon className='arrow-icon' style={{ top, transform }} />
    );
};

export default PriceLineArrow;
