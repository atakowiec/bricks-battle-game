import { GameCanvasProps } from '../GameCanvas.tsx';
import { CSSProperties, useEffect, useRef } from 'react';
import { useBoardSize } from '../BoardContainer.tsx';
import style from '../Game.module.scss';
import { IGadget } from '@shared/Gadgets.ts';

interface TrailData {
  id: number;
  x: number;
  y: number;
}

export function BallTrails(props: GameCanvasProps) {
  const trailsCouter = useRef(0);
  const trailsPositions = useRef<TrailData[]>([]);
  const blockSize = useBoardSize() / props.game!.map.size;
  const ballSize = props.gameMember.ballSize * blockSize * 2;
  const selectedTrails = props.gameMember.selectedGadgets.trails;
  const trailsData = selectedTrails?.data.split(';');

  useEffect(() => {
    const current = props.gameMember.ballPosition;
    trailsCouter.current++;
    if (trailsCouter.current > 1000) trailsCouter.current = 0;
    trailsPositions.current.push({
      x: current[0],
      y: current[1],
      id: trailsCouter.current,
    });

    while (trailsPositions.current.length >= 10) {
      trailsPositions.current.shift();
    }
  }, [props.gameMember.ballPosition]);

  return (
    <>
      {trailsPositions.current.map((position, i) => {
        if (i === trailsPositions.current.length - 1) return null; // Skip the first trail (the ball itself)
        return <div
          key={`trail-${position.id}`}
          className={style.ballTrail}
          style={{
            ...getTrailStyle(i, selectedTrails, trailsData),
            width: `${ballSize}px`,
            height: `${ballSize}px`,
            top: `${blockSize * position.y - ballSize / 2}px`,
            left: `${blockSize * position.x - ballSize / 2}px`,
          }}
        />;
      })}
    </>
  );
}

function getTrailStyle(i: number, selectedTrails?: IGadget, trailsData?: string[]): CSSProperties {
  if (!selectedTrails || !trailsData) return {};

  const current = trailsData[Math.min(i, trailsData.length - 1)];
  if (!current) return {};

  if (selectedTrails.displayType === 'image') {
    return {
      backgroundImage: `url(${selectedTrails.data})`,
    };
  }

  return {
    backgroundColor: current,
  };
}