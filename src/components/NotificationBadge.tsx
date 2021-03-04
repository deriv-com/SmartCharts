// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'reac... Remove this comment to see the full error message
import React from 'react';
// @ts-expect-error ts-migrate(7016) FIXME: Could not find a declaration file for module 'clas... Remove this comment to see the full error message
import classNames from 'classnames';

const NotificationBadge = ({
    notificationCount,
}: any) =>
    notificationCount ? (
        // @ts-expect-error ts-migrate(7026) FIXME: JSX element implicitly has type 'any' because no i... Remove this comment to see the full error message
        <span className={classNames('sc-notification-badge', { x2: notificationCount > 9 })}>{notificationCount}</span>
    ) : null;

export default NotificationBadge;
