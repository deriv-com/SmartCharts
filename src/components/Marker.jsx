import React from 'react';
import { connect } from '../store/Connect';
import MarkerStore from '../store/MarkerStore';
import '../../sass/components/_markers.scss';

const Marker = ({
    left,
    bottom,
    children,
    className,
}) => (
    <div className={`stx-marker ${className || ''}`} style={{ left, bottom }}>
        {children}
    </div>
);

export default connect(
    MarkerStore,
    store => ({
        left: store.left,
        bottom: store.bottom,
        children: store.children,
        className: store.className,
    }),
    (store, {
        yPositioner, xPositioner, x, y, children, className,
    }) => {
        if (yPositioner) { store.yPositioner = yPositioner; }
        if (xPositioner) { store.xPositioner = xPositioner; }
        if (x) { store.x = x; }
        if (y) { store.y = y; }
        store.children = children;
        store.className = className;
    },
)(Marker);

