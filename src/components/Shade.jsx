import React from 'react';

const Shade = ({
    top,
    bottom,
    visible,
    className,
}) => (
    <div
        className={`shade ${className || ''} ${visible ? '' : 'hidden'}`}
        style={{ top, bottom }}
    />
);

export default Shade;
