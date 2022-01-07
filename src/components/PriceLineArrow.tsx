import React from 'react';
import { ArrowGreenIcon, ArrowOrangeIcon } from './Icons';
import { ARROW_HEIGHT, ARROW_COLORS, DIRECTIONS } from '../utils';

type TPriceLineArrowProps = {
    offScreenDirection: keyof typeof DIRECTIONS;
    color?: string;
};

const PriceLineArrow = ({ offScreenDirection, color }: TPriceLineArrowProps) => {
    const top = offScreenDirection === DIRECTIONS.UP ? `${-ARROW_HEIGHT}px` : '';
    const transform = offScreenDirection === DIRECTIONS.DOWN ? 'rotate(180deg)' : '';

    return color === ARROW_COLORS.GREEN ? (
        <ArrowGreenIcon className='arrow-icon' style={{ top, transform }} />
    ) : (
        <ArrowOrangeIcon className='arrow-icon' style={{ top, transform }} />
    );
};

export default PriceLineArrow;
