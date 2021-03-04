// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './Icons.jsx' was resolved to '/Users/balak... Remove this comment to see the full error message
import { ArrowGreenIcon, ArrowOrangeIcon } from './Icons.jsx';
import { ARROW_HEIGHT, ARROW_COLORS, DIRECTIONS } from '../utils';

const PriceLineArrow = ({
    offScreenDirection,
    color,
}: any) => {
    const top = offScreenDirection === DIRECTIONS.UP && `${-ARROW_HEIGHT}px`;
    const transform = offScreenDirection === DIRECTIONS.DOWN && 'rotate(180deg)';

    return color === ARROW_COLORS.GREEN ? (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ArrowGreenIcon className='arrow-icon' style={{ top, transform }} />
    ) : (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <ArrowOrangeIcon className='arrow-icon' style={{ top, transform }} />
    );
};

export default PriceLineArrow;
