import style from './Game.module.scss';
import { PropsWithGame } from './GameBox.tsx';
import { BoardContainer } from './BoardContainer.tsx';

export function OpponentBoard(props: PropsWithGame) {
  const game = props.game!;

  return (
    game.opponent!.nickname
  );
}