import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-crosshair.scss';

const Crosshair = ({
    left,
    top,
    rows,
    setRootRef,
    state,
    isArrowLeft,
}) => (
    <div
        className={`cq-crosshair ${(state === 2) ? 'active' : ''}`}
    >
        <div
            className={`cq-crosshair-content ${isArrowLeft ? 'arrow-left' : 'arrow-right'}`}
            ref={setRootRef}
            style={{ left, top }}
        >
            {rows.map(row => (
                <div className="row" key={row.name}>
                    <span>{row.name !== 'DT' ? `${row.name}:` : row.value}</span>
                    <span>{row.name !== 'DT' ? row.value : ''}</span>
                </div>
            ))}
        </div>
    </div>
);

export default connect(({ crosshair: c }) => ({
    left: c.left,
    top: c.top,
    rows: c.rows,
    setRootRef: c.setRootRef,
    isArrowLeft: c.isArrowLeft,
    state: c.state,
}))(Crosshair);
