import useNotifications from '../hooks/useNotifications.ts';
import { Notification } from '../store/notificationSlice.ts';
import style from '../style/notifications.module.scss';

export default function NotificationsMain() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className={style.notificationsBox}>
      {notifications.map(notification => (
        notification.type === 'title' ?
          <TitleNotification key={notification.id} title={notification.message} /> :
          <NotificationCard key={notification.id} notification={notification} onClick={removeNotification} />
      ))}
    </div>
  );
}

function TitleNotification(props: { title: string }) {
  return (
    <div className={style.titleNotificationCard}>
      {props.title}
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