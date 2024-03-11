import {createSlice} from "@reduxjs/toolkit";
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface LayoutState {
    stage: "main" | "game-lobby" | "game"
    tab: string
}

const layoutSlice = createSlice({
    name: "layout",
    initialState: {
        stage: "main",
        tab: "main"
    } as LayoutState,
    reducers: {
        setStage: (state, action) => {
            state.stage = action.payload
        },
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