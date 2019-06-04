import React from 'react';

const Shade = ({
    top,
    bottom,
    visible,
    className,
    right,
}) => (
    <div
        className={`shade ${className || ''} ${visible ? '' : 'hidden'}`}
        style={{ top, bottom, right }}
    />
);

export default Shade;
