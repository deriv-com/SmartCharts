import PropTypes    from 'prop-types';
import React        from 'react';
import '../../sass/components/_ciq-dialog.scss';

const Dialog = ({
    open,
    children,
    onContainerClick,
    className,
}) => (
    <div
        className={`${className || 'cq-dialog'} ${open ? ' open' : ''}`}
        onClick={onContainerClick}
    >
        {children}
    </div>
);

Dialog.propTypes = {
    open                : PropTypes.bool,
    children            : PropTypes.any,
    onContainerClick    : PropTypes.func,
    className           : PropTypes.string,
};

Dialog.defaultProps = {
    open                : PropTypes.bool,
    children            : PropTypes.any,
    onContainerClick    : PropTypes.func,
    className           : PropTypes.string,
};

export default Dialog;
