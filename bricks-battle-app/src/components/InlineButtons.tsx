import { ReactNode } from 'react';
import style from "../style/globals.module.scss"

export function InlineButtons(props: {children: ReactNode}) {
  return (
    <div className={style.inlineButtonsBox}>
      {props.children}
    </div>
  )
}