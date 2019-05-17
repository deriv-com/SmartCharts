import PropTypes    from 'prop-types';
import React        from 'react';
import { connect }  from '../store/Connect';
import '../../sass/components/_drawing-cursor.scss';
import { DrawingCursorIcon } from './Icons.jsx';

const DrawingCursor = ({
    display,
    left,
    top,
}) => (
    <div className="drawing-mouse-pointer" style={{ top, left, display }}>
        <DrawingCursorIcon />
    </div>
);

DrawingCursor.propTypes = {
    display: PropTypes.string,
    left: PropTypes.number,
    top: PropTypes.number,
};

DrawingCursor.defaultProps = {
    display: 'none',
    left: 0,
    top: 0,
};

export default connect(({ drawingCursor : dc }) => ({
    top: dc.top,
    left: dc.left,
    display: dc.display,
}))(DrawingCursor);
