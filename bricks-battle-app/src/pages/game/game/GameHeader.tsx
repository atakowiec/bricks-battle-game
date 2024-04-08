import style from './Game.module.scss';
import { PropsWithGame } from './GameBox.tsx';

export function GameHeader(props: PropsWithGame) {
  const game = props.game!;

  // todo header is simple for now (no idea what should i put here)

  return (
    <div className={style.gameHeader}>
      <div>
        {game.player.nickname}
      </div>
      <div>
        {game.opponent!.nickname}
      </div>
    </div>
  );
}