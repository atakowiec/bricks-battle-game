import { ReactNode } from 'react';
import style from "../style/globals.module.scss"

export function InlineButtons(props: {children: ReactNode, className?: string}) {
  return (
    <div className={`${style.inlineButtonsBox} ${props.className ?? ''}`}>
      {props.children}
    </div>
  )
}