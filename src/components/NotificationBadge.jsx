import React from 'react';

const NotificationBadge = ({
    badge,
}) => {
    if (!badge) return ' ';

    return (
        <span className={`notification-badge ${badge > 9 ? 'x2' : ''}`}>
            {badge}
        </span>
    );
};

export default NotificationBadge;
