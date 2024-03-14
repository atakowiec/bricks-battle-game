import { configureStore } from '@reduxjs/toolkit';
import { LayoutState, persistedLayoutReducer } from './layoutSlice.ts';
import userReducer, { UserState } from './userSlice.ts';
import { persistStore } from 'redux-persist';
import { PersistPartial } from 'redux-persist/es/persistReducer';
import { PURGE, REGISTER, FLUSH, REHYDRATE, PAUSE, PERSIST } from 'redux-persist/es/constants';
import commonDataSlice, { CommonDataState } from './commonDataSlice.ts';

export interface State {
  layout: LayoutState & PersistPartial;
  user: UserState;
  commonData: CommonDataState;
}

export const store = configureStore<State>({
  reducer: {
    layout: persistedLayoutReducer,
    user: userReducer,
    commonData: commonDataSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);