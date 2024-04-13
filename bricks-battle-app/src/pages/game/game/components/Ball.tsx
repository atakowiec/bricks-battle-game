import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';

export function Ball(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const blockSize = boardSize / props.game!.map.size;
  const ballSize = props.gameMember.ballSize * blockSize;

  return (
    <div className={style.ball} style={{
      width: `${ballSize * 2}px`,
      height: `${ballSize * 2}px`,
      top: `${blockSize * props.gameMember.ballPosition[1] - ballSize}px`,
      left: `${blockSize * props.gameMember.ballPosition[0] - ballSize}px`,
    }} />
  );
}