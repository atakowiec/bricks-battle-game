import { createSlice } from '@reduxjs/toolkit';
import { IMapBlock } from '@shared/Map.ts';

export interface CommonDataState {
  blocks: IMapBlock[];
}

const commonDataSlice = createSlice({
  name: 'commonData',
  initialState: {
    blocks: [],
  } as CommonDataState,
  reducers: {
    setMapBlocks(state, action) {
      state.blocks = action.payload;
    },
  },
});

export const commonDataActions = commonDataSlice.actions;

export default commonDataSlice.reducer;