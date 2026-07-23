import {
  useAppDispatch,
  useAppSelector,
} from '../../app/hooks';

import {
  allNotificationsRead,
  notificationPanelClosed,
  notificationRead,
  notificationRemoved,
  notificationsCleared,
  selectNotifications,
  selectUnreadNotificationCount,
} from './notificationsSlice';

const formatNotificationTime = (
  dateString: string,
): string => {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    day: 'numeric',
    month: 'short',
  }).format(date);
};

function NotificationPanel() {
  const dispatch = useAppDispatch();

  const notifications = useAppSelector(
    selectNotifications,
  );

  const unreadCount = useAppSelector(
    selectUnreadNotificationCount,
  );

  return (
    <>
      <button
        type="button"
        className="notification-panel-overlay"
        aria-label="Close notifications"
        onClick={() =>
          dispatch(notificationPanelClosed())
        }
      />

      <aside
        className="notification-panel"
        aria-label="Notifications"
      >
        <header className="notification-panel-header">
          <div>
            <h2>Notifications</h2>

            <p>
              {unreadCount} unread notification
              {unreadCount === 1 ? '' : 's'}
            </p>
          </div>

          <button
            type="button"
            className="notification-close-button"
            onClick={() =>
              dispatch(notificationPanelClosed())
            }
            aria-label="Close notifications"
          >
            ×
          </button>
        </header>

        <div className="notification-panel-actions">
          <button
            type="button"
            onClick={() =>
              dispatch(allNotificationsRead())
            }
            disabled={unreadCount === 0}
          >
            Mark all as read
          </button>

          <button
            type="button"
            onClick={() =>
              dispatch(notificationsCleared())
            }
            disabled={notifications.length === 0}
          >
            Clear all
          </button>
        </div>

        <div className="notification-list">
          {notifications.length === 0 ? (
            <div className="notification-empty-state">
              <span>✓</span>

              <h3>You are all caught up</h3>

              <p>
                Task activity will appear here.
              </p>
            </div>
          ) : (
            notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-item ${
                  notification.read
                    ? ''
                    : 'notification-item--unread'
                }`}
                onClick={() =>
                  dispatch(
                    notificationRead(
                      notification.id,
                    ),
                  )
                }
              >
                <span
                  className={`notification-type-icon notification-type-icon--${notification.type}`}
                >
                  {notification.type === 'success'
                    ? '✓'
                    : notification.type === 'error'
                      ? '!'
                      : 'i'}
                </span>

                <div className="notification-content">
                  <p>{notification.message}</p>

                  <time
                    dateTime={
                      notification.createdAt
                    }
                  >
                    {formatNotificationTime(
                      notification.createdAt,
                    )}
                  </time>
                </div>

                <button
                  type="button"
                  className="notification-remove-button"
                  onClick={(event) => {
                    event.stopPropagation();

                    dispatch(
                      notificationRemoved(
                        notification.id,
                      ),
                    );
                  }}
                  aria-label="Remove notification"
                >
                  ×
                </button>
              </article>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

export default NotificationPanel;