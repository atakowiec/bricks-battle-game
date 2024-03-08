import {createSlice} from "@reduxjs/toolkit";

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

export default layoutSlice.reducer;

export const layoutActions = layoutSlice.actions;