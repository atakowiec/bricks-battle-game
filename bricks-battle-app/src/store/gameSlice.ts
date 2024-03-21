import { createSlice } from '@reduxjs/toolkit';
import { GameMember, GamePacket } from '@shared/Game.ts';

export type GameState = {
  id: string;
  player: GameMember;
  opponent?: GameMember;
} | null;

const gameSlice = createSlice({
  name: 'game',
  initialState: null as GameState,
  reducers: {
    setGame: (_, action) => action.payload,
    updateGame: (state, action) => {
      // do not update state if game is not set
      if (state === null) {
        return state;
      }

      console.log(action.payload);

      const payload: GamePacket = action.payload;

      if (payload.player) {
        payload.player = {
          ...state.player,
          ...payload.player,
        };
      }

      if (payload.opponent) {
        payload.opponent = {
          ...state.opponent,
          ...payload.opponent,
        };
      }

      return {
        ...state,
        ...payload,
      } as GameState;
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;