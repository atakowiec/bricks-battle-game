import { ReactNode } from 'react';
import style from '../style/globals.module.scss';


export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container(props: ContainerProps) {
  return (
    <div className={`${style.globalContainer} ${props.className ?? ''} col-12 col-md-8 col-lg-6 col-xl-4`}>
      {props.children}
    </div>
  );
}