import style from './Game.module.scss';
import { PropsWithGame } from './GameBox.tsx';

export function GameHeader(props: PropsWithGame) {
  const game = props.game!;

  return (
    <div className={style.gameHeader}>
      <div className={style.headerElement}>
        {game.player.nickname}
        <div className={style.livesBox}>
          {Array.from({ length: game.player.lives }, (_, i) => (
            <div key={i} className={style.life} />
          ))}
        </div>
      </div>
      <div className={style.headerElement}>
        {game.opponent!.nickname}
        <div className={style.livesBox}>
          {Array.from({ length: game.opponent!.lives }, (_, i) => (
            <div key={i} className={style.life} />
          ))}
        </div>
      </div>
    </div>
  );
}