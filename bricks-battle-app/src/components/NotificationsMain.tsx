import useNotifications from '../hooks/useNotifications.ts';
import { Notification } from '../store/notificationSlice.ts';
import style from '../style/notifications.module.scss';

export default function NotificationsMain() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className={style.notificationsBox}>
      {notifications.map(n => (
        <NotificationCard key={n.id} notification={n} onClick={removeNotification} />
      ))}
    </div>
  );
}

function NotificationCard(props: { notification: Notification, onClick: (id: number) => void }) {
  return (
    <div className={style.notificationCard} onClick={() => props.onClick(props.notification.id!)}>
      {props.notification.message}
    </div>
  );
}