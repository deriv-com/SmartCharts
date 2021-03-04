// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';
import { connect } from '../store/Connect';
import MarkerStore from '../store/MarkerStore';
import '../../sass/components/_markers.scss';

const Marker = ({
    display,
    left,
    bottom,
    children,
    className,
}: any) => (
    // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
    <div className={classNames('stx-marker', className)} style={{ display, left, bottom }}>
        {children}
    {/* @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message */}
    </div>
);

export default connect(
    (store: any) => ({
        left: store.left,
        bottom: store.bottom,
        children: store.children,
        className: store.className,
        display: store.display,
    }),
    MarkerStore
)(Marker);
