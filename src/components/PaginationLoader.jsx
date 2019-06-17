import React       from 'react';
import Marker      from './Marker.jsx';
import { connect } from '../store/Connect';

import '../../sass/components/_pagination-loader.scss';


const PaginationLoader = ({ epoch }) => (
    <Marker
        x={epoch}
        xPositioner="epoch"
        className="pagination"
    >
        <div className="pagination__loader">
            <div className="pagination__loader-background" />
        </div>
    </Marker>
);

export default connect(({ state }) => ({
    epoch: state.paginationEndEpoch,
}))(PaginationLoader);
