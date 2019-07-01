import React, { memo } from 'react';
import Marker          from './Marker.jsx';
import { connect }     from '../store/Connect';

import '../../sass/components/_highest-lowest-marker.scss';

const HighestLowestMarker = memo(({
    highestDate,
    highestPrice,
    lowestDate,
    lowestPrice,
}) => (
    highestPrice && lowestPrice && highestDate !== lowestDate
        ? <>
    <Marker
        x={highestDate}
        xPositioner="epoch"
        y={+highestPrice}
        yPositioner="value"
    >
        <span className="spot__shape-circule spot__fill-blue" />
        <span className="spot__label" data-label-pos="top"> {`${t.translate('H')}: ${highestPrice}`} </span>
    </Marker>
    <Marker
        x={lowestDate}
        xPositioner="epoch"
        y={+lowestPrice}
        yPositioner="value"
    >
        <span className="spot__shape-circule spot__fill-red" />
        <span className="spot__label" data-label-pos="bottom"> {`${t.translate('L')} : ${lowestPrice}`} </span>
    </Marker>
    </>
        : <></>
));

export default connect(({ highestLowest:s }) => ({
    highestDate  : s.highestDate,
    highestPrice : s.highestPrice,
    lowestDate   : s.lowestDate,
    lowestPrice  : s.lowestPrice,
}))(HighestLowestMarker);
