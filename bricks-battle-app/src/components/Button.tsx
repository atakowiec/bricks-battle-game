import { ReactNode } from 'react';
import style from '../style/globals.module.scss';

export interface ContainerProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary';
  width?: "full" | "auto";
  disabled?: boolean;
}

export default function Button(props: ContainerProps) {
  return (
    <button className={`${props.type === 'secondary' ? style.buttonSecondary : style.button} ${props.className ?? ''} ${style[props.width ?? 'full']} ${props.disabled ? style.disabled : ''}`}
            disabled={props.disabled}
            onClick={props.onClick}>
      {props.children}
    </button>
  );
}