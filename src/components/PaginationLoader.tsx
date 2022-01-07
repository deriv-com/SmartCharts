import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/store';
import FastMarker from './FastMarker';
import '../../sass/components/_pagination-loader.scss';

const PaginationLoader = () => {
    const { paginationLoader } = useStores();
    const { isOnPagination, setRef } = paginationLoader;
    return isOnPagination ? (
        <FastMarker markerRef={setRef} className='pagination'>
            <div className='pagination__loader'>
                <div className='pagination__loader-background' />
            </div>
        </FastMarker>
    ) : (
        <></>
    );
};

export default observer(PaginationLoader);
