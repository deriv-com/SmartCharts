import React from 'react';
import { connect } from '../store/Connect';
import MarkerStore from '../store/MarkerStore';
import '../../sass/components/_markers.scss';

const Marker = ({
    left,
    bottom,
}) => (
    <div className="stx-marker" style={{ left, bottom }}>
        <div className="ciq-spot" />
    </div>
);

export default connect(
    MarkerStore,
    store => ({
        left: store.left,
        bottom: store.bottom,
    }),
    (store, {
        yPositioner, xPositioner, x, y,
    }) => {
        if (yPositioner) { store.yPositioner = yPositioner; }
        if (xPositioner) { store.xPositioner = xPositioner; }
        if (x) { store.x = x; }
        if (y) { store.y = y; }
    },
)(Marker);

