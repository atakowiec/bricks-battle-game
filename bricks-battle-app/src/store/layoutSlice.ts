import {createSlice} from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface LayoutState {
    tab: string
}

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        tab: "main"
    } as LayoutState,
    reducers: {
        setTab: (state, action) => {
            state.tab = action.payload
        }
    }
})

export const persistedLayoutReducer = persistReducer({
  key: 'layout',
  storage,
}, layoutSlice.reducer);

export default layoutSlice.reducer;

export const layoutActions = layoutSlice.actions;