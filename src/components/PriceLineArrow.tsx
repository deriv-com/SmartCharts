import React from 'react';
import { ArrowGreenIcon, ArrowOrangeIcon } from './Icons';
import { ARROW_HEIGHT, DIRECTIONS } from '../utils';

type TPriceLineArrowProps = {
    offScreenDirection: keyof typeof DIRECTIONS;
    color?: string;
};

const PriceLineArrow = ({ offScreenDirection }: TPriceLineArrowProps) => {
    const top = offScreenDirection === DIRECTIONS.UP ? '23px' : `${-ARROW_HEIGHT}px`;
    const transform = offScreenDirection === DIRECTIONS.DOWN ? 'rotate(180deg)' : '';

    return offScreenDirection === DIRECTIONS.UP ? (
        <ArrowGreenIcon className='arrow-icon' style={{ top, transform }} />
    ) : (
        <ArrowOrangeIcon className='arrow-icon' style={{ top, transform }} />
    );
};

export default PriceLineArrow;
