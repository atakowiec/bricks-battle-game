import { createSlice } from '@reduxjs/toolkit';
import { IGameMember, GamePacket, GameStatus } from '@shared/Game.ts';
import { IMap } from '@shared/Map.ts';
import lodash from 'lodash';

export type GameState = {
  id: string;
  player: IGameMember;
  opponent?: IGameMember;
  map: IMap
  status: GameStatus;
  winner?: string;
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

      return lodash.merge(state, payload);
    },
    updateBoard: (state, action) => {
      const boardToChange = action.payload.playerBoard ? state?.player.board : state?.opponent?.board;
      if (!boardToChange) {
        return state;
      }

      const { x, y, newBlock } = action.payload;
      boardToChange[y][x] = newBlock;

      return state;
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;