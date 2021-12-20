import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import FastMarker from './FastMarker';

import '../../sass/components/_highest-lowest-marker.scss';

const HighestLowestMarker = () => {
    const { highestLowest } = useStores();
    const { setHighestRef, setLowestRef } = highestLowest;

    return (
        <>
            <FastMarker
                markerRef={setHighestRef}
                className='sc-highlow sc-highlow--highest'
                offsetTop={-80}
                offsetLeft={-80}
            >
                <span className='spot__shape-circule spot__fill-blue' />
                <span className='spot__label' data-label-pos='top'>
                    <span>{`${t.translate('H')}: `}</span>
                    <span className='spot__value' />
                </span>
            </FastMarker>

            <FastMarker
                markerRef={setLowestRef}
                className='sc-highlow sc-highlow--lowest'
                offsetTop={-80}
                offsetLeft={-80}
            >
                <span className='spot__shape-circule spot__fill-red' />
                <span className='spot__label' data-label-pos='bottom'>
                    <span>{`${t.translate('L')} : `}</span>
                    <span className='spot__value' />
                </span>
            </FastMarker>
        </>
    );
};

export default observer(HighestLowestMarker);
