import React from 'react';
import classNames from 'classnames';

const Shade = ({
    // top,
    // bottom,
    // right,
    visible,
    className,
    setShadeRef,
}) => <div className={classNames('shade', className, { hidden: !visible })} ref={setShadeRef} style={{ top: -120 }} />;

export default Shade;
