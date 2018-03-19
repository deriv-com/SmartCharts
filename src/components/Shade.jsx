import React from 'react';

const Shade = ({
    isActive,
    top,
    bottom,
    isVisible,
    className,
}) => (
    <div
        className={`shade ${isActive ? 'show' : ''} ${className || ''}`}
        style={{top, bottom}}
        hidden={isVisible ? undefined : 'true'}
    />
);

export default Shade;
