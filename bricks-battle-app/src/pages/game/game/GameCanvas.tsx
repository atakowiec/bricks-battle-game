import { useBoardSize } from './BoardContainer.tsx';
import { useMemo } from 'react';
import { GameState } from '../../../store/gameSlice.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from './Game.module.scss';
import { Cell } from './components/Cell.tsx';
import { Paddle } from './components/Paddle.tsx';
import { IGameMember } from '@shared/Game.ts';
import { Ball } from './components/Ball.tsx';

export interface GameCanvasProps {
  map: number[][];
  game: GameState;
  gameMember: IGameMember;
}

export function GameCanvas(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const mapBlocks = useSelector(state => state.commonData.blocks);
  const cellSize = useMemo(() => boardSize / props.game!.map.size, [boardSize]);

  return (
    <>
      {
        props.map.map((row, i) => (
          <div className={style.boardRow} key={`row-${i}`}>
            {row.map((block, j) => (
              <Cell key={`block-${i}-${j}-${block}`} style={{
                width: `${cellSize - 2}px`,
                height: `${cellSize - 2}px`,
                backgroundColor: `${mapBlocks[block]?.data}`,
              }} />
            ))}
          </div>
        ))
      }
      <Paddle {...props} />
      <Ball {...props} />
    </>
  );
}