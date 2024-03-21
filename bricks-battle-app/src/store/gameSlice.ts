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
      const payload: GamePacket = action.payload;

      return {
        id: payload.id ?? state?.id!,
        player: payload.player ?? state?.player!,
        opponent: payload.opponent ?? state?.opponent,
      };
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;