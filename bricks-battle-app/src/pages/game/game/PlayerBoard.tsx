import { PropsWithGame } from './GameBox.tsx';
import { decodeMap } from '../../../utils/utils.ts';
import { GameCanvas } from './GameCanvas.tsx';

export function PlayerBoard(props: PropsWithGame) {
  const game = props.game!;
  const map = decodeMap(game.player.board, game.map.size);

  return (
    <GameCanvas gameMember={game.player} map={map} game={game} />
  );
}