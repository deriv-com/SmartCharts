import React, {
    useEffect }        from 'react';
import Marker          from './Marker.jsx';
import { connect }     from '../store/Connect';
import { getUTCEpoch } from '../utils';

const HighestLowestMarker = ({
    destroy,
    highest,
    lowest,
}) => {
    useEffect(() => () => destroy(), []);

    return (
        highest && lowest && highest.Date !== lowest.Date
            ? <>
                <Marker
                    x={getUTCEpoch(CIQ.strToDateTime(highest.Date))}
                    xPositioner="epoch"
                    y={highest.Close}
                    yPositioner="value"
                >
                        x
                </Marker>
                <Marker
                    x={getUTCEpoch(CIQ.strToDateTime(lowest.Date))}
                    xPositioner="epoch"
                    y={lowest.Close}
                    yPositioner="value"
                >
                        y
                </Marker>
            </>
            : <></>
    );
};

export default connect(({ highestLowest:s }) => ({
    destroy: s.destroy,
    highest: s.highest,
    lowest : s.lowest,
}))(HighestLowestMarker);
