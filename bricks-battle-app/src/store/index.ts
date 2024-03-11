import {configureStore} from '@reduxjs/toolkit'
import layoutReducer, {LayoutState} from "./layoutSlice.ts";
import userReducer, { UserState } from './userSlice.ts';

export interface State {
    layout: LayoutState
    user: UserState | null
}

export const store = configureStore<State>({
    reducer: {
        layout: layoutReducer,
        user: userReducer
    }
})