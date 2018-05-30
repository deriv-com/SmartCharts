import React from 'react';
import { connect } from '../store/Connect';
import '../../sass/components/_ciq-crosshair.scss';

const Crosshair = ({
    left,
    right,
    top,
    rows,
    setRootRef,
}) => (
    <div
        ref={setRootRef}
        className={`cq-crosshair ${left === 'auto' ? 'arrow-right' : 'arrow-left'}`}
        style={{ left, top, right }}
    >
        {rows.map(row => (
            <div className="row" key={row.name}>
                <span>{row.name !== 'DT' ? `${row.name}:` : row.value}</span>
                <span>{row.name !== 'DT' ? row.value : ''}</span>
            </div>
        ))}
    </div>
);

export default connect(({ crosshair: c }) => ({
    right: c.right,
    left: c.left,
    top: c.top,
    rows: c.rows,
    setRootRef: c.setRootRef,
}))(Crosshair);
