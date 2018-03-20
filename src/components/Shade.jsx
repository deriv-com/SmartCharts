import React from 'react';

const Shade = ({
    isActive,
    top,
    bottom,
    visible,
    className,
}) => (
    <div
        className={`shade ${isActive ? 'show' : ''} ${className || ''}`}
        style={{top, bottom}}
        hidden={visible ? undefined : 'true'}
    />
);

export default Shade;
