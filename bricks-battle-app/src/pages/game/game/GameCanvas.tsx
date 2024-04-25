import { useBoardSize } from './BoardContainer.tsx';
import { useEffect, useMemo, useRef } from 'react';
import { GameState } from '../../../store/gameSlice.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from './Game.module.scss';
import { IGameMember } from '@shared/Game.ts';
import { Drops } from './components/Drops.tsx';
import { Ball } from './components/Ball.tsx';
import { Paddle } from './components/Paddle.tsx';

export interface GameCanvasProps {
  map: number[][];
  game: GameState;
  gameMember: IGameMember;
}

export function GameCanvas(props: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const boardSize = useBoardSize();
  const mapBlocks = useSelector(state => state.commonData.blocks);
  const cellSize = useMemo(() => boardSize / props.game!.map.size, [boardSize]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function drawBlocks() {
      props.map.forEach((row, i) => {
        row.forEach((block, j) => {
          if (block === 0) return;
          ctx.beginPath();
          ctx.roundRect(j * cellSize + 1, i * cellSize + 1, cellSize - 2, cellSize - 2, 5);
          ctx.fillStyle = mapBlocks[block]?.data ?? '#ffffff20';
          ctx.fill();
          ctx.closePath();
        });
      });
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBlocks();
    }

    update();
  }, [props.gameMember.board, cellSize]);

  return (
    <>
      <canvas ref={canvasRef} width={boardSize} height={boardSize} className={style.gameCanvas} />
      <Paddle {...props} />
      <Ball {...props} />
      <Drops {...props} />
    </>
  );
}