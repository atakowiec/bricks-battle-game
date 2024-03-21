import { configureStore } from '@reduxjs/toolkit';
import { LayoutState, persistedLayoutReducer } from './layoutSlice.ts';
import userReducer, { UserState } from './userSlice.ts';
import { persistStore } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { PURGE, REGISTER, FLUSH, REHYDRATE, PAUSE, PERSIST } from 'redux-persist/es/constants';
import commonDataSlice, { CommonDataState } from './commonDataSlice.ts';
import gameReducer, { GameState } from './gameSlice.ts';
import notificationSlice, { NotificationState } from './notificationSlice.ts';

export interface State {
  layout: LayoutState & PersistPartial;
  user: UserState;
  commonData: CommonDataState;
  game: GameState;
  notifications: NotificationState;
}

export const store = configureStore<State>({
  reducer: {
    layout: persistedLayoutReducer,
    user: userReducer,
    commonData: commonDataSlice,
    game: gameReducer,
    notifications: notificationSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);