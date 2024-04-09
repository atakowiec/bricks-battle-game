import { PropsWithGame } from './GameBox.tsx';
import { decodeMap } from '../../../utils/utils.ts';
import { GameCanvas } from './GameCanvas.tsx';

export function OpponentBoard(props: PropsWithGame) {
  const game = props.game!;
  const map = decodeMap(game.opponent!.board, game.map.size);

  return (
    <GameCanvas gameMember={game.opponent!} map={map} game={game} />
  );
}