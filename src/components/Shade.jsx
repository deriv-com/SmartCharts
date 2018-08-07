import React from 'react';

const Shade = ({
    top,
    bottom,
    visible,
    className,
    backgroundColor,
    backgroundImage,
}) => (
    <div
        className={`shade ${className || ''} ${visible ? '' : 'hidden'}`}
        style={{ top, bottom, backgroundColor, backgroundImage }}
    />
);

export default Shade;
