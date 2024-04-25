import { GameCanvasProps } from '../GameCanvas.tsx';
import style from '../Game.module.scss';
import { useBoardSize } from '../BoardContainer.tsx';
import { DropEffect, DropTarget, DropType } from '@shared/Drops.ts';

const DROP_TYPES: DropType[] = ['negative', 'positive'];
const DROP_EFFECTS: DropEffect[] = ['ball_count', 'life', 'paddle_size', 'paddle_speed'];
const DROP_TARGETS: DropTarget[] = ['player', 'opponent'];

export const DROP_IMAGES: { [target in DropTarget]?: { [effect in DropEffect]?: { [type in DropType]?: any } } } = {};

DROP_TARGETS.forEach(target => {
  DROP_IMAGES[target] = {};
  DROP_EFFECTS.forEach(effect => {
    DROP_IMAGES[target]![effect] = {};
    DROP_TYPES.forEach(type => {
      const image = new Image();
      image.src = `/assets/drops/${target}/${effect}_${type}.svg`;
      DROP_IMAGES[target]![effect]![type] = image;
    });
  });
});

export function Drops(props: GameCanvasProps) {
  const boardSize = useBoardSize();
  const cellSize = boardSize / props.game!.map.size;

  // render drops on canvas (not used)
/*
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function drawDrops() {
      props.gameMember.drops.forEach(drop => {
        const x = (drop.position[0] - drop.size) * cellSize;
        const y = (drop.position[1] - drop.size) * cellSize;
        const size = cellSize * drop.size;
        const type = drop.type;
        const effect = drop.effect;
        const target = drop.target;
        const borderWidth = size / 10;

        ctx.beginPath();
        // border
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = type === 'negative' ? '#ff4444' : '#00cc00';
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        // background
        ctx.arc(x, y, size - borderWidth, 0, Math.PI * 2);
        ctx.fillStyle = target === 'player' ? 'white' : 'black';
        ctx.fill();

        // image
        const image = DROP_IMAGES[target]![effect]![type];

        // determine the size and the position of the image
        let width = image.width;
        let height = image.height;
        if (width > height) {
          width = size * 2 * 0.8;
          height = height * (width / image.width);
        } else {
          height = size * 2 * 0.8;
          width = width * (height / image.height);
        }

        ctx.drawImage(image, x - size + (size * 2 - width) / 2, y - size + (size * 2 - height) / 2, width, height);

        ctx.closePath();
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawDrops();
    }

    animate();
  }, [props.gameMember.drops]);*/

  return (
    <>
      {props.gameMember.drops.map(drop => (
        <div key={`${drop.id}`}
             className={`${style.drop} ${style[drop.type]} ${style[drop.target]}`}
             style={{
               left: `${(drop.position[0] - drop.size) * cellSize}px`,
               top: `${(drop.position[1] - drop.size) * cellSize}px`,
               width: `${cellSize * drop.size * 2}px`,
               height: `${cellSize * drop.size * 2}px`,
             }}>
          <img src={`/assets/drops/${drop.effect}_${drop.type}.svg`} alt={`${drop.type} drop for ${drop.effect}`} />
        </div>
      ))}
    </>
  );
}