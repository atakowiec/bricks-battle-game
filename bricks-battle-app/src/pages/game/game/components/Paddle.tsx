import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';
import { selectedGadgetStyle } from '../../../../utils/utils.ts';

export function Paddle(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const cellSize = boardSize / props.game!.map.size;
  const selectedPaddle = props.gameMember.selectedGadgets.paddle;

  // render paddle on canvas (not used)
  /*
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function drawPaddle() {
      const x = props.gameMember.paddlePositionX * cellSize;
      const y = props.gameMember.paddlePositionY * cellSize;
      const paddleSize = props.gameMember.paddleSize * cellSize;
      const paddleThickness = props.gameMember.paddleThickness * cellSize;

      ctx.beginPath();
      ctx.roundRect(x, y, paddleSize, paddleThickness, 5);
      ctx.fillStyle = selectedPaddle?.data ?? 'white';
      ctx.fill();
      ctx.closePath();
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawPaddle();
    }

    function animate() {
      update();
    }
    animate();
  }, [props.gameMember.paddlePositionX, props.gameMember.paddlePositionY, props.gameMember.paddleSize, props.gameMember.paddleThickness]);
*/

  return (
    <div className={style.paddle} style={{
      ...selectedGadgetStyle(selectedPaddle),
      width: `${cellSize * props.gameMember.paddleSize}px`,
      height: `${props.gameMember.paddleThickness * cellSize}px`,
      left: `${cellSize * props.gameMember.paddlePositionX!}px`,
      top: `${cellSize * props.gameMember.paddlePositionY!}px`,
    }} />
  );
}