import React from 'react'; // @ts-expect-error ts-migrate(6142) FIXME: Module './FastMarker' was resolved to '/Users/... Remove this comment to see the full error message
import FastMarker from './FastMarker';
import { connect } from '../store/Connect';
import '../../sass/components/_pagination-loader.scss';

const PaginationLoader = ({ isOnPagination, setRef }: any) =>
    isOnPagination ? (
        <FastMarker markerRef={setRef} className='pagination'>
            <div className='pagination__loader'>
                <div className='pagination__loader-background' />
            </div>
        </FastMarker>
    ) : (
        <></>
    );

export default connect(({ paginationLoader: s }) => ({
    isOnPagination: s.isOnPagination,
    setRef: s.setRef,
}))(PaginationLoader);
