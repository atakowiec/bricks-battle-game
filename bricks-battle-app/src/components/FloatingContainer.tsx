import style from '../style/globals.module.scss';
import { ReactNode } from 'react';

export interface FloatingContainerProps {
  children?: ReactNode;
  className?: string;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  width?: 'narrow' | 'normal' | 'wide' | 'auto';
}

const widthMap = {
  narrow: 'col-12 col-md-7 col-lg-6 col-xl-4 col-xxl-3',
  normal: 'col-12 col-md-8 col-lg-6 col-xl-5 col-xxl-4',
  wide: 'col-12 col-md-9 col-lg-7 col-xl-6 col-xxl-5',
  auto: ''
};

export default function FloatingContainer({ children, className, visible, setVisible, width }: FloatingContainerProps) {
  function close() {
    setVisible(false);
  }

  function stopPropagation(event: any) {
    event.stopPropagation();
  }

  if (!visible) return <></>;

  return (
    <div className={style.floatingContainerBackground} onClick={close}>
      <div className={`${className ?? ''} ${style.floatingContainer} ${widthMap[width ?? "auto"] ?? ''}`}
           onClick={stopPropagation}>
        {children}
      </div>
    </div>
  );
}