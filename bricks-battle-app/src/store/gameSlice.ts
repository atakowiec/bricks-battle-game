import { createSlice } from '@reduxjs/toolkit';
import { GameMember, GamePacket } from '@shared/Game.ts';
import { IMap } from '@shared/Map.ts';

export type GameState = {
  id: string;
  player: GameMember;
  opponent?: GameMember;
  map: IMap
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

      if (payload.map) {
        payload.map = {
          ...state.map,
          ...payload.map,
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