// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './FastMarker.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import FastMarker from './FastMarker.jsx';
import { connect } from '../store/Connect';

import '../../sass/components/_highest-lowest-marker.scss';

const HighestLowestMarker = ({
    setHighestRef,
    setLowestRef,
}: any) => (
    // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
    <>
        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <FastMarker
            markerRef={setHighestRef}
            className='sc-highlow sc-highlow--highest'
            offsetTop={-80}
            offsetLeft={-80}
        >
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <span className='spot__shape-circule spot__fill-blue' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <span className='spot__label' data-label-pos='top'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span>{`${t.translate('H')}: `}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span className='spot__value' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </span>
        </FastMarker>

        {/* @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message */}
        <FastMarker markerRef={setLowestRef} className='sc-highlow sc-highlow--lowest' offsetTop={-80} offsetLeft={-80}>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <span className='spot__shape-circule spot__fill-red' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <span className='spot__label' data-label-pos='bottom'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span>{`${t.translate('L')} : `}</span>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <span className='spot__value' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </span>
        </FastMarker>
    </>
);

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({ highestLowest: s }) => ({
    setHighestRef: s.setHighestRef,
    setLowestRef: s.setLowestRef,
}))(HighestLowestMarker);
