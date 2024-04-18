import { createSlice } from '@reduxjs/toolkit';
import { IGameMember, GamePacket, GameStatus } from '@shared/Game.ts';
import { IMap } from '@shared/Map.ts';
import lodash from 'lodash';
import { DropUpdateData, IDrop } from '@shared/Drops.ts';

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
    newDrops: (state, action) => {
      const drops: IDrop[] = action.payload;
      if (state === null) {
        return state;
      }

      for (const drop of drops) {
        const player = drop.owner === state.player.nickname ? state.player : state.opponent;
        if (!player) continue;
        if (!player.drops) player.drops = [];
        if (player.drops.some(d => d.id === drop.id)) {
          continue;
        }

        player.drops.push(drop);
      }
      return state;
    },
    dropsUpdate: (state, action) => {
      const updates: DropUpdateData[] = action.payload;
      if (state === null) {
        return state;
      }

      for (const update of updates) {
        const player = update.owner === state.player.nickname ? state.player : state.opponent;
        if (!player) continue;
        if (!player.drops) player.drops = [];
        const drop = player.drops.find(d => d.id === update.id);
        if (!drop) continue;

        drop.position = [update.x, update.y];
      }
      return state;
    },
    removeDrop: (state, action) => {
      const dropId: string = action.payload;
      if (state === null) {
        return state;
      }

      for (const player of [state.player, state.opponent]) {
        if (!player || !player.drops) {
          continue;
        }

        const dropIndex = player.drops.findIndex(d => d.id === dropId);
        if (dropIndex === -1) {
          continue;
        }

        player.drops.splice(dropIndex, 1);
      }
      return state;
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;