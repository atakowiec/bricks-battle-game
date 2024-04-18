import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';

export function Drops(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const blockSize = boardSize / props.game!.map.size;

  return (
    <>
      {props.gameMember.drops.map(drop => (
        <div key={drop.id}
             className={`${style.drop} ${style[drop.type]} ${style[drop.effect]} ${style[drop.target]}`}
             style={{
               left: `${(drop.position[0] - drop.size) * blockSize}`,
               top: `${(drop.position[1] - drop.size) * blockSize}`,
               width: `${blockSize * drop.size * 2}px`,
               height: `${blockSize * drop.size * 2}px`,
             }} />
      ))}
    </>
  );
}