// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(6142) FIXME: Module './FastMarker.jsx' was resolved to '/Users/... Remove this comment to see the full error message
import FastMarker from './FastMarker.jsx';
import { connect } from '../store/Connect';
import '../../sass/components/_pagination-loader.scss';

const PaginationLoader = ({
    isOnPagination,
    setRef,
}: any) =>
    isOnPagination ? (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <FastMarker markerRef={setRef} className='pagination'>
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            <div className='pagination__loader'>
                {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
                <div className='pagination__loader-background' />
            {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
            </div>
        </FastMarker>
    ) : (
        // @ts-expect-error ts-migrate(17004) FIXME: Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <></>
    );

// @ts-expect-error ts-migrate(2554) FIXME: Expected 2 arguments, but got 1.
export default connect(({ paginationLoader: s }) => ({
    isOnPagination: s.isOnPagination,
    setRef: s.setRef,
}))(PaginationLoader);
