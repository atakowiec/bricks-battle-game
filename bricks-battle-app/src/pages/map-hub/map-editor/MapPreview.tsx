import style from '../MapHub.module.scss';
import { MapEditorState, StateProps } from './MapEditor.tsx';
import { useEffect, useRef, useState } from 'react';
import { produce } from 'immer';
import { Cell } from './Cell.tsx';

export function MapPreview(props: StateProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState(0);

  useEffect(() => {
    if (!boxRef.current) return;

    const box = boxRef.current;

    const width = box.clientWidth;
    setCellSize(Math.floor(width / props.state.size));
  }, [props.state.size]);

  function onCellClick(row: number, col: number) {
    props.setState((prevState: MapEditorState) => {
      return produce(prevState, draft => {
        const { tool, map } = draft;
        const selected = draft.block?.id ?? '0';
        const clickedColor = map[row][col] ?? '0';

        if (tool === 'pen') {
          map[row][col] = selected == clickedColor ? '0' : selected;
        }

        if (tool === 'eraser') {
          map[row][col] = '0';
        }

        if (tool === 'fill') {
          const visited: string[] = [];

          function fillCell(row: number, col: number) {
            if (row < 0 || col < 0)
              return;
            if (row >= draft.map.length || col >= draft.map[0].length)
              return;

            const cell: string = draft.map[row][col];
            if (visited.includes(`${row}-${col}`) || (cell != clickedColor))
              return;

            visited.push(`${row}-${col}`);

            draft.map[row][col] = selected;

            for (let i of [-1, 1]) {
              fillCell(row + i, col);
              fillCell(row, col + i);
            }
          }

          fillCell(row, col);
        }

        return draft;
      });
    });
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