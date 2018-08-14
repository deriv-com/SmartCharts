import React from 'react';
import {
    PositionLeftIcon,
    PositionBottomIcon,
} from './Icons.jsx';


const ThemeToggle = ({
    position,
    setPosition,
}) => (
    <div className="ciq-list-item ciq-list-item-position">
        <span className="ciq-icon-text">{t.translate('Position')}</span>
        <div className="ciq-action">
            <PositionBottomIcon
                onClick={() => setPosition('bottom')}
                className={`${position === 'bottom' ? 'active' : ''}`}
            />
            <PositionLeftIcon
                onClick={() => setPosition('left')}
                className={`${position === 'left' ? 'active' : ''}`}
            />
        </div>
    </div>
);

export default ThemeToggle;
