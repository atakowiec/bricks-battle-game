import { createSlice } from '@reduxjs/toolkit';

export interface Notification {
  id?: number;
  message: string;
  type: NotificationType;
  time: number;
}

export type NotificationType = 'info' | 'error' | 'title';

export type NotificationState = Notification[]

const notificationSlice = createSlice({
  name: 'notification',
  initialState: [] as Notification[],
  reducers: {
    addNotification(state, action) {
      if (!action.payload.id) return state;

      state.push({
        ...action.payload,
      });

      return state;
    },
    removeNotification(state, action) {
      const index = state.findIndex(n => n.id === action.payload);

      if (index !== -1) {
        state.splice(index, 1);
      }

      return state;
    },
  },
});

export const notificationActions = notificationSlice.actions;
export default notificationSlice.reducer;