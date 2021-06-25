import React from 'react';
import classNames from 'classnames';

const NotificationBadge = ({ notificationCount }: { notificationCount: number }) =>
    notificationCount ? (
        <span className={classNames('sc-notification-badge', { x2: notificationCount > 9 })}>{notificationCount}</span>
    ) : null;

export default NotificationBadge;
