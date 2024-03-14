import { ReactNode } from 'react';
import style from '../style/globals.module.scss';

export interface ContainerProps {
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button(props: ContainerProps) {
  return (
    <button className={`${style.button} ${props.className ?? ''}`}>
      {props.children}
    </button>
  );
}