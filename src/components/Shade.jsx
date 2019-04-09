import PropTypes    from 'prop-types';
import React        from 'react';

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

Shade.propTypes = {
    top         : PropTypes.number,
    bottom      : PropTypes.number,
    visible     : PropTypes.bool,
    className   : PropTypes.string,
};

Shade.defaultProps = {
    top         : 0,
    bottom      : 0,
    visible     : false,
    className   : '',
};

export default Shade;
