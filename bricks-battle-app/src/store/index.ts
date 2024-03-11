import { configureStore } from '@reduxjs/toolkit';
import { LayoutState, persistedLayoutReducer } from './layoutSlice.ts';
import { persistedUserReducer, UserState } from './userSlice.ts';
import { persistStore } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { PURGE, REGISTER, FLUSH, REHYDRATE, PAUSE, PERSIST } from 'redux-persist/es/constants';

export interface State {
  layout: LayoutState & PersistPartial;
  user: UserState & PersistPartial;
}

export const store = configureStore<State>({
  reducer: {
    layout: persistedLayoutReducer,
    user: persistedUserReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);