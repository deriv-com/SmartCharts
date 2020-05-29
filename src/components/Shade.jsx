import React from 'react';

const Shade = ({
    // top,
    // bottom,
    // right,
    visible,
    className,
    setShadeRef,
}) => (
    <div
        className={`shade ${className || ''} ${visible ? '' : 'hidden'}`}
        ref={setShadeRef}
        style={{ top: -120 }}
    />
);

export default Shade;
