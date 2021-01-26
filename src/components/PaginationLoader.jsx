import React from 'react';
import FastMarker from './FastMarker.jsx';
import { connect } from '../store/Connect';
import '../../sass/components/_pagination-loader.scss';

const PaginationLoader = ({ isOnPagination, setRef }) =>
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
