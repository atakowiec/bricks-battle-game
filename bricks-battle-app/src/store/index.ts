import {configureStore} from '@reduxjs/toolkit'
import layoutReducer, {LayoutState} from "./layoutSlice.ts";

export interface State {
    layout: LayoutState
}

export const store = configureStore<State>({
    reducer: {
        layout: layoutReducer
    }
})