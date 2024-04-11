import { PropsWithGame } from './GameBox.tsx';
import { GameCanvas } from './GameCanvas.tsx';

export function OpponentBoard(props: PropsWithGame) {
  const game = props.game!;

  return (
    <GameCanvas gameMember={game.opponent!} map={game.opponent!.board} game={game} />
  );
}