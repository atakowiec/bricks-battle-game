import { ReactNode } from 'react';
import style from '../style/globals.module.scss';

export interface ContainerProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: 'primary' | 'secondary';
}

export default function Button(props: ContainerProps) {
  return (
    <button className={`${props.type === 'secondary' ? style.buttonSecondary : style.button} ${props.className ?? ''}`}
            onClick={props.onClick}>
      {props.children}
    </button>
  );
}