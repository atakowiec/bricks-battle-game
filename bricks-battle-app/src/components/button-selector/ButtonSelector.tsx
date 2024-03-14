import { ReactNode, useMemo } from 'react';
import style from '../../style/globals.module.scss';

export interface ButtonSelectorProps {
  children: JSX.Element[];
  active: any;
  setActive: (id: any) => void;
}

export interface SelectButtonProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function ButtonSelector(props: ButtonSelectorProps) {
  const elements = useMemo(() => props.children.filter(child => child.type == SelectButton)
    .map(child => ({ id: child.props.id, children: child.props.children, className: child.props.className })), [props]);

  return (
    <div className={style.buttonSelectorBox}>
      {
        elements.map(element => (
          <div key={element.id}
               className={`${style.selectButton} ${element.className ?? ""} ${props.active == element.id ? style.active : ''}`}
               onClick={() => props.setActive(element.id)}>
            {element.children}
          </div>
        ))
      }
    </div>
  );
}

export function SelectButton(_: SelectButtonProps) {
  return <></>;
}