import PropTypes        from 'prop-types';
import React            from 'react';
import { connect }      from '../store/Connect';

const CurrentSpot = ({
    left,
    top,
    show,
}) => (show
    && (
        <span
            className="cq-spot"
            style={{ top, left }}
        />
    )
);

CurrentSpot.propTypes = {
    left: PropTypes.number,
    top: PropTypes.number,
    show: PropTypes.bool,
};

CurrentSpot.defaultProps = {
    left: 0,
    top: 0,
};

export default connect(({ currentSpot: cs }) => ({
    left: cs.left,
    top: cs.top,
    show: cs.show,
}))(CurrentSpot);
