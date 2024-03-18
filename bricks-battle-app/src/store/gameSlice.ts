import { createSlice } from '@reduxjs/toolkit';
import { GameMember } from '@shared/Game.ts';

export type GameState = {
  owner: GameMember;
  opponent?: GameMember;
} | null;

const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameState,
  reducers: {
    updateGame: (state, action) => {
      if(!state)
        return action.payload;

      state.owner = action.payload.owner ?? state.owner;
      state.opponent = action.payload.opponent ?? state.opponent;

      return state;
    }
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;