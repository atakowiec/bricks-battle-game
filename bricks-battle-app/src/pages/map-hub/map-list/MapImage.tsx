import { IMap } from '@shared/Map.ts';
import { useMemo } from 'react';
import { encodeMap } from '../../../utils/utils.ts';
import useSelector from '../../../hooks/useSelector.ts';


export function MapImage(props: { map: IMap }) {
  const mapColors = useMemo(() => encodeMap(props.map), [props.map.data, props.map.size]);
  const mapBlocks = useSelector(state => state.commonData.blocks);
  const arr = Array.from({ length: props.map.size });

  return (
    <svg viewBox={`0 0 ${props.map.size} ${props.map.size}`} xmlns="http://www.w3.org/2000/svg">
      <rect x={0} y={0} width={props.map.size} height={props.map.size} fill="#00000070" />
      {arr.map((_, y) => arr.map((_, x) => {
        const blockId = mapColors[y]?.[x] ?? '0';
        const blockColor = mapBlocks[blockId]?.data ?? undefined;

        if (!blockColor) return null;
        return (
          <rect
            key={`block-${props.map.name}-${x}-${y}`}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={blockColor}
          />
        );
      }))}
    </svg>
  );
}