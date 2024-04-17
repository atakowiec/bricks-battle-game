import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';
import { selectedGadgetStyle } from '../../../../utils/utils.ts';

export function Ball(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const blockSize = boardSize / props.game!.map.size;
  const ballSize = props.gameMember.ballSize * blockSize;
  const selectedBall = props.gameMember.selectedGadgets.ball;

  return (
    <div className={style.ball} style={{
      ...selectedGadgetStyle(selectedBall),
      width: `${ballSize * 2}px`,
      height: `${ballSize * 2}px`,
      top: `${blockSize * props.gameMember.ballPosition[1] - ballSize}px`,
      left: `${blockSize * props.gameMember.ballPosition[0] - ballSize}px`,
    }} />
  );
}