import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';

export function Paddle(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const blockSize = boardSize / props.game!.map.size;

  return (
    <div className={style.paddle} style={{
      width: `${blockSize * props.gameMember.paddleSize}px`,
      height: `${props.gameMember.paddleThickness * blockSize}px`,
      left: `${blockSize * props.gameMember.paddlePositionX!}px`,
      top: `${blockSize * props.gameMember.paddlePositionY!}px`,
    }} />
  );
}