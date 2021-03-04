// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';

const Shade = ({
    // top,
    // bottom,
    // right,
    visible,

    className,
    setShadeRef,
// @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
}: any) => <div className={classNames('shade', className, { hidden: !visible })} ref={setShadeRef} style={{ top: -120 }} />;

export default Shade;
