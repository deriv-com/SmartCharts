import React from 'react';
import classNames from 'classnames';
import { connect } from '../store/Connect';
import MarkerStore from '../store/MarkerStore';
import '../../sass/components/_markers.scss';

const Marker = ({ display, left, bottom, children, className }) => (
    <div className={classNames('stx-marker', className)} style={{ display, left, bottom }}>
        {children}
    </div>
);

export default connect(
    store => ({
        left: store.left,
        bottom: store.bottom,
        children: store.children,
        className: store.className,
        display: store.display,
    }),
    MarkerStore
)(Marker);
