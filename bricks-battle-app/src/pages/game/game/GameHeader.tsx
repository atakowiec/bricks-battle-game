import style from './Game.module.scss';
import { PropsWithGame } from './GameBox.tsx';
import { InlineButtons } from '../../../components/InlineButtons.tsx';
import Button from '../../../components/Button.tsx';
import useSocket from '../../../socket/useSocket.ts';

export function GameHeader(props: PropsWithGame) {
  const game = props.game!;
  const socket = useSocket()

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
      <InlineButtons className={"mt-0"}>
        {game.player.owner && <Button className={style.headerButton} onClick={() => socket.emit('pause')}>
          ||
        </Button>}
      </InlineButtons>
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