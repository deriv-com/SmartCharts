import React from 'react';

const Shade = ({
    top,
    bottom,
    visible,
    className,
}) => (
    <div
        className={`shade ${className || ''}`}
        style={{top, bottom}}
        hidden={visible ? undefined : 'true'}
    />
);

export default Shade;
