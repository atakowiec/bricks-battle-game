import style from '../style/globals.module.scss';
import { Dispatch, ReactNode, SetStateAction } from 'react';

interface TogglerProps {
  isToggled: boolean;
  setIsToggled: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  children_location?: 'left' | 'right';
  className?: string;
}

export const Toggler = ({
                          isToggled,
                          setIsToggled,
                          children,
                          children_location = 'right',
                          className = '',
                        }: TogglerProps) => {
  function toggle() {
    setIsToggled(prev => !prev);
  }

  return (
    <div onClick={toggle} className={`${style.togglerBox} ${className}`}>
      {children && children_location === 'left' && children}
      <div className={`${style.toggler} ${isToggled ? style.toggled : ''}`} />
      {children && children_location === 'right' && children}
    </div>
  );
};