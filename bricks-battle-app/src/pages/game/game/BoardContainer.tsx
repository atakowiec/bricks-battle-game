import style from './Game.module.scss';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

const BoardSizeContext = createContext(0);

export function useBoardSize() {
  return useContext(BoardSizeContext);
}

export function BoardContainer(props: { children: ReactNode, className?: string}) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    onResize();

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  function onResize() {
    setSize(Math.min(boardRef.current!.offsetWidth, boardRef.current!.offsetHeight) - 15);
  }

  return (
    <div className={`${style.boardContainer} ${props.className ?? ''}`} ref={boardRef}>
      <div className={style.boardBox} style={{ height: `${size + 15}px`, width: `${size + 15}px` }}>
        <BoardSizeContext.Provider value={size}>
          {props.children}
        </BoardSizeContext.Provider>
      </div>
    </div>
  );
}