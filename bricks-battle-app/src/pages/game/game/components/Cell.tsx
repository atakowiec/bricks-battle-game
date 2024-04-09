import style from "../Game.module.scss"
import { CSSProperties } from 'react';

interface CellProps {
  style?: CSSProperties
}

export function Cell(props: CellProps) {
  return (
    <div className={style.boardCell} style={props.style} />
  )
}