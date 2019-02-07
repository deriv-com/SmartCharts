import React from 'react';
import { connect } from '../store/Connect';

const CurrentSpot = ({
    left,
    top,
    show,
    historical,
}) => (show
    && (
        <div>
            <span
                className={`cq-spot ${historical ? 'cq-endpoint' : ''}`}
                style={{ top, left }}
            >
                <span className="cq-endpoint-label">
                    {historical || ''}
                </span>
            </span>
        </div>
    )
);

export default connect(({ currentSpot: cs }) => ({
    left: cs.left,
    top: cs.top,
    show: cs.show,
    historical: cs.historical,
}))(CurrentSpot);
