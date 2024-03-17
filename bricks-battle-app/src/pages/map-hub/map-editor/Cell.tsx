import { StateProps } from './MapEditor.tsx';
import { IMapBlock } from '@shared/Map.ts';
import useSelector from '../../../hooks/useSelector.ts';
import { Base64 } from '../../../utils/utils.ts';
import style from '../MapHub.module.scss';

interface CellProps {
  row: number;
  col: number;
  stateObj: StateProps;
  size: number;
  onClick: () => void;
}

export function Cell(props: CellProps) {
  const block64Id = props.stateObj.state.map[props.row][props.col] ?? '0';
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