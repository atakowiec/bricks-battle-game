import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';

export function Ball(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const blockSize = boardSize / props.game!.map.size;
  const ballSize = props.gameMember.ballSize * blockSize;

  return (
    <div className={style.ball} style={{
      width: `${ballSize}px`,
      height: `${ballSize}px`,
      top: `${blockSize*props.gameMember.ballPosition[1]}px`,
      left: `${blockSize*props.gameMember.ballPosition[0]}px`
    }} />
  );
}