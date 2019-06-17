import React from 'react';
import { connect } from '../store/Connect';

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

export default connect(({ currentSpot: cs }) => ({
    left: cs.left,
    top: cs.top,
    show: cs.show,
}))(CurrentSpot);
