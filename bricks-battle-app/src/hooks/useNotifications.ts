import { useDispatch } from 'react-redux';
import { notificationActions, NotificationType } from '../store/notificationSlice.ts';
import useSelector from './useSelector.ts';

let nextId = 1;

export default function useNotifications() {
  const dispatch = useDispatch();
  const notifications = useSelector(state => state.notifications);

  function addNotification(message: any, type: NotificationType, time?: number) {
    const id = nextId++;
    dispatch(notificationActions.addNotification({
      id,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      type,
      time: time ?? (type === 'title' ? 1000 : 5000)
    }));

    setTimeout(() => {
      removeNotification(id);
    }, time ?? (type === 'title' ? 1000 : 5000));
  }

  function removeNotification(id: number) {
    dispatch(notificationActions.removeNotification(id));
  }

  return {
    notifications,
    addNotification,
    removeNotification,
  };
}