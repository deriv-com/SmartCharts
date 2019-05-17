import PropTypes    from 'prop-types';
import React        from 'react';

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

Shade.propTypes = {
    top: PropTypes.number,
    bottom: PropTypes.number,
    visible: PropTypes.bool,
    className: PropTypes.string,
};

Shade.defaultProps = {
    top: 0,
    bottom: 0,
};

export default Shade;
