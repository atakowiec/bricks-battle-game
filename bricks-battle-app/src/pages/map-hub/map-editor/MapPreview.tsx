import style from '../MapHub.module.scss';
import { StateProps } from './MapEditor.tsx';
import useSelector from '../../../hooks/useSelector.ts';
import { Base64 } from '../../../utils/utils.ts';
import { IMapBlock } from '@shared/Map.ts';
import { useEffect, useRef, useState } from 'react';

export function MapPreview(props: StateProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    if (!boxRef.current) return;

    const box = boxRef.current;

    const width = box.clientWidth;
    setCellSize(width / props.state.size);
  }, [props.state.size]);

  function onCellClick(row: number, col: number) {
    const size = props.state.size;
    const map = props.state.map.split('');
    const index = row * size + col;

    if (props.state.tool === 'pen') {
      map[index] = Base64.fromInt(props.state.block?.id ?? 0);
    } else if (props.state.tool === 'eraser') {
      map[index] = '0';
    } else if (props.state.tool === 'fill') {
      const targetId = map[index];
      const fill = (r: number, c: number) => {
        if (r < 0 || r >= size || c < 0 || c >= size) return;
        if (map[r * size + c] !== targetId) return;
        map[r * size + c] = Base64.fromInt(props.state.block?.id ?? 0);
        fill(r - 1, c);
        fill(r + 1, c);
        fill(r, c - 1);
        fill(r, c + 1);
      };
      fill(row, col);
    }

    props.setState({ ...props.state, map: map.join('') });
  }

  return (
    <div className={style.previewBox}
         ref={boxRef}>
      {Array.from({ length: props.state.size * 0.7 }).map((__, row: number) => (
        <div className={style.row} key={`row-${row}`}>
          {Array.from({ length: props.state.size }).map((_, col: number) => (
            <Cell key={`cell-${col}-${row}`}
                  row={row}
                  col={col}
                  stateObj={props}
                  size={cellSize}
                  onClick={() => onCellClick(row, col)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface CellProps {
  row: number;
  col: number;
  stateObj: StateProps;
  size: number;
  onClick: () => void;
}

function Cell(props: CellProps) {
  const size = props.stateObj.state.size;
  const block64Id = props.stateObj.state.map[props.row * size + props.col] ?? '0';
  const block: IMapBlock = useSelector(state => state.commonData.blocks[Base64.toInt(block64Id)]) ?? {};

  return (
    <div className={style.cell}
         style={{
           width: props.size + 'px',
           height: props.size + 'px',
           background: block.data,
         }}
         onClick={props.onClick}
    />
  );
}