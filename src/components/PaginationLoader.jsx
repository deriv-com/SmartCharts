import PropTypes    from 'prop-types';
import React        from 'react';
import Marker       from './Marker.jsx';
import { connect }  from '../store/Connect';

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

PaginationLoader.propTypes = {
    epoch       : PropTypes.number,
};

PaginationLoader.defaultProps = {
    epoch       : 0,
};

export default connect(({ state }) => ({
    epoch: state.paginationEndEpoch,
}))(PaginationLoader);
