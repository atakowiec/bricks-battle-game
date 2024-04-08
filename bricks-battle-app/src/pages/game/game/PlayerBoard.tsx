import style from './Game.module.scss';
import { PropsWithGame } from './GameBox.tsx';
import { BoardContainer, useBoardSize } from './BoardContainer.tsx';
import { decodeMap } from '../../../utils/utils.ts';

export function PlayerBoard(props: PropsWithGame) {
  const game = props.game!;
  const map = decodeMap(game.map)
  const boardSize = useBoardSize()

  return (
    game.player!.nickname
  );
}