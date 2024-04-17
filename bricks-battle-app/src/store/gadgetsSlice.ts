import { createSlice } from '@reduxjs/toolkit';
import { IGadget, SelectedGadgets } from '@shared/Gadgets.ts';

export type GadgetsState = SelectedGadgets

const gadgetsSlice = createSlice({
  name: 'selectedGadgets',
  initialState: {} as GadgetsState,
  reducers: {
    selectGadget(state, action) {
      const gadget: IGadget = action.payload;
      state[gadget.type] = gadget;

      return state;
    },
    setSelected(_, action) {
      return action.payload;
    },
  },
});

export default gadgetsSlice.reducer;

export const gadgetsActions = gadgetsSlice.actions;