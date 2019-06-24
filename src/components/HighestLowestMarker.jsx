import React           from 'react';
import Marker          from './Marker.jsx';
import { connect }     from '../store/Connect';
import { getUTCEpoch } from '../utils';

import '../../sass/components/_highest-lowest-marker.scss';

const HighestLowestMarker = ({
    decimalPlaces,
    highest,
    lowest,
}) => (
    highest && lowest && highest.Date !== lowest.Date
        ? <>
    <Marker
        x={getUTCEpoch(CIQ.strToDateTime(highest.Date))}
        xPositioner="epoch"
        y={highest.Close}
        yPositioner="value"
    >
        <span className="spot__shape-circule spot__fill-blue" />
        <span className="spot__label" data-label-pos="top"> {`${t.translate('H')}: ${highest.Close.toFixed(decimalPlaces)}`} </span>
    </Marker>
    <Marker
        x={getUTCEpoch(CIQ.strToDateTime(lowest.Date))}
        xPositioner="epoch"
        y={lowest.Close}
        yPositioner="value"
    >
        <span className="spot__shape-circule spot__fill-red" />
        <span className="spot__label" data-label-pos="bottom"> {`${t.translate('L')} : ${highest.Close.toFixed(decimalPlaces)}`} </span>
    </Marker>
    </>
        : <></>
);

export default connect(({ highestLowest:s }) => ({
    decimalPlaces: s.decimalPlaces,
    highest      : s.highest,
    lowest       : s.lowest,
}))(HighestLowestMarker);
